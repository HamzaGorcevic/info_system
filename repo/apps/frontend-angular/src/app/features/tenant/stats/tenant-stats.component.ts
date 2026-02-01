import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MalfunctionService } from '../../../services/malfunction.service';
import { SuggestionService } from '../../../services/suggestion.service';
import { BuildingService } from '../../../services/building.service';
import { forkJoin } from 'rxjs';
import { Tenant } from '@repo/domain';

@Component({
  selector: 'app-tenant-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-black text-[#1B3C53] mb-8">My Activity</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Reports Submitted</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : reportsCount }}
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Suggestions Made</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : suggestionsCount }}
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Votes Cast</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : votesCount }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class TenantStatsComponent implements OnInit {
  reportsCount = 0;
  suggestionsCount = 0;
  votesCount = 0;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private malfunctionService: MalfunctionService,
    private suggestionService: SuggestionService,
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.isLoading = false;
      return;
    }

    this.buildingService.getTenantData(user.id).subscribe({
      next: (tenantData: Tenant | null) => {
        if (!tenantData) {
          this.isLoading = false;
          return;
        }

        forkJoin({
          malfunctions: this.malfunctionService.getTenantMalfunctions(tenantData.id),
          suggestions: this.suggestionService.getSuggestionsByBuilding(tenantData.building_id)
        }).subscribe({
          next: ({ malfunctions, suggestions }) => {
            this.reportsCount = malfunctions.length;

            // Filter suggestions created by this user
            // Assuming suggestion has created_by or user_id field matching user.id
            this.suggestionsCount = suggestions.filter((s: any) => s.created_by === user.id).length;

            // Count votes cast by this user
            // Assuming SuggestionWithVote has a property indicating if user voted, or we check votes array
            // Since I don't know the exact shape, I'll try to check 'user_vote' property which is common in such patterns
            this.votesCount = suggestions.filter((s: any) => !!s.user_vote).length;

            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading stats:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading tenant data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
