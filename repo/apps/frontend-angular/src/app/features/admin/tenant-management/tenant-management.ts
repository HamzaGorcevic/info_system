import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingService } from '../../../services/building.service';
import { AuthService } from '../../../services/auth.service';
import { UiButton } from '../../../shared/ui/button/button';
import { RouterModule } from '@angular/router';

import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, UiButton, RouterModule, BackButtonComponent],
  template: `

    <div class="min-h-screen bg-mesh p-6 md:p-12 pt-0">
      <div class="max-w-5xl mx-auto">
        <div class="mb-6">
            <app-back-button route="/dashboard" label="Back to Dashboard"></app-back-button>
        </div>
        <header class="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end animate-fade-in-up">
          <div>
            <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
              RESIDENT <span class="text-gradient">VERIFICATION</span>
            </h1>
            <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Pending Access Authorization Queue</p>
          </div>
          <div class="mt-8 md:mt-0 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-6">
            <div class="text-right">
              <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-1">Total Pending</p>
              <p class="text-4xl font-black text-[#1B3C53] leading-none">{{ pendingTenants.length }}</p>
            </div>
            <div class="w-12 h-12 bg-[#F0F2F5] rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </header>

        <div *ngIf="pendingTenants.length === 0" class="animate-fade-in-up stagger-1">
          <div class="bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#456882]/20 p-20 rounded-[3rem] text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-8">
              <svg class="w-10 h-10 text-[#456882]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="text-[#456882] font-black uppercase tracking-[0.2em] text-sm">Queue is currently empty</p>
            <p class="text-[#456882]/60 text-xs mt-2">All registration requests have been processed.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div *ngFor="let tenant of pendingTenants; let i = index" 
               class="animate-fade-in-up" 
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(27,60,83,0.05)] border border-gray-50 flex flex-col md:flex-row justify-between items-center group hover:shadow-[0_25px_60px_rgba(27,60,83,0.1)] transition-all duration-500 hover:-translate-y-1">
              <div class="flex items-center gap-8 w-full md:w-auto">
                <div class="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#1B3C53] transition-colors duration-500">
                  <span class="text-2xl font-black text-[#1B3C53] group-hover:text-white transition-colors duration-500">
                    {{ tenant.users?.full_name?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-[#1B3C53] tracking-tight">{{ tenant.users?.full_name }}</h3>
                  <div class="flex flex-wrap gap-6 mt-2">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black text-[#456882] uppercase tracking-widest">Building</span>
                      <span class="text-xs font-bold text-[#1B3C53] truncate max-w-[150px]">{{ tenant.buildings?.building_name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black text-[#456882] uppercase tracking-widest">Unit</span>
                      <span class="text-xs font-bold text-[#1B3C53] bg-[#F0F2F5] px-3 py-1 rounded-lg">APT {{ tenant.apartment_number }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black text-[#456882] uppercase tracking-widest">Email</span>
                      <span class="text-xs font-bold text-[#1B3C53]">{{ tenant.users?.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-8 md:mt-0 w-full md:w-auto">
                <app-ui-button variant="primary" (btnClick)="verify(tenant.user_id)" customClass="w-full md:w-auto !rounded-2xl shadow-lg shadow-[#1B3C53]/10">
                  AUTHORIZE ACCESS
                </app-ui-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TenantManagement implements OnInit {
  pendingTenants: any[] = [];

  constructor(
    private buildingService: BuildingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.loadPending(user.id);
    } else {
      // Fallback to localStorage if signal is not yet set
      const session = JSON.parse(localStorage.getItem('sb-session') || '{}');
      const userId = session.user?.id || session.user?.profile?.id;
      if (userId) {
        this.loadPending(userId);
      }
    }
  }

  loadPending(adminId: string) {
    this.authService.getAdminBuildings(adminId).subscribe({
      next: (buildings: any[]) => {
        this.pendingTenants = [];
        buildings.forEach(building => {
          this.buildingService.getUnverifiedTenants(building.id).subscribe({
            next: (tenants: any[]) => {
              this.pendingTenants = [...this.pendingTenants, ...tenants];
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading tenants for building:', building.id, err)
          });
        });
      },
      error: (err) => console.error('Error loading admin buildings:', err)
    });
  }

  verify(userId: string) {
    const admin = this.authService.currentUser();
    const adminId = admin?.id || JSON.parse(localStorage.getItem('sb-session') || '{}').user?.id;

    if (adminId) {
      this.buildingService.verifyTenant(userId, adminId).subscribe({
        next: () => {
          console.log('Tenant verified successfully');
          this.loadPending(adminId);
        },
        error: (err) => console.error('Error verifying tenant:', err)
      });
    }
  }
}
