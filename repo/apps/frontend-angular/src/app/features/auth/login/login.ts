import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UiButton } from '../../../shared/ui/button/button';
import { UiCard } from '../../../shared/ui/card/card';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, UiButton, UiCard],
    templateUrl: './login.html',
})
export class Login {
    loginForm: FormGroup;
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.error = null;
            this.cdr.detectChanges();

            this.authService.login(this.loginForm.value)
                .pipe(finalize(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }))
                .subscribe({
                    next: (res) => {
                        const role = res.user?.role;
                        if (role === 'manager') {
                            this.router.navigate(['/dashboard']);
                        } else {
                            this.router.navigate(['/tenant/dashboard']);
                        }
                    },
                    error: (err) => {
                        this.error = err.error?.error || 'Login failed. Please check your credentials.';
                    }
                });
        }
    }
}
