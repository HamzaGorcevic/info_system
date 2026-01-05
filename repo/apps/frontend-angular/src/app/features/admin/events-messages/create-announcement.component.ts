import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CreateEventInput, CreateMessageInput } from '@repo/domain';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';

import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCard, UiButton, BackButtonComponent],
  template: `

    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12 pt-0">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
            <app-back-button route="/admin/announcements" label="Back to Buildings"></app-back-button>
        </div>
        
        <header class="mb-12 animate-fade-in-up">
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
            CREATE <span class="text-gradient">UPDATE</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Post new events or messages for residents</p>
        </header>

        <div class="animate-fade-in-up stagger-1">
          <app-ui-card title="NEW ANNOUNCEMENT" class="!overflow-visible">
            
            <!-- Custom Tab Switcher -->
            <div class="flex p-1 bg-[#F0F2F5] rounded-xl mb-8 w-full md:w-fit">
              <button 
                (click)="activeTab = 'event'" 
                [class.bg-white]="activeTab === 'event'"
                [class.shadow-sm]="activeTab === 'event'"
                [class.text-[#1B3C53]]="activeTab === 'event'"
                [class.text-[#456882]]="activeTab !== 'event'"
                class="flex-1 md:flex-none py-3 px-8 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300">
                Event
              </button>
              <button 
                (click)="activeTab = 'message'" 
                [class.bg-white]="activeTab === 'message'"
                [class.shadow-sm]="activeTab === 'message'"
                [class.text-[#1B3C53]]="activeTab === 'message'"
                [class.text-[#456882]]="activeTab !== 'message'"
                class="flex-1 md:flex-none py-3 px-8 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300">
                Message
              </button>
            </div>

            <!-- Event Form -->
            <div *ngIf="activeTab === 'event'" class="space-y-6 animate-fade-in">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">Event Title</label>
                <input 
                  [(ngModel)]="eventData.title" 
                  type="text" 
                  placeholder="e.g. Annual Building Maintenance"
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-bold outline-none transition-all placeholder:text-gray-400">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">Date & Time</label>
                <input 
                  [(ngModel)]="eventData.scheduled_at" 
                  type="datetime-local" 
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-bold outline-none transition-all">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">Description</label>
                <textarea 
                  [(ngModel)]="eventData.content" 
                  rows="4"
                  placeholder="Provide details about the event..."
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-medium outline-none transition-all placeholder:text-gray-400 resize-none"></textarea>
              </div>

              <div class="pt-4">
                <app-ui-button variant="primary" customClass="w-full !py-5" (btnClick)="createEvent()">
                  SCHEDULE EVENT
                </app-ui-button>
              </div>

              <!-- Existing Events List -->
              <div class="mt-12 pt-8 border-t-2 border-[#F0F2F5]">
                <h3 class="text-lg font-black text-[#1B3C53] mb-6">SCHEDULED EVENTS</h3>
                <div class="space-y-4">
                  <div *ngFor="let event of events" class="bg-[#F0F2F5] p-6 rounded-2xl flex justify-between items-start group hover:bg-white hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F0F2F5]">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="font-bold text-[#1B3C53]">{{ event.title }}</h4>
                        <span class="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-md uppercase">
                          {{ event.scheduled_at | date:'MMM d, h:mm a' }}
                        </span>
                      </div>
                      <p class="text-sm text-[#456882]">{{ event.content }}</p>
                    </div>
                    <button 
                      (click)="deleteEvent(event.id)"
                      class="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                      <span class="material-icons text-[16px]">delete_outline</span>
                      <span class="text-[10px] font-black uppercase tracking-wider">Remove</span>
                    </button>
                  </div>
                  <div *ngIf="events.length === 0" class="text-center py-8 text-[#456882]/50 text-sm font-medium italic">
                    No upcoming events scheduled
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Form -->
            <div *ngIf="activeTab === 'message'" class="space-y-6 animate-fade-in">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">Message Type</label>
                <div class="grid grid-cols-3 gap-4">
                  <button 
                    *ngFor="let type of ['info', 'alert', 'reminder']"
                    (click)="messageData.message_type = type"
                    [class.ring-2]="messageData.message_type === type"
                    [class.ring-[#1B3C53]]="messageData.message_type === type"
                    [class.bg-blue-50]="type === 'info'"
                    [class.text-blue-600]="type === 'info'"
                    [class.bg-red-50]="type === 'alert'"
                    [class.text-red-600]="type === 'alert'"
                    [class.bg-yellow-50]="type === 'reminder'"
                    [class.text-yellow-600]="type === 'reminder'"
                    class="py-4 rounded-2xl font-black uppercase text-xs tracking-wider border-2 border-transparent hover:scale-[1.02] transition-all">
                    {{ type }}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#456882] tracking-widest uppercase pl-1">Content</label>
                <textarea 
                  [(ngModel)]="messageData.content" 
                  rows="6"
                  placeholder="Type your message here..."
                  class="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#1B3C53] focus:bg-white rounded-2xl px-6 py-4 text-[#1B3C53] font-medium outline-none transition-all placeholder:text-gray-400 resize-none"></textarea>
              </div>

              <div class="pt-4">
                <app-ui-button variant="primary" customClass="w-full !py-5" (btnClick)="createMessage()">
                  POST MESSAGE
                </app-ui-button>
              </div>

              <!-- Existing Messages List -->
              <div class="mt-12 pt-8 border-t-2 border-[#F0F2F5]">
                <h3 class="text-lg font-black text-[#1B3C53] mb-6">POSTED MESSAGES</h3>
                <div class="space-y-4">
                  <div *ngFor="let message of messages" class="bg-[#F0F2F5] p-6 rounded-2xl flex justify-between items-start group hover:bg-white hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F0F2F5]">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span 
                          [ngClass]="{
                            'bg-blue-100 text-blue-700': message.message_type === 'info',
                            'bg-red-100 text-red-700': message.message_type === 'alert',
                            'bg-yellow-100 text-yellow-700': message.message_type === 'reminder'
                          }"
                          class="text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                          {{ message.message_type }}
                        </span>
                        <span class="text-xs font-bold text-[#456882]">
                          {{ message.created_at | date:'MMM d, h:mm a' }}
                        </span>
                      </div>
                      <p class="text-sm text-[#1B3C53] font-medium leading-relaxed">{{ message.content }}</p>
                    </div>
                    <button 
                      (click)="deleteMessage(message.id)"
                      class="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 ml-4">
                      <span class="material-icons text-[16px]">delete_outline</span>
                      <span class="text-[10px] font-black uppercase tracking-wider">Remove</span>
                    </button>
                  </div>
                  <div *ngIf="messages.length === 0" class="text-center py-8 text-[#456882]/50 text-sm font-medium italic">
                    No messages posted
                  </div>
                </div>
              </div>
            </div>

          </app-ui-card>
        </div>
      </div>
    </div>
  `
})
export class CreateAnnouncementComponent implements OnInit {
  activeTab: 'event' | 'message' = 'event';
  buildingId: string = '';

