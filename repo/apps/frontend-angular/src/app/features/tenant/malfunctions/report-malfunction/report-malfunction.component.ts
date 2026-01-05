import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MalfunctionService } from '../../../../services/malfunction.service';
import { BuildingService } from '../../../../services/building.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UiCard } from '../../../../shared/ui/card/card';
import { UiButton } from '../../../../shared/ui/button/button';
import { TenantData } from '../../../../models/domain.models';

import { BackButtonComponent } from '../../../../shared/ui/back-button/back-button.component';

@Component({
    selector: 'app-report-malfunction',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiCard, UiButton, BackButtonComponent],
    templateUrl: './report-malfunction.component.html'
})
export class ReportMalfunctionComponent {
    private fb = inject(FormBuilder);
    private malfunctionService = inject(MalfunctionService);
    private buildingService = inject(BuildingService);
    private authService = inject(AuthService);
    private router = inject(Router);

    reportForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        category: [''],
        image: [null as File | null]
    });

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    isSubmitting = false;

    private cdr = inject(ChangeDetectorRef);

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.selectedFile = file;
            this.reportForm.patchValue({ image: file });
            this.reportForm.get('image')?.updateValueAndValidity();

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
                this.cdr.detectChanges(); // Trigger change detection
            };
            reader.readAsDataURL(file);
        }
    }

    async onSubmit() {
        if (this.reportForm.invalid) return;

        this.isSubmitting = true;
        const user = this.authService.currentUser();

        if (!user) {
            console.error('User not logged in');
            this.isSubmitting = false;
            return;
        }

        try {
            // Fetch tenant data to get tenant_id
            const tenantData = await new Promise<TenantData>((resolve, reject) => {
                this.buildingService.getTenantData(user.id).subscribe({
                    next: (data) => resolve(data),
                    error: (err) => reject(err)
                });
            });

            if (!tenantData) {
                console.error('Tenant data not found');
                this.isSubmitting = false;
                return;
            }

            const formData = new FormData();
            formData.append('title', this.reportForm.get('title')?.value || '');
            formData.append('description', this.reportForm.get('description')?.value || '');
            formData.append('category', this.reportForm.get('category')?.value || '');
            formData.append('reporter_id', user.id);
            formData.append('tenant_id', tenantData.id);

            if (this.selectedFile) {
                formData.append('image', this.selectedFile);
            }

            this.malfunctionService.reportMalfunction(formData).subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.router.navigate(['/tenant/dashboard']);
                },
                error: (err) => {
                    console.error('Error reporting malfunction', err);
                    this.isSubmitting = false;
                }
            });
        } catch (error) {
            console.error('Error getting tenant data', error);
            this.isSubmitting = false;
        }
    }
}
