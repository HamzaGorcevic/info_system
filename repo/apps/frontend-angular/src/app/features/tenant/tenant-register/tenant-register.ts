import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-tenant-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, UiCard, UiButton],
    template: `
    <div class="min-h-screen bg-mesh flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <!-- Decorative Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1B3C53]/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#456882]/5 rounded-full blur-3xl"></div>

      <div class="w-full max-w-xl relative z-10 animate-fade-in-up">
        <div class="mb-12 text-center">
          <div class="inline-block p-4 bg-white rounded-3xl shadow-xl mb-6">
            <div class="w-12 h-12 bg-[#1B3C53] rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
          </div>
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53] mb-2">
            RESIDENT <span class="text-gradient">ONBOARDING</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px]">Secure Registration Portal</p>
        </div>

        <app-ui-card title="CREATE PROFILE" class="!p-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <div *ngIf="error" class="bg-red-50 border-l-4 border-red-600 p-5 rounded-2xl animate-fade-in-up">
              <p class="text-[10px] text-red-700 font-black uppercase tracking-widest mb-1">Registration Error</p>
              <p class="text-xs text-red-800 font-bold">{{ error }}</p>
            </div>

            <div *ngIf="success" class="bg-green-50 border-l-4 border-green-600 p-6 rounded-2xl animate-fade-in-up">
              <div class="flex items-center gap-4 mb-2">
                <div class="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p class="text-[10px] text-green-700 font-black uppercase tracking-widest">Submission Successful</p>
              </div>
              <p class="text-xs text-green-800 font-bold leading-relaxed">Profile established. Redirecting to secure login for verification status...</p>
            </div>

            <div class="space-y-6">
              <div class="group">
                <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-3 ml-1 transition-colors group-focus-within:text-[#1B3C53]">Full Name</label>
                <input type="text" formControlName="fullName" placeholder="JOHN DOE" class="input-field">
              </div>

              <div class="group">
                <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-3 ml-1 transition-colors group-focus-within:text-[#1B3C53]">Email Address</label>
                <input type="email" formControlName="email" placeholder="resident@example.com" class="input-field">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-3 ml-1 transition-colors group-focus-within:text-[#1B3C53]">Unit Number</label>
                  <input type="number" formControlName="apartmentNumber" placeholder="101" class="input-field">
                </div>

                <div class="group">
                  <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-3 ml-1 transition-colors group-focus-within:text-[#1B3C53]">Security Password</label>
                  <input type="password" formControlName="password" placeholder="••••••••" class="input-field">
                </div>
              </div>
            </div>

            <div class="pt-4">
              <app-ui-button 
                type="submit" 
                variant="primary" 
                customClass="w-full !py-5 !text-sm shadow-xl shadow-[#1B3C53]/20"
                [loading]="loading"
                [disabled]="registerForm.invalid || success"
              >
                INITIALIZE REGISTRATION
              </app-ui-button>
            </div>

            <div class="text-center pt-8 border-t border-gray-100">
              <p class="text-[10px] font-bold text-[#456882] tracking-widest uppercase">
                Already registered? 
                <a routerLink="/login" class="text-[#1B3C53] hover:underline ml-2 font-black">Resident Login</a>
              </p>
            </div>
          </form>
        </app-ui-card>

        <p class="text-center mt-12 text-[10px] font-black text-[#456882]/40 tracking-[0.5em] uppercase">
          © 2025 INFOSYS SECURE
        </p>
      </div>
    </div>
  `
})
export class TenantRegister implements OnInit {
    registerForm: FormGroup;
    loading = false;
    error: string | null = null;
    success = false;
    buildingId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            apartmentNumber: ['', [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit() {
        this.buildingId = this.route.snapshot.queryParamMap.get('buildingId');
        if (!this.buildingId) {
            this.error = "Invalid registration link. Building ID missing.";
        }
    }

    onSubmit() {
        if (this.registerForm.valid && this.buildingId) {
            this.loading = true;
            this.error = null;
            this.cdr.detectChanges();

            const data = {
                ...this.registerForm.value,
                buildingId: this.buildingId
            };

            this.authService.registerTenant(data)
                .pipe(finalize(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }))
                .subscribe({
                    next: (res) => {
                        this.success = true;
                        setTimeout(() => this.router.navigate(['/login']), 3000);
                    },
                    error: (err) => {
                        this.error = err.error?.error || 'Registration failed.';
                    }
                });
        }
    }
}
