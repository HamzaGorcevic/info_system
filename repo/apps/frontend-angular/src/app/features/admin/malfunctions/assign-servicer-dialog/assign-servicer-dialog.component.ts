import { Component, EventEmitter, Input, Output, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicerService } from '../../../../services/servicer.service';
import { UiButton } from '../../../../shared/ui/button/button';
import { Servicer } from '@repo/domain';

@Component({
  selector: 'app-assign-servicer-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButton],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-[#1B3C53]">ASSIGN SERVICER</h2>
          <button (click)="close.emit()" class="text-[#456882] hover:text-[#1B3C53]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-8">
          <div class="flex gap-4 mb-6">
            <button 
              (click)="mode = 'select'"
              [class.bg-[#1B3C53]]="mode === 'select'"
              [class.text-white]="mode === 'select'"
              [class.bg-gray-100]="mode !== 'select'"
              [class.text-[#456882]]="mode !== 'select'"
              class="flex-1 py-3 rounded-xl font-bold transition-colors">
              SELECT EXISTING
            </button>
            <button 
              (click)="mode = 'create'"
              [class.bg-[#1B3C53]]="mode === 'create'"
              [class.text-white]="mode === 'create'"
              [class.bg-gray-100]="mode !== 'create'"
              [class.text-[#456882]]="mode !== 'create'"
              class="flex-1 py-3 rounded-xl font-bold transition-colors">
              CREATE NEW
            </button>
          </div>

          <!-- Select Existing Mode -->
          <div *ngIf="mode === 'select'" class="space-y-4">
            <div *ngIf="isLoading" class="flex justify-center py-8">
              <div class="w-8 h-8 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div *ngIf="!isLoading && servicers.length === 0" class="text-center py-8 text-[#456882]">
              No servicers found. Please create a new one.
            </div>

            <div *ngIf="!isLoading && servicers.length > 0" class="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              <div *ngFor="let servicer of servicers" 
                (click)="selectedServicer = servicer"
                [class.border-[#1B3C53]]="selectedServicer?.id === servicer.id"
                [class.bg-blue-50]="selectedServicer?.id === servicer.id"
                class="p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div>
                  <p class="font-bold text-[#1B3C53]">{{ servicer.full_name }}</p>
                  <p class="text-sm text-[#456882]">{{ servicer.profession }}</p>
                </div>
                <div *ngIf="selectedServicer?.id === servicer.id" class="text-[#1B3C53]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Create New Mode -->
          <form *ngIf="mode === 'create'" [formGroup]="createForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#1B3C53] uppercase">Full Name</label>
                <input type="text" formControlName="full_name" class="w-full p-3 bg-[#F0F2F5] rounded-lg border-2 border-transparent focus:border-[#1B3C53] outline-none">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#1B3C53] uppercase">Profession</label>
                <input type="text" formControlName="profession" class="w-full p-3 bg-[#F0F2F5] rounded-lg border-2 border-transparent focus:border-[#1B3C53] outline-none">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#1B3C53] uppercase">Phone</label>
                <input type="text" formControlName="phone" class="w-full p-3 bg-[#F0F2F5] rounded-lg border-2 border-transparent focus:border-[#1B3C53] outline-none">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#1B3C53] uppercase">Email</label>
                <input type="email" formControlName="email" class="w-full p-3 bg-[#F0F2F5] rounded-lg border-2 border-transparent focus:border-[#1B3C53] outline-none">
              </div>
              <div class="col-span-2 space-y-1">
                <label class="text-xs font-bold text-[#1B3C53] uppercase">Company Name</label>
                <input type="text" formControlName="company_name" class="w-full p-3 bg-[#F0F2F5] rounded-lg border-2 border-transparent focus:border-[#1B3C53] outline-none">
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <app-ui-button variant="outline" (btnClick)="close.emit()">CANCEL</app-ui-button>
          <app-ui-button 
            variant="primary" 
            [disabled]="(mode === 'select' && !selectedServicer) || (mode === 'create' && createForm.invalid) || isSubmitting"
            (btnClick)="confirmAssignment()">
            {{ isSubmitting ? 'ASSIGNING...' : 'ASSIGN SERVICER' }}
          </app-ui-button>
        </div>
      </div>
    </div>
  `
})
export class AssignServicerDialogComponent implements OnInit {
  @Input() malfunctionId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() assigned = new EventEmitter<{ servicer: Servicer, token: string }>();

  private servicerService = inject(ServicerService);
  private fb = inject(FormBuilder);
  private cdf = inject(ChangeDetectorRef);
  mode: 'select' | 'create' = 'select';
  servicers: Servicer[] = [];
  selectedServicer: Servicer | null = null;
  isLoading = true;
  isSubmitting = false;

  createForm = this.fb.group({
    full_name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.email]],
    company_name: [''],
    profession: ['', Validators.required]
  });

  ngOnInit() {
    this.loadServicers();
  }

  loadServicers() {
    this.servicerService.getAllServicers().subscribe({
      next: (data) => {
        this.servicers = data;
        this.isLoading = false;
        this.cdf.detectChanges();
      },
      error: (err) => {
        console.error('Error loading servicers', err);
        this.isLoading = false;
      }
    });
  }

  confirmAssignment() {
    this.isSubmitting = true;

    if (this.mode === 'select' && this.selectedServicer) {
      this.assignToken(this.selectedServicer);
    } else if (this.mode === 'create' && this.createForm.valid) {
      const servicerData = this.createForm.value as Partial<Servicer>;
      this.servicerService.createServicer(servicerData).subscribe({
        next: (newServicer) => {
          this.assignToken(newServicer);
        },
        error: (err) => {
          console.error('Error creating servicer', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  private assignToken(servicer: Servicer) {
    this.servicerService.assignToken({
      servicerId: servicer.id,
      malfunctionId: this.malfunctionId
    }).subscribe({
      next: (response) => {
        this.assigned.emit({ servicer, token: response.token });
        this.close.emit();
      },
      error: (err) => {
        console.error('Error assigning token', err);
        this.isSubmitting = false;
      }
    });
  }
}
