import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';
import { RouterModule, Router } from '@angular/router';
import { AdminNavComponent } from '../../../shared/ui/admin-nav/admin-nav.component';
import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';

@Component({
    selector: 'app-suggestions-building-list',
    standalone: true,
    imports: [CommonModule, UiCard, UiButton, RouterModule, AdminNavComponent, BackButtonComponent],
    template: `
    <app-admin-nav></app-admin-nav>
    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12 pt-0">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
            <app-back-button route="/dashboard" label="Back to Dashboard"></app-back-button>
        </div>
        <header class="mb-16 animate-fade-in-up">
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
            SUGGESTIONS <span class="text-gradient">CENTER</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Manage tenant suggestions for your buildings</p>
        </header>

        <div *ngIf="buildings.length === 0" class="animate-fade-in-up stagger-1">
          <div class="bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#456882]/20 p-20 rounded-[3rem] text-center">
            <p class="text-[#456882] font-black uppercase tracking-[0.2em] text-sm">No building assets identified</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-10">
          <div *ngFor="let building of buildings; let i = index" 
               class="animate-fade-in-up" 
               [style.animation-delay]="(i * 0.1) + 's'">
            <app-ui-card [title]="building.building_name" class="!p-10">
              <div class="flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="space-y-4">
                  <div class="p-4 bg-[#F0F2F5] rounded-2xl border border-gray-100">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-2">Location</p>
                    <p class="text-lg font-bold text-[#1B3C53]">{{ building.location }}</p>
                  </div>
                </div>
                
                <app-ui-button variant="primary" class="w-full md:w-auto !py-4 px-8" (btnClick)="manageSuggestions(building.id)">
                  MANAGE SUGGESTIONS
                </app-ui-button>
              </div>
            </app-ui-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuggestionsBuildingListComponent implements OnInit {
    buildings: any[] = [];

    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    ngOnInit() {
        const sessionStr = localStorage.getItem('sb-session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.user) {
                this.authService.getAdminBuildings(session.user.id).subscribe((res: any[]) => {
                    this.buildings = res;
                    this.cdr.detectChanges();
                });
            }
        }
    }

    manageSuggestions(buildingId: string) {
        this.router.navigate(['/admin/suggestions', buildingId]);
    }
}
