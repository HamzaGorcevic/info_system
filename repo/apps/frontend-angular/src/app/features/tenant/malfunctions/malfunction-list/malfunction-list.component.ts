import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalfunctionService } from '../../../../services/malfunction.service';
import { BuildingService } from '../../../../services/building.service';
import { AuthService } from '../../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { UiCard } from '../../../../shared/ui/card/card';
import { UiButton } from '../../../../shared/ui/button/button';
import { Malfunction, Tenant, Rating } from '@repo/domain';
import { switchMap, of } from 'rxjs';

import { BackButtonComponent } from '../../../../shared/ui/back-button/back-button.component';

@Component({
    selector: 'app-malfunction-list',
    standalone: true,
    imports: [CommonModule, RouterLink, UiCard, UiButton, BackButtonComponent],
    templateUrl: './malfunction-list.component.html'
})
export class MalfunctionListComponent implements OnInit {
    private malfunctionService = inject(MalfunctionService);
    private buildingService = inject(BuildingService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    malfunctions: Malfunction[] = [];
    isLoading = true;
    hoveredStars: Record<string, number> = {};

    ngOnInit() {
        this.loadMalfunctions();
    }

    loadMalfunctions() {
        const user = this.authService.currentUser();
        if (!user) {
            this.isLoading = false;
            return;
        }

        this.buildingService.getTenantData(user.id).pipe(
            switchMap((tenantData: Tenant | null) => {
                if (!tenantData) {
                    console.error('Tenant data not found');
                    return of([]);
                }
                return this.malfunctionService.getTenantMalfunctions(tenantData.id);
            })
        ).subscribe({
            next: (data) => {
                this.malfunctions = data.map(m => ({
                    ...m,
                    ratings: m.ratings || []
                }));
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

    rateMalfunction(malfunction: Malfunction, score: number, comment: string) {
        if (!malfunction.servicer_id) return;

        const user = this.authService.currentUser();
        if (!user) return;

        this.malfunctionService.rateMalfunction({
            malfunction_id: malfunction.id,
            servicer_id: malfunction.servicer_id,
            rating_score: score,
            comment
        }).subscribe({
            next: () => {
                alert('Rating submitted successfully!');
                if (!malfunction.ratings) malfunction.ratings = [];
                malfunction.ratings.push({
                    id: 'temp',
                    rated_by: user.id,
                    rating_score: score,
                    comment,
                    created_at: new Date().toISOString(),
                    servicer_id: malfunction.servicer_id ? malfunction.servicer_id : ""
                });
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.log({
                    malfunction_id: malfunction.id,
                    servicer_id: malfunction.servicer_id,
                    rated_by: user.id,
                    rating_score: score,
                    comment
                })
                console.error('Failed to submit rating', err);
                alert('Failed to submit rating');
            }
        });
    }

    hasUserRated(malfunction: Malfunction): boolean {
        const user = this.authService.currentUser();
        if (!user || !malfunction.ratings) return false;
        return malfunction.ratings.some((r: Rating) => r.rated_by === user.id);
    }

    setHoveredStar(malfunctionId: string, star: number) {
        this.hoveredStars[malfunctionId] = star;
    }

    getHoveredStar(malfunctionId: string): number {
        return this.hoveredStars[malfunctionId] || 0;
    }
}
