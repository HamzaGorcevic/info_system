import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicerService } from '../../../../services/servicer.service';
import { MalfunctionService } from '../../../../services/malfunction.service';
import { UiCard } from '../../../../shared/ui/card/card';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiModal } from '../../../../shared/ui/modal/modal';
import { TokenSuccessModalComponent } from '../../../../shared/ui/token-success-modal/token-success-modal.component';
import { BackButtonComponent } from '../../../../shared/ui/back-button/back-button.component';

import { Servicer, Malfunction } from '../../../../models/domain.models';

@Component({
    selector: 'app-servicer-management',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiCard, UiButton, UiModal, TokenSuccessModalComponent, BackButtonComponent],
    templateUrl: './servicer-management.component.html'
})
export class ServicerManagementComponent implements OnInit {
    private fb = inject(FormBuilder);
    private servicerService = inject(ServicerService);
    private malfunctionService = inject(MalfunctionService);
    private cdr = inject(ChangeDetectorRef);

    servicers: Servicer[] = [];
    malfunctions: Malfunction[] = [];
    isLoading = true;
    showAddForm = false;

    // Modal state
    showAssignModal = false;
    selectedServicer: Servicer | null = null;
    generatedToken: string | null = null;

    addForm = this.fb.group({
        full_name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.email]],
        company_name: [''],
        profession: ['', Validators.required]
    });

    ngOnInit() {
        this.loadServicers();
        this.loadMalfunctions();
    }

    loadServicers() {
        this.servicerService.getAllServicers().subscribe({
            next: (data) => {
                this.servicers = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading servicers', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMalfunctions() {
        this.malfunctionService.getAllMalfunctions().subscribe({
            next: (data) => {
                // Filter for unresolved malfunctions
                this.malfunctions = data.filter(m => m.status !== 'resolved');
            },
            error: (err) => console.error('Error loading malfunctions', err)
        });
    }

    toggleAddForm() {
        this.showAddForm = !this.showAddForm;
    }

    onSubmit() {
        if (this.addForm.invalid) return;

        const formValue = this.addForm.value;
        const servicerData: Partial<Servicer> = {
            full_name: formValue.full_name || undefined,
            phone: formValue.phone || undefined,
            email: formValue.email || undefined,
            company_name: formValue.company_name || undefined,
            profession: formValue.profession || undefined
        };

        this.servicerService.createServicer(servicerData).subscribe({
            next: (newServicer) => {
                this.servicers.push(newServicer);
                this.showAddForm = false;
                this.addForm.reset();
            },
            error: (err) => {
                console.error('Error creating servicer', err);
            }
        });
    }

    openAssignModal(servicer: Servicer) {
        this.selectedServicer = servicer;
        this.showAssignModal = true;
        this.generatedToken = null;
    }

    closeAssignModal() {
        this.showAssignModal = false;
        this.selectedServicer = null;
    }

    assignToken(malfunction: Malfunction) {
        if (!this.selectedServicer) return;

        this.servicerService.assignToken({
            servicerId: this.selectedServicer.id,
            malfunctionId: malfunction.id
        }).subscribe({
            next: (res) => {
                this.generatedToken = res.token;
                // Close assign modal and show success modal
                this.showAssignModal = false;
                // Update local state
                malfunction.status = 'assigned';
                malfunction.servicer_id = this.selectedServicer!.id;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error assigning token', err);
                alert('Failed to generate token');
            }
        });
    }

    closeSuccessModal() {
        this.generatedToken = null;
        this.selectedServicer = null;
    }

    getAverageRating(servicer: Servicer): number {
        if (!servicer.ratings || servicer.ratings.length === 0) return 0;
        const sum = servicer.ratings.reduce((acc, curr) => acc + curr.rating_score, 0);
        return sum / servicer.ratings.length;
    }

    getRatingCount(servicer: Servicer): number {
        return servicer.ratings?.length || 0;
    }
}
