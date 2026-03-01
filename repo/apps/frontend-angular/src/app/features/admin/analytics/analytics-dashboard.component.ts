import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalfunctionService } from '../../../services/malfunction.service';
import { AuthService } from '../../../services/auth.service';
import { Malfunction } from '@repo/domain';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-black text-[#1B3C53] mb-6">Analytics Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Cards -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Tenants</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : totalTenants }}
          </p>
          <p class="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
            <span class="material-icons text-sm">trending_up</span> Active Residents
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Occupancy Rate</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : occupancyRate }}%
          </p>
          <p class="text-gray-400 text-sm font-bold mt-2">Across building</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Active Issues</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : activeIssuesCount }}
          </p>
          <p class="text-red-500 text-sm font-bold mt-2 flex items-center gap-1">
            <span class="material-icons text-sm">warning</span> Unresolved
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-bold uppercase tracking-wider">Avg. Response</h3>
          <p class="text-4xl font-black text-[#1B3C53] mt-2">
            {{ isLoading ? '...' : avgResponseTime }}
          </p>
          <p class="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
            <span class="material-icons text-sm">check_circle</span> Time to start
          </p>
        </div>
      </div>
      
      <div class="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
        <p class="text-gray-400 font-bold">Chart Area Placeholder</p>
      </div>
    </div>
  `
})
export class AnalyticsDashboardComponent implements OnInit {
  activeIssuesCount = 0;
  avgResponseTime = '--';
  totalTenants = 0;
  occupancyRate = 0;
  isLoading = true;

  constructor(
    private malfunctionService: MalfunctionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    console.log('Loading analytics data...');

    // Load Malfunctions
    this.malfunctionService.getAllMalfunctions().subscribe({
      next: (malfunctions) => {
        console.log('Malfunctions loaded:', malfunctions.length);

        // Count malfunctions that are NOT resolved
        this.activeIssuesCount = malfunctions.filter((m: Malfunction) =>
          m.status !== 'resolved'
        ).length;

        // Calculate Avg Response (created_at to started_at)
        const responseTimes = malfunctions
          .filter((m: Malfunction) => m.created_at && m.started_at)
          .map((m: Malfunction) => {
            const start = new Date(m.created_at!).getTime();
            const end = new Date(m.started_at!).getTime();
            return end - start;
          });

        if (responseTimes.length > 0) {
          const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
          const avgHours = Math.round(avgMs / (1000 * 60 * 60) * 10) / 10;
          this.avgResponseTime = `${avgHours}h`;
        } else {
          this.avgResponseTime = 'N/A';
        }

        this.checkLoading();
      },
      error: (err) => {
        console.error('Error loading analytics data:', err);
        this.checkLoading();
      }
    });

    // Load Buildings/Tenants
    const user = this.authService.currentUser();
    if (user) {
      this.authService.getManagerBuilding().subscribe({
        next: (building) => {
          if (building) {
            this.totalTenants = building.tenants_count || 0;
            this.occupancyRate = building.number_apartments > 0
              ? Math.round((this.totalTenants / building.number_apartments) * 100)
              : 0;
          }
          this.checkLoading();
        },
        error: (err) => {
          console.error('Error loading building:', err);
          this.checkLoading();
        }
      });
    } else {
      this.checkLoading();
    }
  }

  private loadingChecks = 0;
  private checkLoading() {
    this.loadingChecks++;
    // We have 2 data sources
    if (this.loadingChecks >= 2) {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
