import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SuggestionService } from '../../../services/suggestion.service';
import { SuggestionWithVote } from '@repo/domain';

import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';
import { UiButton } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-manager-suggestions',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, UiButton],
  template: `

    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12 pt-0">
      <div class="max-w-4xl mx-auto">
        <app-back-button></app-back-button>
        
        <header class="mb-12 animate-fade-in-up">
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
            MANAGE <span class="text-gradient">SUGGESTIONS</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Review and moderate tenant suggestions</p>
        </header>

        <!-- Suggestions List -->
        <div class="space-y-6 animate-fade-in-up stagger-1">
          <div *ngFor="let suggestion of suggestions" class="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-100 transition-all group relative">
            
            <div class="flex gap-6">
              <!-- Vote Stats (Read Only) -->
              <div class="flex flex-col items-center gap-2 bg-[#F0F2F5] p-3 rounded-2xl h-fit w-16">
                <span class="material-icons text-gray-400 text-2xl">keyboard_arrow_up</span>
                <span class="font-black text-[#1B3C53] text-lg">
                  {{ suggestion.upvotes - suggestion.downvotes }}
                </span>
                <span class="material-icons text-gray-400 text-2xl">keyboard_arrow_down</span>
              </div>

              <!-- Content -->
              <div class="flex-1 pt-2">
                <h3 class="text-xl font-black text-[#1B3C53] mb-2">{{ suggestion.title }}</h3>
                <p class="text-[#456882] leading-relaxed">{{ suggestion.content }}</p>
                
                <div class="mt-6 flex items-center gap-4 text-xs font-bold text-[#456882]/60 uppercase tracking-wider">
                  <span>{{ suggestion.created_at | date:'mediumDate' }}</span>
                  <span>•</span>
                  <span>{{ suggestion.upvotes }} Upvotes</span>
                  <span>•</span>
                  <span>{{ suggestion.downvotes }} Downvotes</span>
                </div>
              </div>

              <!-- Delete Action -->
              <div class="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <app-ui-button
                  variant="outline"
                  customClass="!border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white !py-2 !px-4 !text-xs"
                  [loading]="deletingId === suggestion.id"
                  [disabled]="!!deletingId"
                  (btnClick)="deleteSuggestion(suggestion.id)"
                >
                  <span class="material-icons text-base">delete_outline</span>
                  REMOVE
                </app-ui-button>
              </div>
            </div>
          </div>

          <div *ngIf="suggestions.length === 0" class="text-center py-20">
            <span class="material-icons text-6xl text-[#456882]/20 mb-4">inbox</span>
            <p class="text-[#456882] font-bold text-lg">No suggestions found</p>
          </div>
        </div>

      </div>
    </div>
    `
})
export class ManagerSuggestionsComponent implements OnInit {
  suggestions: SuggestionWithVote[] = [];
  buildingId: string = '';
  deletingId: string | null = null;

  private suggestionService = inject(SuggestionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.getManagerBuilding().subscribe(building => {
      if (building) {
        this.buildingId = building.id;
        this.loadSuggestions();
      }
    });
  }

  loadSuggestions() {
    this.suggestionService.getSuggestionsByBuilding(this.buildingId).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.cdr.detectChanges();
    });
  }

  deleteSuggestion(id: string) {
    if (confirm('Are you sure you want to remove this suggestion?')) {
      this.deletingId = id;
      this.cdr.detectChanges();
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          this.suggestions = this.suggestions.filter(s => s.id !== id);
          this.deletingId = null;
          this.cdr.detectChanges();
        },
        error: err => {
          this.deletingId = null;
          this.cdr.detectChanges();
          console.error('Delete failed', err);
          alert('Failed to remove suggestion. Please try again.');
        }
      });
    }
  }
}
