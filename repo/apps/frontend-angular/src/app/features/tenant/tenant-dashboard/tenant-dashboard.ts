import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';
import { SidebarComponent } from '../../../shared/ui/sidebar/sidebar.component';
import { TenantData } from '../../../models/domain.models';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, UiCard, UiButton],
  template: `
    <div class="min-h-screen bg-mesh p-6 md:p-12 pt-0">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-black text-[#1B3C53] mb-8 animate-fade-in-up">Dashboard</h1>

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
                    <p class="font-bold text-[#1B3C53] truncate">
                      <ng-container *ngIf="isLoading">Loading...</ng-container>
                      <ng-container *ngIf="!isLoading && error">{{ error }}</ng-container>
                      <ng-container *ngIf="!isLoading && !error && !tenantData">No building data</ng-container>
                      <ng-container *ngIf="!isLoading && !error && tenantData">{{ tenantData.buildings?.building_name }}</ng-container>
                    </p>
                  </div>
                  <div class="p-4 border-2 border-[#F0F2F5] rounded-2xl">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-1">Unit</p>
                    <p class="font-bold text-[#1B3C53]">
                      <ng-container *ngIf="isLoading">...</ng-container>
                      <ng-container *ngIf="!isLoading && error">...</ng-container>
                      <ng-container *ngIf="!isLoading && !error && !tenantData">...</ng-container>
                      <ng-container *ngIf="!isLoading && !error && tenantData">APT {{ tenantData.apartment_number }}</ng-container>
                    </p>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>

          <div class="animate-fade-in-up stagger-3">
            <app-ui-card title="QUICK ACTIONS">
              <div class="space-y-4">
                <app-ui-button variant="primary" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified" (btnClick)="navigateTo('/tenant/malfunctions')">
                  MALFUNCTIONS
                </app-ui-button>
                <app-ui-button variant="outline" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified" (btnClick)="navigateTo('/tenant/expenses')">
                  VIEW EXPENSES
                </app-ui-button>
                <app-ui-button variant="primary" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified" (btnClick)="navigateTo('/tenant/announcements')">
                  ANNOUNCEMENTS
                </app-ui-button>
                <app-ui-button variant="outline" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified" (btnClick)="navigateTo('/tenant/suggestions')">
                  SUGGESTIONS
                </app-ui-button>
                <app-ui-button variant="ghost" customClass="w-full !py-6 !text-sm" [disabled]="!isVerified" (btnClick)="navigateTo('/tenant/documents')">
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
export class TenantDashboard implements OnInit, OnDestroy {
  isVerified = false;
  tenantData: TenantData | null = null;
  error: string | null = null;
  isLoading = true;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private buildingService: BuildingService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.isVerified = user.is_verified || false;

      this.loadTenantData(user.id);
    } else {
      this.isLoading = false;
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  private loadTenantData(userId: string) {
    // Run HTTP request outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.subscription = this.buildingService.getTenantData(userId)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            // Update view inside Angular zone
            this.ngZone.run(() => {
              this.tenantData = data;
              this.isLoading = false;
              // Manually trigger change detection
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            // Update view inside Angular zone
            this.ngZone.run(() => {
              console.error('Error loading tenant data:', err);
              this.error = 'Failed to load data';
              this.isLoading = false;
              // Manually trigger change detection
              this.cdr.detectChanges();
            });
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
