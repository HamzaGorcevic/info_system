import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { MessageService } from '../../../services/message.service';
import { BuildingService } from '../../../services/building.service';
import { AuthService } from '../../../services/auth.service';
import { Event, Message, Tenant } from '@repo/domain';

import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `

    <div class="min-h-screen bg-mesh p-6 md:p-12 pt-0">
      <div class="max-w-5xl mx-auto">
        <app-back-button></app-back-button>
        <header class="mb-12 animate-fade-in-up">
          <h1 class="text-4xl font-black tracking-tighter text-[#1B3C53] mb-2">
            BUILDING <span class="text-gradient">UPDATES</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-widest text-xs">Events & Messages</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Events Section -->
          <div class="animate-fade-in-up stagger-1">
            <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              <div class="bg-[#1B3C53] p-6 flex items-center gap-3">
                <span class="material-icons text-white">event</span>
                <h2 class="text-xl font-bold text-white tracking-wide">UPCOMING EVENTS</h2>
              </div>
              
              <div class="p-6 space-y-4">
                <div *ngIf="events.length === 0" class="text-center py-8 text-gray-400">
                  <p>No upcoming events scheduled.</p>
                </div>
                
                <div *ngFor="let event of events" class="group p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-bold text-[#1B3C53] group-hover:text-blue-600 transition-colors">{{ event.title }}</h3>
                    <span class="text-xs font-bold text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
                      {{ event.scheduled_at | date:'MMM d, y' }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ event.content }}</p>
                  <div class="mt-3 pt-3 border-t border-gray-200 flex items-center text-xs text-gray-400">
                    <span class="material-icons text-[14px] mr-1">schedule</span>
                    {{ event.scheduled_at | date:'shortTime' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Section -->
          <div class="animate-fade-in-up stagger-2">
            <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              <div class="bg-[#1B3C53] p-6 flex items-center gap-3">
                <span class="material-icons text-white">forum</span>
                <h2 class="text-xl font-bold text-white tracking-wide">MESSAGES</h2>
              </div>
              
              <div class="p-6 space-y-4">
                <div *ngIf="messages.length === 0" class="text-center py-8 text-gray-400">
                  <p>No messages posted.</p>
                </div>

                <div *ngFor="let message of messages" class="p-5 rounded-2xl bg-gray-50 border-l-4"
                  [ngClass]="{
                    'border-blue-500 bg-blue-50/30': message.message_type === 'info',
                    'border-red-500 bg-red-50/30': message.message_type === 'alert',
                    'border-yellow-500 bg-yellow-50/30': message.message_type === 'reminder'
                  }">
                  <div class="flex items-center mb-3 gap-2">
                    <span 
                      [ngClass]="{
                        'bg-blue-100 text-blue-700': message.message_type === 'info',
                        'bg-red-100 text-red-700': message.message_type === 'alert',
                        'bg-yellow-100 text-yellow-700': message.message_type === 'reminder'
                      }"
                      class="text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                      {{ message.message_type }}
                    </span>
                    <span class="text-xs font-medium text-gray-400 ml-auto">
                      {{ message.created_at | date:'MMM d, h:mm a' }}
                    </span>
                  </div>
                  <p class="text-gray-700 text-sm font-medium leading-relaxed">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnnouncementsListComponent implements OnInit {
  events: Event[] = [];
  messages: Message[] = [];

  private eventService = inject(EventService);
  private messageService = inject(MessageService);
  private buildingService = inject(BuildingService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.buildingService.getTenantData(user.id).subscribe({
        next: (data: Tenant | null) => {
          if (data && data.building_id) {
            this.loadEvents(data.building_id);
            this.loadMessages(data.building_id);
          }
        }
      });
    }
  }

  loadEvents(buildingId: string) {
    this.eventService.getEventsByBuilding(buildingId).subscribe(events => {
      this.events = events;
      this.cdr.detectChanges();
    });
  }

  loadMessages(buildingId: string) {
    this.messageService.getMessagesByBuilding(buildingId).subscribe(messages => {
      this.messages = messages;
      this.cdr.detectChanges();
    });
  }
}
