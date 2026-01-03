import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCard } from '../../../shared/ui/card/card';
import { ServicerService } from '../../../services/servicer.service';

@Component({
  selector: 'app-servicer-malfunction-detail',
  standalone: true,
  imports: [CommonModule, UiCard],
  template: `
    <div class="w-full max-w-4xl animate-fade-in-up">
      <header class="mb-8 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-black tracking-tighter text-[#1B3C53] mb-2">
          MALFUNCTION <span class="text-gradient">DETAILS</span>
        </h1>
        <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-xs">Assigned Task</p>
      </header>

      <app-ui-card>
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Image -->
          <div class="w-full md:w-1/2 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
            <img *ngIf="data.malfunctions.image_url" [src]="data.malfunctions.image_url" class="w-full h-64 md:h-full object-cover" alt="Malfunction">
            <div *ngIf="!data.malfunctions.image_url" class="w-full h-64 md:h-full flex items-center justify-center text-[#456882]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>

          <!-- Details -->
          <div class="w-full md:w-1/2 flex flex-col">
            <div class="mb-6">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                [ngClass]="{
                  'bg-blue-100 text-blue-800': data.malfunctions.status === 'reported',
                  'bg-yellow-100 text-yellow-800': data.malfunctions.status === 'in_progress',
                  'bg-green-100 text-green-800': data.malfunctions.status === 'resolved'
                }">
                {{ data.malfunctions.status.replace('_', ' ') }}
              </span>
              <h2 class="text-2xl font-black text-[#1B3C53] mb-2">{{ data.malfunctions.title }}</h2>
              <p class="text-[#456882] font-bold uppercase tracking-wider text-sm">{{ data.malfunctions.category }}</p>
            </div>

            <div class="prose prose-sm text-[#456882] mb-8">
              <p>{{ data.malfunctions.description }}</p>
            </div>

            <!-- Status Actions -->
            <div class="mb-6 grid grid-cols-2 gap-3">
              <button 
                *ngIf="data.malfunctions.status === 'reported' || data.malfunctions.status === 'assigned'"
                (click)="updateStatus('in_progress')"
                [disabled]="isUpdating"
                class="col-span-2 py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#152e40] transition-colors disabled:opacity-50">
                {{ isUpdating ? 'UPDATING...' : 'START WORK' }}
              </button>

              <button 
                *ngIf="data.malfunctions.status === 'in_progress'"
                (click)="updateStatus('resolved')"
                [disabled]="isUpdating"
                class="col-span-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                {{ isUpdating ? 'UPDATING...' : 'MARK AS RESOLVED' }}
              </button>
            </div>

            <div class="mt-auto pt-6 border-t border-gray-100">
              <div class="flex items-start gap-3">
                <div class="mt-1 text-[#1B3C53]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-[#456882] uppercase tracking-wider mb-1">LOCATION</p>
                  <p class="font-bold text-[#1B3C53]">Building ID: {{ data.building_id }}</p>
                  <p class="text-xs text-[#456882] mt-1">Access expires: {{ data.expires_at | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-ui-card>
    </div>
  `
})
export class ServicerMalfunctionDetailComponent {
  @Input() data: any;
  private servicerService = inject(ServicerService);
  private cdr = inject(ChangeDetectorRef);
  isUpdating = false;

  updateStatus(status: string) {
    this.isUpdating = true;
    this.servicerService.updateStatus(this.data.token, status).subscribe({
      next: () => {
        this.data.malfunctions.status = status;
        this.isUpdating = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.isUpdating = false;
        this.cdr.detectChanges();
      }
    });
  }
}
