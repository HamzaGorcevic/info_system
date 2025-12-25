import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="'bg-white border-2 border-[#1B3C53] shadow-[10px_10px_0px_0px_rgba(27,60,83,1)] ' + customClass">
      <div *ngIf="title" class="p-4 border-b-2 border-[#1B3C53] bg-[#1B3C53] text-white">
        <h3 class="text-sm font-black uppercase tracking-widest m-0">{{ title }}</h3>
      </div>
      <div class="p-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class UiCard {
    @Input() title = '';
    @Input() customClass = '';
}
