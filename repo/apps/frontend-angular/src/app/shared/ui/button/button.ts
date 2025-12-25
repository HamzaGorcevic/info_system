import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      [type]="type" 
      [disabled]="disabled || loading"
      [class]="'btn ' + variantClass + ' ' + customClass"
      (click)="handleClick($event)"
    >
      <span *ngIf="!loading" class="flex items-center gap-2">
        <ng-content></ng-content>
      </span>
      <span *ngIf="loading" class="flex items-center gap-2">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        PROCESSING...
      </span>
    </button>
  `
})
export class UiButton {
    @Input() type: 'button' | 'submit' = 'button';
    @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() customClass = '';
    @Output() btnClick = new EventEmitter<MouseEvent>();

    get variantClass(): string {
        return `btn-${this.variant}`;
    }

    handleClick(event: MouseEvent) {
        if (!this.disabled && !this.loading) {
            this.btnClick.emit(event);
        }
    }
}
