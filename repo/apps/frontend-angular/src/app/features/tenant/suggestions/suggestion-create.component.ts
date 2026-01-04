import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SuggestionService } from '../../../services/suggestion.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { CreateSuggestionInput } from '@repo/domain';
import { TenantData } from '../../../models/domain.models';
import { TenantNavComponent } from '../../../shared/ui/tenant-nav/tenant-nav.component';

@Component({
    selector: 'app-suggestion-create',
    standalone: true,
    imports: [CommonModule, FormsModule, TenantNavComponent],
    template: `
    <app-tenant-nav></app-tenant-nav>
    <div class="min-h-screen bg-gradient-to-br from-[#F0F2F5] via-[#E8EAF0] to-[#DFE3F0] p-8">
      <div class="max-w-4xl mx-auto">
        
        <!-- Back Button -->
        <button
          (click)="navigateBack()"
          class="group flex items-center gap-2 text-[#456882] hover:text-[#1B3C53] font-bold uppercase tracking-wide text-sm mb-8 transition-colors animate-fade-in"
        >
          <span class="material-icons group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Suggestions
        </button>

        <!-- Header -->
        <div class="text-center mb-12 animate-fade-in-up">
          <div class="inline-block p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
            <span class="material-icons text-6xl text-[#2C5F8D]">lightbulb</span>
          </div>
          <h1 class="text-6xl font-black tracking-tight mb-4">
            <span class="bg-gradient-to-r from-[#1B3C53] via-[#2C5F8D] to-[#1B3C53] bg-clip-text text-transparent">
              Share Your Idea
            </span>
          </h1>
          <p class="text-[#456882] font-semibold text-lg">
            Help improve our building community
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-2 border-white/50 animate-fade-in-up-delayed">
          <form (ngSubmit)="createSuggestion()" class="space-y-8">
            
            <!-- Title Input -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-sm font-black text-[#1B3C53] uppercase tracking-widest">
                <span class="material-icons text-[#2C5F8D]">title</span>
                Suggestion Title
              </label>
              <input
                [(ngModel)]="newSuggestion.title"
                name="title"
                type="text"
                placeholder="What's your brilliant idea?"
                required
                class="w-full bg-gradient-to-br from-[#F5F7FA] to-[#E8EBF0] border-3 border-transparent focus:border-[#2C5F8D] focus:bg-white rounded-2xl px-6 py-5 text-[#1B3C53] text-lg font-semibold outline-none transition-all placeholder:text-gray-400 shadow-inner focus:shadow-lg"
              />
            </div>

            <!-- Description Input -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-sm font-black text-[#1B3C53] uppercase tracking-widest">
                <span class="material-icons text-[#2C5F8D]">description</span>
                Details
              </label>
              <textarea
                [(ngModel)]="newSuggestion.content"
                name="content"
                rows="8"
                placeholder="Describe your suggestion in detail... Why is it important? How will it benefit the community?"
                required
                class="w-full bg-gradient-to-br from-[#F5F7FA] to-[#E8EBF0] border-3 border-transparent focus:border-[#2C5F8D] focus:bg-white rounded-2xl px-6 py-5 text-[#1B3C53] text-lg font-medium outline-none transition-all placeholder:text-gray-400 shadow-inner focus:shadow-lg resize-none"
              ></textarea>
            </div>

            <!-- Character Count -->
            <div class="text-right text-sm text-[#456882]/60 font-semibold">
              {{ newSuggestion.content?.length || 0 }} characters
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-6">
              <button
                type="button"
                (click)="navigateBack()"
                class="flex-1 px-8 py-5 bg-gray-100 hover:bg-gray-200 text-[#456882] font-black uppercase tracking-wider rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!newSuggestion.title || !newSuggestion.content"
                class="flex-1 relative px-8 py-5 bg-gradient-to-r from-[#2C5F8D] to-[#1B3C53] text-white font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all overflow-hidden group"
              >
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <span class="material-icons">send</span>
                  Submit Suggestion
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-[#1B3C53] to-[#2C5F8D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <!-- Helper Text -->
            <div class="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100/50">
              <div class="flex gap-4">
                <span class="material-icons text-[#2C5F8D] text-3xl">info</span>
                <div>
                  <h4 class="font-black text-[#1B3C53] mb-2">Tips for a great suggestion:</h4>
                  <ul class="text-sm text-[#456882] space-y-1 font-medium">
                    <li>• Be specific and clear about what you're proposing</li>
                    <li>• Explain how it will benefit the community</li>
                    <li>• Keep it constructive and positive</li>
                    <li>• Check if similar suggestions already exist</li>
                  </ul>
                </div>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>

    <style>
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

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
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.4s ease-out;
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out;
      }

      .animate-fade-in-up-delayed {
        animation: fade-in-up-delayed 0.8s ease-out 0.3s both;
      }
    </style>
  `
})
export class SuggestionCreateComponent implements OnInit {
    newSuggestion: Partial<CreateSuggestionInput> = {};
    buildingId: string = '';

    private suggestionService = inject(SuggestionService);
    private authService = inject(AuthService);
    private buildingService = inject(BuildingService);
    private router = inject(Router);

    ngOnInit() {
        this.loadBuildingId();
    }

    loadBuildingId() {
        const user = this.authService.currentUser();
        if (user) {
            this.buildingService.getTenantData(user.id).subscribe({
                next: (data: TenantData) => {
                    if (data && data.building_id) {
                        this.buildingId = data.building_id;
                    }
                }
            });
        }
    }

    createSuggestion() {
        const user = this.authService.currentUser();
        if (!user || !this.buildingId || !this.newSuggestion.title || !this.newSuggestion.content) {
            return;
        }

        const input: CreateSuggestionInput = {
            building_id: this.buildingId,
            title: this.newSuggestion.title!,
            content: this.newSuggestion.content!,
            created_by: user.id
        };

        this.suggestionService.createSuggestion(input).subscribe({
            next: () => {
                this.navigateBack();
            },
            error: err => {
                console.error('Failed to create suggestion', err);
                alert('Failed to create suggestion. Please try again.');
            }
        });
    }

    navigateBack() {
        this.router.navigate(['/tenant/suggestions']);
    }
}
