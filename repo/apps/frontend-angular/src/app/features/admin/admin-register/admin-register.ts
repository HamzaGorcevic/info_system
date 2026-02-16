import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UiButton } from '../../../shared/ui/button/button';
import { UiModal } from '../../../shared/ui/modal/modal';
import { LocationPicker } from '../../../shared/ui/location-picker/location-picker';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButton, UiModal, RouterModule, LocationPicker],
  templateUrl: './admin-register.html',
  styleUrl: './admin-register.css',
})
export class AdminRegister {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  showSuccessModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      buildingName: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      numberApartments: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;
      this.cdr.detectChanges();

      this.authService.registerAdmin(this.registerForm.value)
        .pipe(finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (res) => {
            this.success = true;
            this.showSuccessModal = true;
          },
          error: (err) => {
            console.error('Registration Error:', err);
            const errorBody = err.error;
            this.error = errorBody?.error || errorBody?.message || err.message || 'Registration failed.';

            if (Array.isArray(this.error)) {
              this.error = (this.error as any).map((e: any) => e.message || JSON.stringify(e)).join(', ');
            }
          }
        });
    }
  }

  navigateToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
