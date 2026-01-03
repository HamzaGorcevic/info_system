import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalfunctionService } from '../../../../services/malfunction.service';
import { UiCard } from '../../../../shared/ui/card/card';
import { UiButton } from '../../../../shared/ui/button/button';
import { Malfunction, Servicer } from '../../../../models/domain.models';
import { AssignServicerDialogComponent } from '../assign-servicer-dialog/assign-servicer-dialog.component';
import { TokenSuccessModalComponent } from '../../../../shared/ui/token-success-modal/token-success-modal.component';
import { BackButtonComponent } from '../../../../shared/ui/back-button/back-button.component';
import { AdminNavComponent } from '../../../../shared/ui/admin-nav/admin-nav.component';

@Component({
    selector: 'app-admin-malfunction-list',
    standalone: true,
    imports: [CommonModule, UiCard, UiButton, AssignServicerDialogComponent, TokenSuccessModalComponent, BackButtonComponent, AdminNavComponent],
    template: `
    <app-admin-nav></app-admin-nav>
    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12 pt-0">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
            <app-back-button route="/dashboard" label="Back to Dashboard"></app-back-button>
        </div>

        <header class="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-[#1B3C53] mb-2">
              MALFUNCTION <span class="text-gradient">MANAGEMENT</span>
            </h1>
            <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-xs">Oversee & Assign Servicers</p>
          </div>
        </header>

        <div *ngIf="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div *ngIf="!isLoading && malfunctions.length === 0" class="text-center py-20 animate-fade-in-up">
          <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-[#456882]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[#1B3C53] mb-2">No Malfunctions Reported</h3>
          <p class="text-[#456882]">Everything is running smoothly.</p>
        </div>

        <div *ngIf="!isLoading && malfunctions.length > 0" class="grid gap-6">
          <div *ngFor="let malfunction of malfunctions; let i = index" class="animate-fade-in-up" [style.animation-delay]="i * 50 + 'ms'">
            <app-ui-card>
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Image -->
                <div class="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img *ngIf="malfunction.image_url" [src]="malfunction.image_url" class="w-full h-full object-cover" alt="Malfunction">
                  <div *ngIf="!malfunction.image_url" class="w-full h-full flex items-center justify-center text-[#456882]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 opacity-50">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2" 
                        [ngClass]="getStatusClass(malfunction.status)">
                        {{ malfunction.status }}
                      </span>
                      <h3 class="text-xl font-black text-[#1B3C53]">{{ malfunction.title }}</h3>
                      <p class="text-[#456882] text-sm font-bold uppercase tracking-wider">{{ malfunction.category }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-bold text-[#456882]">REPORTED</p>
                      <p class="text-sm font-bold text-[#1B3C53]">{{ malfunction.created_at | date:'mediumDate' }}</p>
                    </div>
                  </div>

                  <p class="text-[#456882] mb-6 line-clamp-2">{{ malfunction.description }}</p>

                  <div class="flex flex-wrap gap-4 items-center pt-4 border-t border-gray-100">
                    <app-ui-button 
                      variant="primary" 
                      customClass="!py-2 !px-6 !text-xs"
                      (btnClick)="openAssignDialog(malfunction)">
                      ASSIGN SERVICER
                    </app-ui-button>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>
        </div>
      </div>

      <!-- Assign Dialog -->
      <app-assign-servicer-dialog 
        *ngIf="selectedMalfunction"
        [malfunctionId]="selectedMalfunction.id"
        (close)="selectedMalfunction = null"
        (assigned)="onServicerAssigned($event)">
      </app-assign-servicer-dialog>

      <!-- Token Success Modal -->
      <app-token-success-modal 
        [isOpen]="!!generatedToken" 
        [token]="generatedToken" 
        [servicerName]="assignedServicerName"
        (closed)="generatedToken = null">
      </app-token-success-modal>
    </div>
  `
})
export class AdminMalfunctionListComponent implements OnInit {
    private malfunctionService = inject(MalfunctionService);
    private cdr = inject(ChangeDetectorRef);

    malfunctions: Malfunction[] = [];
    isLoading = true;
    selectedMalfunction: Malfunction | null = null;

    generatedToken: string | null = null;
    assignedServicerName: string = '';

    ngOnInit() {
        this.loadMalfunctions();
    }

    loadMalfunctions() {
        this.malfunctionService.getAllMalfunctions().subscribe({
            next: (data) => {
                this.malfunctions = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading malfunctions', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'reported': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-green-100 text-green-800';
            case 'resolved': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    openAssignDialog(malfunction: Malfunction) {
        this.selectedMalfunction = malfunction;
    }

    onServicerAssigned(event: { servicer: Servicer, token: string }) {
        this.generatedToken = event.token;
        this.assignedServicerName = event.servicer.full_name;
        this.selectedMalfunction = null;
    }
}
