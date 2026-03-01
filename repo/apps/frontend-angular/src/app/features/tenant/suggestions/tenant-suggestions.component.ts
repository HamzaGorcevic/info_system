// Tenant Suggestions Component
import { Component, inject, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuggestionService } from '../../../services/suggestion.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { CreateSuggestionDto, SuggestionWithVote, Tenant } from '@repo/domain';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';


@Component({
  selector: 'app-tenant-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCard, UiButton],
  template: `

    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12 pt-0">
      <div class="max-w-4xl mx-auto">
        <header class="mb-12 animate-fade-in-up">
          <div class="flex justify-between items-end">
            <div>
              <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
                BUILDING <span class="text-gradient">SUGGESTIONS</span>
              </h1>
              <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                Voice your opinion and vote
              </p>
            </div>
            <app-ui-button variant="primary" (btnClick)="showForm = !showForm">
              {{ showForm ? 'CANCEL' : 'NEW SUGGESTION' }}
            </app-ui-button>
          </div>
        </header>

        <!-- Create Form -->
        <div *ngIf="showForm" class="mb-12 animate-fade-in-up stagger-1">
          <app-ui-card title="MAKE A SUGGESTION">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">
                  Title
                </label>
                <input
                  [(ngModel)]="newSuggestion.title"
                  type="text"
                  placeholder="What's your suggestion?"
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-bold outline-none transition-all placeholder:text-gray-400"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">
                  Details
                </label>
                <textarea
                  [(ngModel)]="newSuggestion.content"
                  rows="4"
                  placeholder="Describe your idea..."
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-medium outline-none transition-all placeholder:text-gray-400 resize-none"
                ></textarea>
              </div>
              <div class="pt-4">
                <app-ui-button variant="primary" customClass="w-full !py-5" (btnClick)="createSuggestion()" [loading]="submitting">
                  SUBMIT SUGGESTION
                </app-ui-button>
              </div>
            </div>
          </app-ui-card>
        </div>

        <!-- Suggestions List -->
        <div class="space-y-6 animate-fade-in-up stagger-2">
          <div *ngFor="let suggestion of suggestions" class="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-100 transition-all group">
            <div class="flex gap-6">
              <!-- Vote Controls -->
              <div class="flex flex-col items-center gap-2 bg-[#F0F2F5] p-3 rounded-2xl h-fit">
                <button
                  (click)="vote(suggestion, true)"
                  [class.text-green-500]="suggestion.user_vote === true"
                  [class.text-gray-400]="suggestion.user_vote !== true"
                  class="hover:text-green-500 transition-colors p-1"
                >
                  <span class="material-icons text-3xl">keyboard_arrow_up</span>
                </button>
                <span class="font-black text-[#1B3C53] text-lg">
                  {{ suggestion.upvotes - suggestion.downvotes }}
                </span>
                <button
                  (click)="vote(suggestion, false)"
                  [class.text-red-500]="suggestion.user_vote === false"
                  [class.text-gray-400]="suggestion.user_vote !== false"
                  class="hover:text-red-500 transition-colors p-1"
                >
                  <span class="material-icons text-3xl">keyboard_arrow_down</span>
                </button>
              </div>

              <!-- Content -->
              <div class="flex-1 pt-2">
                <h3 class="text-xl font-black text-[#1B3C53] mb-2">{{ suggestion.title }}</h3>
                <p class="text-[#456882] leading-relaxed">{{ suggestion.content }}</p>
                <div class="mt-6 flex items-center justify-between">
                  <div class="flex items-center gap-4 text-xs font-bold text-[#456882]/60 uppercase tracking-wider">
                    <span>{{ suggestion.created_at | date:'mediumDate' }}</span>
                    <span>•</span>
                    <span>{{ suggestion.upvotes }} Upvotes</span>
                    <span>•</span>
                    <span>{{ suggestion.downvotes }} Downvotes</span>
                  </div>
                  <button
                    *ngIf="isCreator(suggestion)"
                    (click)="deleteSuggestion(suggestion.id)"
                    class="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span class="material-icons text-sm">delete_outline</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="suggestions.length === 0" class="text-center py-20">
            <span class="material-icons text-6xl text-[#456882]/20 mb-4">lightbulb_outline</span>
            <p class="text-[#456882] font-bold text-lg">No suggestions yet</p>
            <p class="text-[#456882]/60 text-sm mt-1">Be the first to suggest something!</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TenantSuggestionsComponent {
  suggestions: SuggestionWithVote[] = [];
  showForm = false;
  submitting = false;
  newSuggestion: Partial<CreateSuggestionDto> = {};
  buildingId: string = '';

  private suggestionService = inject(SuggestionService);
  private authService = inject(AuthService);
  private buildingService = inject(BuildingService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.loadBuildingAndSuggestions();
    });
  }

  loadBuildingAndSuggestions() {
    const user = this.authService.currentUser();
    if (user) {
      this.buildingService.getTenantData(user.id).subscribe({
        next: (data: Tenant | null) => {
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

  createSuggestion() {
    const user = this.authService.currentUser();
    if (!user || !this.buildingId || !this.newSuggestion.title || !this.newSuggestion.content) return;

    const input: CreateSuggestionDto = {
      building_id: this.buildingId,
      title: this.newSuggestion.title!,
      content: this.newSuggestion.content!,
      created_by: user.id
    };

    this.submitting = true;
    this.suggestionService.createSuggestion(input).subscribe({
      next: () => {
        this.newSuggestion = {};
        this.showForm = false;
        this.submitting = false;
        this.loadSuggestions();
      },
      error: err => {
        this.submitting = false;
        console.error('Failed to create suggestion', err);
        alert('Failed to create suggestion. Please try again.');
      }
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
          this.loadSuggestions();
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
}
