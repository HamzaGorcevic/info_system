import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SuggestionService } from '../../../services/suggestion.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { SuggestionWithVote } from '@repo/domain';
import { TenantData } from '../../../models/domain.models';


@Component({
  selector: 'app-suggestion-list',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="min-h-screen bg-gradient-to-br from-[#F0F2F5] via-[#E8EAF0] to-[#DFE3F0] p-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 class="text-6xl font-black tracking-tight mb-3">
              <span class="bg-gradient-to-r from-[#1B3C53] via-[#2C5F8D] to-[#1B3C53] bg-clip-text text-transparent">
                Building Suggestions
              </span>
            </h1>
            <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-xs">
              Share ideas • Vote • Make a difference
            </p>
          </div>
          
          <button
            (click)="navigateToCreate()"
            class="group relative px-8 py-4 bg-gradient-to-r from-[#2C5F8D] to-[#1B3C53] text-white font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span class="material-icons">add_circle</span>
              New Suggestion
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-[#1B3C53] to-[#2C5F8D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <!-- Suggestions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up-delayed">
          <div
            *ngFor="let suggestion of suggestions; trackBy: trackById"
            class="group relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-md hover:shadow-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Vote Section (Left Side) -->
            <div class="flex gap-4 mb-4">
              <div class="flex flex-col items-center gap-1 bg-gradient-to-br from-[#F0F2F5] to-[#E0E4F0] px-4 py-3 rounded-2xl shadow-inner">
                <button
                  (click)="vote(suggestion, true)"
                  [class.text-green-500]="suggestion.user_vote === true"
                  [class.text-gray-400]="suggestion.user_vote !== true"
                  class="hover:text-green-500 hover:scale-110 transition-all p-1"
                >
                  <span class="material-icons text-3xl">arrow_upward</span>
                </button>
                
                <span class="font-black text-2xl bg-gradient-to-br from-[#1B3C53] to-[#2C5F8D] bg-clip-text text-transparent">
                  {{ suggestion.upvotes - suggestion.downvotes }}
                </span>
                
                <button
                  (click)="vote(suggestion, false)"
                  [class.text-red-500]="suggestion.user_vote === false"
                  [class.text-gray-400]="suggestion.user_vote !== false"
                  class="hover:text-red-500 hover:scale-110 transition-all p-1"
                >
                  <span class="material-icons text-3xl">arrow_downward</span>
                </button>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <h3 class="text-xl font-black text-[#1B3C53] mb-2 leading-tight">
                  {{ suggestion.title }}
                </h3>
                <p class="text-[#456882] text-sm leading-relaxed line-clamp-3">
                  {{ suggestion.content }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center pt-4 border-t-2 border-gray-100">
              <div class="flex items-center gap-3 text-xs font-bold text-[#456882]/60 uppercase tracking-wide">
                <span class="flex items-center gap-1">
                  <span class="material-icons text-sm">thumb_up</span>
                  {{ suggestion.upvotes }}
                </span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <span class="material-icons text-sm">thumb_down</span>
                  {{ suggestion.downvotes }}
                </span>
              </div>

              <button
                *ngIf="isCreator(suggestion)"
                (click)="deleteSuggestion(suggestion.id)"
                class="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wide transition-colors hover:scale-105"
              >
                <span class="material-icons text-base">delete</span>
                Remove
              </button>
            </div>

            <!-- Hover Glow Effect -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all pointer-events-none"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="suggestions.length === 0"
          class="text-center py-32 animate-fade-in"
        >
          <div class="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6">
            <span class="material-icons text-7xl text-[#456882]/30">lightbulb</span>
          </div>
          <h2 class="text-3xl font-black text-[#1B3C53] mb-3">No suggestions yet</h2>
          <p class="text-[#456882] text-lg mb-8">Be the first to share your ideas!</p>
          <button
            (click)="navigateToCreate()"
            class="px-8 py-4 bg-gradient-to-r from-[#2C5F8D] to-[#1B3C53] text-white font-bold uppercase rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Create First Suggestion
          </button>
        </div>

      </div>
    </div>

    <style>
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-up-delayed {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out;
      }

      .animate-fade-in-up-delayed {
        animation: fade-in-up-delayed 0.8s ease-out 0.2s both;
      }

      .animate-fade-in {
        animation: fade-in-up 0.6s ease-out;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    </style>
  `
})
export class SuggestionListComponent implements OnInit {
  suggestions: SuggestionWithVote[] = [];
  buildingId: string = '';

  private suggestionService = inject(SuggestionService);
  private authService = inject(AuthService);
  private buildingService = inject(BuildingService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit() {
    this.loadBuildingAndSuggestions();
  }

  loadBuildingAndSuggestions() {
    const user = this.authService.currentUser();
    if (user) {
      this.buildingService.getTenantData(user.id).subscribe({
        next: (data: TenantData) => {
          if (data && data.building_id) {
            this.buildingId = data.building_id;
            this.loadSuggestions();
          }
        }
      });
    }
  }

  loadSuggestions() {
    if (!this.buildingId) return;
    this.suggestionService.getSuggestionsByBuilding(this.buildingId).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.cdr.detectChanges();
    });
  }

  vote(suggestion: SuggestionWithVote, vote: boolean) {
    const user = this.authService.currentUser();
    if (!user) return;

    this.suggestionService.voteSuggestion({
      suggestion_id: suggestion.id,
      voted_by: user.id,
      vote: vote
    }).subscribe({
      next: () => this.loadSuggestions(),
      error: err => {
        console.error('Vote failed', err);
        const errorMessage = err.error?.message || err.message || 'Failed to vote.';
        alert(errorMessage);
      }
    });
  }

  isCreator(suggestion: SuggestionWithVote): boolean {
    const user = this.authService.currentUser();
    return !!user && user.id === suggestion.created_by;
  }

  deleteSuggestion(id: string) {
    if (confirm('Are you sure you want to remove this suggestion?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          this.suggestions = this.suggestions.filter(s => s.id !== id);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Delete failed', err);
          const errorMessage = err.error?.message || err.message || 'Failed to delete suggestion.';
          alert(errorMessage);
        }
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/tenant/suggestions/new']);
  }

  trackById(index: number, item: SuggestionWithVote): string {
    return item.id;
  }
}
