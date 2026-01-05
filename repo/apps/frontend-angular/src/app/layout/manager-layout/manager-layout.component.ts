import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/ui/sidebar/sidebar.component';

@Component({
    selector: 'app-manager-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    template: `
    <div class="flex min-h-screen bg-[#F0F2F5]">
      <app-sidebar role="manager"></app-sidebar>
      <main class="flex-1 ml-72 p-8 transition-all duration-300">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class ManagerLayoutComponent { }
