import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, UiCard, UiButton],
    template: `
    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12">
      <div class="max-w-7xl mx-auto">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 animate-fade-in-up">
          <div>
            <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-[#1B3C53] mb-2">
              COMMAND <span class="text-gradient">CENTER</span>
            </h1>
            <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-xs">System Administration Dashboard</p>
          </div>
          <div class="mt-6 md:mt-0 flex items-center gap-4">
            <div class="text-right hidden md:block">
              <p class="text-[10px] font-black text-[#456882] uppercase tracking-widest">Active Session</p>
              <p class="text-sm font-bold text-[#1B3C53]">Administrator</p>
            </div>
            <app-ui-button variant="outline" (btnClick)="logout()" class="!rounded-full px-8">LOGOUT</app-ui-button>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div class="animate-fade-in-up stagger-1">
            <app-ui-card title="TENANT MANAGEMENT" class="h-full">
              <div class="flex flex-col h-full">
                <p class="text-[#456882] mb-8 leading-relaxed">Review, verify, and manage resident registration requests across all your properties.</p>
                <div class="mt-auto">
                  <app-ui-button variant="primary" class="w-full" routerLink="/admin/tenants">
                    MANAGE REQUESTS
                  </app-ui-button>
                </div>
              </div>
            </app-ui-card>
          </div>

          <div class="animate-fade-in-up stagger-2">
            <app-ui-card title="BUILDING ACCESS" class="h-full">
              <div class="flex flex-col h-full">
                <p class="text-[#456882] mb-8 leading-relaxed">Generate secure QR codes and unique registration links for your building assets.</p>
                <div class="mt-auto">
                  <app-ui-button variant="primary" class="w-full" routerLink="/admin/qr">
                    GENERATE ACCESS
                  </app-ui-button>
                </div>
              </div>
            </app-ui-card>
          </div>

          <div class="animate-fade-in-up stagger-3">
            <app-ui-card title="SYSTEM STATUS" class="h-full">
              <div class="space-y-6">
                <div class="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-green-800">Database</p>
                    <p class="text-xs font-bold text-green-900">Online & Synchronized</p>
                  </div>
                </div>
                
                <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-blue-800">Auth Service</p>
                    <p class="text-xs font-bold text-blue-900">Encrypted & Active</p>
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <p class="text-[10px] font-black text-[#456882] uppercase tracking-widest mb-2">Quick Stats</p>
                  <div class="flex justify-between items-end">
                    <span class="text-3xl font-black text-[#1B3C53]">100%</span>
                    <span class="text-[10px] font-bold text-[#456882]">UPTIME</span>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Dashboard implements OnInit {
    constructor(private authService: AuthService) { }

    ngOnInit() { }

    logout() {
        this.authService.logout();
        window.location.href = '/login';
    }
}
