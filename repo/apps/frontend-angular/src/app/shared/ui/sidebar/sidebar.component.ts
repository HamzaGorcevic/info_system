import { Component, Input, inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="h-screen w-72 bg-[#1B3C53] text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50 overflow-hidden">
      <!-- Logo / Brand -->
      <div class="p-8 pb-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
            <span class="material-icons text-white text-xl">apartment</span>
          </div>
          <h1 class="text-2xl font-black tracking-tighter">
            BUILDING<span class="text-blue-400">APP</span>
          </h1>
        </div>
        <p class="text-xs text-gray-400 font-medium tracking-widest uppercase pl-1">Management System</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <ng-container *ngFor="let item of navItems">
          <a [routerLink]="item.route" 
             routerLinkActive="bg-white/10 !text-white shadow-lg translate-x-1"
             class="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 group">
            <span class="material-icons text-2xl group-hover:scale-110 transition-transform duration-300" 
                  [class.text-blue-400]="rla.isActive"
                  #rla="routerLinkActive"
                  [routerLinkActive]="['active']">{{ item.icon }}</span>
            <span class="font-bold tracking-wide">{{ item.label }}</span>
            
            <!-- Active Indicator -->
            <div *ngIf="rla.isActive" class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
          </a>
        </ng-container>
      </nav>

      <!-- User Profile -->
      <div class="p-4 mt-auto bg-[#152e40]">
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center text-sm font-bold shadow-md">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate text-white">{{ userName }}</p>
            <p class="text-xs text-gray-400 truncate capitalize">{{ userRole }}</p>
          </div>
          <button (click)="logout()" class="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-400" title="Logout">
            <span class="material-icons text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() role: 'manager' | 'tenant' = 'tenant';

  private authService = inject(AuthService);
  private router = inject(Router);

  navItems: NavItem[] = [];

  ngOnInit() {
    this.updateNavItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['role']) {
      this.updateNavItems();
    }
  }

  private updateNavItems() {
    if (this.role === 'manager') {
      this.navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Analytics', icon: 'analytics', route: '/admin/analytics' },
        { label: 'My Buildings', icon: 'domain', route: '/admin/qr' },
        { label: 'Tenants', icon: 'people', route: '/admin/tenants' },
        { label: 'Malfunctions', icon: 'build', route: '/admin/malfunctions' },
        { label: 'Servicers', icon: 'engineering', route: '/admin/servicers' },
        { label: 'Access Tokens', icon: 'vpn_key', route: '/admin/tokens' },
        { label: 'Suggestions', icon: 'lightbulb', route: '/admin/suggestions' },
        { label: 'Announcements', icon: 'campaign', route: '/admin/announcements' },
        { label: 'Documents', icon: 'folder', route: '/admin/documents' },
        { label: 'Expenses', icon: 'receipt_long', route: '/admin/expenses' },
      ];
    } else {
      this.navItems = [
        { label: 'Dashboard', icon: 'home', route: '/tenant/dashboard' },
        { label: 'My Stats', icon: 'pie_chart', route: '/tenant/stats' },
        { label: 'Malfunctions', icon: 'build', route: '/tenant/malfunctions' },
        { label: 'Suggestions', icon: 'lightbulb', route: '/tenant/suggestions' },
        { label: 'Announcements', icon: 'campaign', route: '/tenant/announcements' },
        { label: 'Documents', icon: 'folder', route: '/tenant/documents' },
        { label: 'My Expenses', icon: 'receipt_long', route: '/tenant/expenses' },
      ];
    }
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get userName() {
    return this.currentUser?.full_name || this.currentUser?.email || 'User';
  }

  get userRole() {
    return this.currentUser?.role || this.role;
  }

  get userInitials() {
    const name = this.userName;
    if (name === 'User') return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
