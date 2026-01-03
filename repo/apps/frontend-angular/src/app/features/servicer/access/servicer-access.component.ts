import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicerService } from '../../../services/servicer.service';
import { ServicerMalfunctionDetailComponent } from '../malfunction-detail/servicer-malfunction-detail.component';

@Component({
  selector: 'app-servicer-access',
  standalone: true,
  imports: [CommonModule, ServicerMalfunctionDetailComponent],
  template: `
    <div class="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div *ngIf="isLoading" class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-[#456882] font-bold tracking-widest text-sm">VERIFYING ACCESS...</p>
      </div>

      <div *ngIf="error" class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-scale-in">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-red-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-[#1B3C53] mb-2">ACCESS DENIED</h3>
        <p class="text-[#456882]">{{ error }}</p>
      </div>

      <app-servicer-malfunction-detail 
        *ngIf="tokenData" 
        [data]="tokenData">
      </app-servicer-malfunction-detail>
    </div>
  `
})
export class ServicerAccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private servicerService = inject(ServicerService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  error: string | null = null;
  tokenData: any = null;

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error = 'Invalid link. Token is missing.';
      this.isLoading = false;
      return;
    }

    console.log('Starting token verification for:', token);
    this.servicerService.verifyToken(token).subscribe({
      next: (data) => {
        console.log('Token verification success:', data);
        this.tokenData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Token verification failed', err);
        this.error = 'This link is invalid or has expired.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
