import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';
import { RouterModule } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
    selector: 'app-building-qr',
    standalone: true,
    imports: [CommonModule, UiCard, UiButton, RouterModule],
    template: `
    <div class="min-h-screen bg-[#F0F2F5] p-6 md:p-12">
      <div class="max-w-4xl mx-auto">
        <header class="mb-16 animate-fade-in-up">
          <app-ui-button variant="ghost" routerLink="/dashboard" class="mb-6 !p-0 hover:!bg-transparent group">
            <span class="flex items-center gap-2 text-[#456882] font-black tracking-widest text-[10px] group-hover:text-[#1B3C53] transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
              BACK TO COMMAND CENTER
            </span>
          </app-ui-button>
          <h1 class="text-5xl font-black tracking-tighter text-[#1B3C53]">
            ACCESS <span class="text-gradient">GENERATOR</span>
          </h1>
          <p class="text-[#456882] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Generate secure registration gateways for building assets</p>
        </header>

        <div *ngIf="buildings.length === 0" class="animate-fade-in-up stagger-1">
          <div class="bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#456882]/20 p-20 rounded-[3rem] text-center">
            <p class="text-[#456882] font-black uppercase tracking-[0.2em] text-sm">No building assets identified</p>
            <p class="text-[#456882]/60 text-xs mt-2">Initialize a building asset to generate access credentials.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-10">
          <div *ngFor="let building of buildings; let i = index" 
               class="animate-fade-in-up" 
               [style.animation-delay]="(i * 0.1) + 's'">
            <app-ui-card [title]="building.building_name" class="!p-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div class="space-y-8">
                  <div class="p-6 bg-[#F0F2F5] rounded-3xl border border-gray-100">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-3">Asset Location</p>
                    <p class="text-xl font-black text-[#1B3C53] tracking-tight">{{ building.location }}</p>
                  </div>
                  
                  <div class="p-6 bg-white border-2 border-[#F0F2F5] rounded-3xl">
                    <p class="text-[10px] font-black text-[#456882] tracking-widest uppercase mb-3">System Identifier</p>
                    <code class="text-xs font-mono text-[#456882] break-all block bg-[#F0F2F5] p-3 rounded-xl">{{ building.id }}</code>
                  </div>

                  <app-ui-button variant="primary" class="w-full !py-5 shadow-lg shadow-[#1B3C53]/10" (btnClick)="copyLink(building.id)">
                    COPY REGISTRATION LINK
                  </app-ui-button>
                </div>
                
                <div class="flex flex-col items-center justify-center p-10 bg-white rounded-[2.5rem] border-2 border-[#F0F2F5] shadow-inner">
                  <div class="p-4 bg-white rounded-3xl shadow-2xl border border-gray-50">
                    <canvas [id]="'qr-' + building.id" class="w-full max-w-[200px]"></canvas>
                  </div>
                  <div class="mt-8 text-center">
                    <p class="text-[10px] font-black text-[#1B3C53] tracking-[0.3em] uppercase">Secure Gateway</p>
                    <p class="text-[8px] font-bold text-[#456882] uppercase mt-1">Scan to initiate resident onboarding</p>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BuildingQR implements OnInit {
    buildings: any[] = [];

    constructor(
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const sessionStr = localStorage.getItem('sb-session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.user) {
                this.authService.getAdminBuildings(session.user.id).subscribe((res: any[]) => {
                    this.buildings = res;
                    this.cdr.detectChanges();
                    setTimeout(() => this.generateQRs(), 100);
                });
            }
        }
    }

    generateQRs() {
        this.buildings.forEach(b => {
            const buildingId = b.id;
            const canvas = document.getElementById(`qr-${buildingId}`) as HTMLCanvasElement;
            if (canvas) {
                const url = `${window.location.origin}/tenant/register?buildingId=${buildingId}`;
                QRCode.toCanvas(canvas, url, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#1B3C53',
                        light: '#FFFFFF'
                    }
                });
            }
        });
    }

    copyLink(id: string) {
        const url = `${window.location.origin}/tenant/register?buildingId=${id}`;
        navigator.clipboard.writeText(url);
        alert('Registration link copied to system clipboard.');
    }
}
