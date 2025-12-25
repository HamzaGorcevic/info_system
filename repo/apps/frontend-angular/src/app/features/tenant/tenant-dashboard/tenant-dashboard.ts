import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';

@Component({
    selector: 'app-tenant-dashboard',
    standalone: true,
    imports: [CommonModule, UiCard, UiButton],
    template: `
    <div class="min-h-screen bg-mesh p-6 md:p-12">
      <div class="max-w-5xl mx-auto">
        <header class="flex justify-between items-center mb-16 animate-fade-in-up">
          <div>
            <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
              RESIDENT <span class="text-gradient">HUB</span>
            </h1>
            <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-xs">Personal Resident Portal</p>
          </div>
          <app-ui-button variant="outline" (btnClick)="logout()" customClass="!rounded-full px-8">LOGOUT</app-ui-button>
        </header>

        <div *ngIf="!isVerified" class="animate-fade-in-up stagger-1 mb-12">
          <div class="bg-white border-l-8 border-[#1B3C53] p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(27,60,83,0.1)] flex flex-col md:flex-row items-center gap-8">
            <div class="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center shrink-0">
              <div class="w-8 h-8 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 class="text-2xl font-black text-[#1B3C53] mb-2 uppercase">Verification Pending</h2>
              <p class="text-[#456882] font-medium leading-relaxed">Your account is currently awaiting administrator approval. You will gain full access to building features once verified.</p>
            </div>
          </div>
          
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="animate-fade-in-up stagger-2">
            <app-ui-card title="MY RESIDENCE">
              <div class="space-y-8">
                <div class="p-6 bg-[#F0F2F5] rounded-3xl">
                  <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-3">Current Status</p>
                  <div class="flex items-center gap-4">
                    <div [class]="isVerified ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'" 
                         class="w-4 h-4 rounded-full"></div>
                    <span class="text-lg font-black uppercase tracking-tight text-[#1B3C53]">
                      {{ isVerified ? 'Verified Resident' : 'Awaiting Approval' }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 border-2 border-[#F0F2F5] rounded-2xl">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-1">Building</p>
                    <p class="font-bold text-[#1B3C53] truncate">{{ tenantData?.buildings?.building_name || 'Loading...' }}</p>
                  </div>
                  <div class="p-4 border-2 border-[#F0F2F5] rounded-2xl">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-1">Unit</p>
                    <p class="font-bold text-[#1B3C53]">APT {{ tenantData?.apartment_number || '...' }}</p>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>

          <div class="animate-fade-in-up stagger-3">
            <app-ui-card title="QUICK ACTIONS">
              <div class="space-y-4">
                <app-ui-button variant="primary" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified">
                  REPORT MALFUNCTION
                </app-ui-button>
                <app-ui-button variant="outline" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified">
                  VIEW EXPENSES
                </app-ui-button>
                <app-ui-button variant="ghost" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified">
                  BUILDING DOCUMENTS
                </app-ui-button>
              </div>
            </app-ui-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TenantDashboard implements OnInit {
    isVerified = false;
    tenantData: any = null;

    constructor(
        private authService: AuthService,
        private buildingService: BuildingService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user) {
            this.isVerified = user.is_verified;
            this.loadTenantData(user.id);
        }
    }

    loadTenantData(userId: string) {
        if (this.tenantData && this.tenantData.user_id === userId) return;
        this.buildingService.getTenantData(userId).subscribe({
            next: (data) => {
                this.tenantData = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading tenant data:', err)
        });
    }

    logout() {
        this.authService.logout();
        window.location.href = '/login';
    }
}
