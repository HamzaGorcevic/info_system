import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-[#F0F2F5]">
      <app-sidebar role="manager"
                   [isOpen]="isMobileSidebarOpen" 
                   (close)="isMobileSidebarOpen = false">
      </app-sidebar>

      <main class="flex-1 lg:ml-72 ml-0 p-4 lg:p-8 transition-all duration-300">
        <!-- Mobile Header -->
        <div class="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm">
          <button (click)="isMobileSidebarOpen = true" 
                  class="p-2 -ml-2 text-gray-600 hover:text-[#1B3C53] hover:bg-gray-100 rounded-xl transition-all">
            <span class="material-icons text-2xl">menu</span>
          </button>
          <span class="font-bold text-[#1B3C53]">Admin Portal</span>
          <div class="w-10"></div>
        </div>

        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  isMobileSidebarOpen = false;
}