  eventData: Partial<CreateEventInput> = {};
  messageData: Partial<CreateMessageInput> = { message_type: 'info' };

  events: any[] = [];
  messages: any[] = [];

  private eventService = inject(EventService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.route.params.subscribe(params => {
      this.buildingId = params['buildingId'];
    });
  }

  ngOnInit() {
    if (this.buildingId) {
      this.loadEvents();
      this.loadMessages();
    }
  }

  loadEvents() {
    this.eventService.getEventsByBuilding(this.buildingId).subscribe(events => {
      this.events = events;
      this.cdr.detectChanges();
    });
  }

  loadMessages() {
    this.messageService.getMessagesByBuilding(this.buildingId).subscribe(messages => {
      this.messages = messages;
      this.cdr.detectChanges();
    });
  }

  createEvent() {
    if (!this.buildingId) return;

    const user = this.authService.currentUser();
    if (!user) return;

    const input: CreateEventInput = {
      building_id: this.buildingId,
      title: this.eventData.title!,
      scheduled_at: new Date(this.eventData.scheduled_at!).toISOString(),
      content: this.eventData.content,
      created_by: user.id
    };

    this.eventService.createEvent(input).subscribe(() => {
      alert('Event created successfully!');
      this.eventData = {};
      this.loadEvents();
    });
  }

  createMessage() {
    if (!this.buildingId) return;

    const user = this.authService.currentUser();
    if (!user) return;

    const input: CreateMessageInput = {
      building_id: this.buildingId,
      content: this.messageData.content!,
      message_type: this.messageData.message_type,
      posted_by: user.id
    };

    this.messageService.createMessage(input).subscribe(() => {
      alert('Message posted successfully!');
      this.messageData = { message_type: 'info' };
      this.loadMessages();
    });
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.events = this.events.filter(e => e.id !== id);
        this.cdr.detectChanges();
      });
    }
  }

  deleteMessage(id: string) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(id).subscribe(() => {
        this.messages = this.messages.filter(m => m.id !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
