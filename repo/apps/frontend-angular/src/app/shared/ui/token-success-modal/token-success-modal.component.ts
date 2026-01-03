import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../button/button';

@Component({
    selector: 'app-token-success-modal',
    standalone: true,
    imports: [CommonModule, UiButton],
    template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in">
        <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scale-in text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-green-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-[#1B3C53] mb-2">ACCESS GRANTED</h3>
          <p class="text-[#456882] mb-6">Share this link with {{ servicerName || 'the servicer' }} to grant access.</p>
          
          <div class="bg-gray-100 p-4 rounded-xl mb-6 break-all font-mono text-sm text-[#1B3C53] relative group cursor-pointer" (click)="copyLink()">
            {{ getMagicLink() }}
            <div class="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <span class="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Click to Copy</span>
            </div>
          </div>

          <app-ui-button variant="primary" customClass="w-full" (btnClick)="close()">DONE</app-ui-button>
        </div>
      </div>
  `
})
export class TokenSuccessModalComponent {
    @Input() isOpen = false;
    @Input() token: string | null = null;
    @Input() servicerName: string = '';
    @Output() closed = new EventEmitter<void>();

    getMagicLink(): string {
        if (!this.token) return '';
        return `${window.location.origin}/servicer/access/${this.token}`;
    }

    copyLink() {
        if (this.token) {
            navigator.clipboard.writeText(this.getMagicLink()).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }
}
