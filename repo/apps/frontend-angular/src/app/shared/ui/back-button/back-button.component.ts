import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-back-button',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <button 
      *ngIf="showButton"
      (click)="goBack()"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#456882] hover:text-[#1B3C53] transition-colors group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
        class="w-5 h-5 group-hover:-translate-x-1 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      <span class="uppercase tracking-wider">{{ label }}</span>
    </button>
  `
})
export class BackButtonComponent {
    @Input() label = 'Back';
    @Input() route: string | null = null;
    @Input() showButton = true;

    constructor(
        private location: Location,
        private router: Router
    ) { }

    goBack() {
        if (this.route) {
            this.router.navigate([this.route]);
        } else {
            this.location.back();
        }
    }
}
