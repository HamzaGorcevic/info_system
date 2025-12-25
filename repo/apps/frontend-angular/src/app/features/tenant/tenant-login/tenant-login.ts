import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UiButton } from '../../../shared/ui/button/button';
import { UiCard } from '../../../shared/ui/card/card';

@Component({
    selector: 'app-tenant-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, UiButton, UiCard],
    template: `
    <div class="min-h-screen bg-[#E3E3E3] flex flex-col items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="mb-12 text-center">
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53] mb-2">RESIDENT</h1>
          <p class="text-[#456882] font-bold uppercase tracking-widest text-xs">Access Portal</p>
        </div>

        <app-ui-card title="RESIDENT LOGIN">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div *ngIf="error" class="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
              <p class="text-xs text-red-700 font-black uppercase tracking-widest">{{ error }}</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-2">Email Address</label>
                <input type="email" formControlName="email" placeholder="RESIDENT@EMAIL.COM" class="input-field">
              </div>

              <div>
                <label class="block text-[10px] font-black text-[#456882] tracking-[0.2em] uppercase mb-2">Password</label>
                <input type="password" formControlName="password" placeholder="••••••••" class="input-field">
              </div>
            </div>

            <div class="pt-4">
              <app-ui-button 
                type="submit" 
                variant="primary" 
                class="w-full"
                [loading]="loading"
                [disabled]="loginForm.invalid"
              >
                AUTHORIZE ACCESS
              </app-ui-button>
            </div>

            <div class="text-center pt-4 border-t border-[#E3E3E3]">
              <p class="text-[10px] font-bold text-[#456882] tracking-widest uppercase">
                Need to register? 
                <a routerLink="/tenant/register" class="text-[#1B3C53] hover:underline ml-2 font-black">Register Profile</a>
              </p>
              <p class="text-[8px] font-bold text-[#456882] mt-2 opacity-60 uppercase tracking-tighter">
                * Requires Building ID from your administrator
              </p>
            </div>
          </form>
        </app-ui-card>
      </div>
    </div>
  `
})
export class TenantLogin {
    loginForm: FormGroup;
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
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

            this.authService.login(this.loginForm.value).subscribe({
                next: (res) => {
                    this.loading = false;
                    this.router.navigate(['/tenant/dashboard']);
                },
                error: (err) => {
                    this.loading = false;
                    this.error = err.error?.error || 'Login failed.';
                }
            });
        }
    }
}
