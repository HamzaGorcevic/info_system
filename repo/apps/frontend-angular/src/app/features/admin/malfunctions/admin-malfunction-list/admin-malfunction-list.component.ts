import { Component, inject, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@repo/react-ui';
import { CommonModule } from '@angular/common';
import { MalfunctionService } from '../../../../services/malfunction.service';
import { Malfunction, Servicer } from '@repo/domain';
import { AssignServicerDialogComponent } from '../assign-servicer-dialog/assign-servicer-dialog.component';
import { TokenSuccessModalComponent } from '../../../../shared/ui/token-success-modal/token-success-modal.component';
import { BackButtonComponent } from '../../../../shared/ui/back-button/back-button.component';


@Component({
  selector: 'app-admin-malfunction-list',
  standalone: true,
  imports: [CommonModule, AssignServicerDialogComponent, TokenSuccessModalComponent, BackButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `

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

        <div *ngIf="!isLoading && malfunctions.length > 0" class="mt-8 animate-fade-in-up">
          <my-awesome-kanban
            [attr.malfunctions-json]="malfunctionsJson"
            (mySecretReactEvent)="onKanbanStatusChange($event)"
            (assignClick)="onKanbanAssignClick($event)">
          </my-awesome-kanban>
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

  get malfunctionsJson() {
    return JSON.stringify(this.malfunctions);
  }

  onKanbanStatusChange(event: Event) {
    const detail = (event as CustomEvent).detail;
    const { id, status } = detail;
    const malfunction = this.malfunctions.find(m => m.id === id);
    if (malfunction) {
      malfunction.status = status;
      this.cdr.detectChanges();
    }
  }

  onKanbanAssignClick(event: Event) {
    const malfunction = (event as CustomEvent).detail;
    this.openAssignDialog(malfunction);
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
    if (this.selectedMalfunction) {
      this.selectedMalfunction.status = 'assigned';
      this.selectedMalfunction.servicer_id = event.servicer.id;
    }
    this.generatedToken = event.token;
    this.assignedServicerName = event.servicer.full_name;
    this.selectedMalfunction = null;
    this.cdr.detectChanges();
  }
}
