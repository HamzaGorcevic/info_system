import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#1B3C53]/80 backdrop-blur-sm" (click)="close()"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-2xl border-t-8 border-[#1B3C53] shadow-[20px_20px_0px_0px_rgba(27,60,83,0.2)] p-0">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b-2 border-[#E3E3E3]">
          <h2 class="text-2xl font-black m-0">{{ title }}</h2>
          <button (click)="close()" class="text-[#456882] hover:text-[#1B3C53] transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-8">
          <ng-content></ng-content>
        </div>
        
        <!-- Footer -->
        <div *ngIf="showFooter" class="p-6 bg-[#E3E3E3]/30 flex justify-end gap-4">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class UiModal {
    @Input() isOpen = false;
    @Input() title = '';
    @Input() showFooter = true;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.isOpen = false;
        this.closed.emit();
    }
}
