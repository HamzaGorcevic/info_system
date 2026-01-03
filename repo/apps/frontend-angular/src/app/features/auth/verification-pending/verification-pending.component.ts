import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-verification-pending',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-scale-in">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-yellow-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-[#1B3C53] mb-2">VERIFICATION PENDING</h3>
        <p class="text-[#456882] mb-6">Your account is currently awaiting verification by the building manager. You will be able to access the dashboard once your account is approved.</p>
        
        <button (click)="logout()" class="w-full py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#152e40] transition-colors shadow-lg shadow-blue-900/20">
          BACK TO LOGIN
        </button>
      </div>
    </div>
  `
})
export class VerificationPendingComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
