import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-tenant-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="bg-white border-b-2 border-[#1B3C53] mb-8">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <a routerLink="/tenant/dashboard" 
              class="text-lg font-black text-[#1B3C53] hover:text-gradient transition-colors">
              RESIDENT
            </a>
            <div class="flex gap-1">
              <a *ngFor="let link of navLinks" 
                [routerLink]="link.route"
                routerLinkActive="bg-[#1B3C53] text-white"
                [routerLinkActiveOptions]="{exact: link.route === '/tenant/dashboard'}"
                class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#456882] hover:bg-[#F0F2F5] transition-colors">
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class TenantNavComponent {
    navLinks = [
        { label: 'Dashboard', route: '/tenant/dashboard' },
        { label: 'My Malfunctions', route: '/tenant/malfunctions' },
        { label: 'Report Issue', route: '/tenant/malfunctions/report' }
    ];
}
