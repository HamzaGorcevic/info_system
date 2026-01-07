import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpensesService } from '../../../services/expenses.service';
import { BuildingService } from '../../../services/building.service';
import { AuthService } from '../../../services/auth.service';
import { EventsService } from '../../../services/events.service';
import { Database } from '@repo/types';

@Component({
    selector: 'app-admin-expenses',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-[#1B3C53]">Tenant Expenses</h1>
        <button (click)="showAddModal = true" class="bg-[#1B3C53] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2A5A7A] transition-colors flex items-center gap-2">
          <span class="material-icons">add</span>
          Add Expense
        </button>
      </div>

      <!-- Add Expense Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-3xl p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold text-[#1B3C53] mb-6">Add New Expense</h2>
          
          <form (ngSubmit)="createExpense()">
            <div class="mb-4">
              <label class="block text-gray-500 text-sm font-bold mb-2">Tenant</label>
              <select [(ngModel)]="newExpense.tenant_id" name="tenant_id" class="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1B3C53] outline-none" required>
                <option value="" disabled>Select Tenant</option>
                <option *ngFor="let tenant of tenants" [value]="tenant.id">
                   {{ tenant.tenant_number }} - {{ tenant.apartment_number }} ({{ tenant.building_name }})
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-500 text-sm font-bold mb-2">Type</label>
              <select [(ngModel)]="newExpense.expense_type" name="expense_type" class="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1B3C53] outline-none" required>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-500 text-sm font-bold mb-2">Amount</label>
              <input type="number" [(ngModel)]="newExpense.amount" name="amount" class="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1B3C53] outline-none" required min="0" step="0.01">
            </div>

            <div class="mb-6">
              <label class="block text-gray-500 text-sm font-bold mb-2">Description</label>
              <textarea [(ngModel)]="newExpense.description" name="description" class="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1B3C53] outline-none" rows="3"></textarea>
            </div>

            <div class="flex gap-4">
              <button type="button" (click)="showAddModal = false" class="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" [disabled]="isSubmitting" class="flex-1 bg-[#1B3C53] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2A5A7A] transition-colors disabled:opacity-50">
                {{ isSubmitting ? 'Adding...' : 'Add Expense' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8 text-gray-500">
        <div class="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading expenses...
      </div>

      <!-- Expenses List -->
      <div *ngIf="!isLoading" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Date</th>
              <th class="text-left p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Tenant</th>
              <th class="text-left p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Type</th>
              <th class="text-left p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Amount</th>
              <th class="text-left p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Status</th>
              <th class="text-right p-6 text-gray-400 font-bold uppercase text-sm tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let expense of expenses" class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td class="p-6 text-gray-600 font-medium">{{ expense.created_at | date:'shortDate' }}</td>
              <td class="p-6 text-[#1B3C53] font-bold">
                 {{ getTenantName(expense.tenant_id) }}
              </td>
              <td class="p-6 text-gray-600">{{ expense.expense_type }}</td>
              <td class="p-6 text-[#1B3C53] font-bold">{{ expense.amount | currency }}</td>
              <td class="p-6">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  [ngClass]="{
                    'bg-green-100 text-green-700': expense.status === 'paid',
                    'bg-red-100 text-red-700': expense.status === 'unpaid',
                    'bg-gray-100 text-gray-700': expense.status === 'cancelled'
                  }">
                  {{ expense.status }}
                </span>
              </td>
              <td class="p-6 text-right">
                <div class="flex gap-2 justify-end">
                  <button *ngIf="expense.status === 'unpaid'" (click)="openNotifyModal(expense)" class="text-blue-400 hover:text-blue-600 transition-colors" title="Notify Tenant">
                    <span class="material-icons">notifications</span>
                  </button>
                  <button (click)="deleteExpense(expense.id)" class="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="expenses.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No expenses found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notify Modal -->
      <div *ngIf="showNotifyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-3xl p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold text-[#1B3C53] mb-6">Send Payment Reminder</h2>
          
          <form (ngSubmit)="sendNotification()">
            <div class="mb-4">
              <label class="block text-gray-500 text-sm font-bold mb-2">Tenant</label>
              <p class="text-[#1B3C53] font-bold">{{ selectedExpense ? getTenantName(selectedExpense.tenant_id) : '' }}</p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-500 text-sm font-bold mb-2">Expense</label>
              <p class="text-gray-600">{{ selectedExpense?.expense_type }} - {{ selectedExpense?.amount | currency }}</p>
            </div>

            <div class="mb-6">
              <label class="block text-gray-500 text-sm font-bold mb-2">Message</label>
              <textarea [(ngModel)]="notificationMessage" name="message" class="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1B3C53] outline-none" rows="4" required></textarea>
            </div>

            <div class="flex gap-4">
              <button type="button" (click)="showNotifyModal = false" class="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" [disabled]="isSendingNotification" class="flex-1 bg-[#1B3C53] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2A5A7A] transition-colors disabled:opacity-50">
                {{ isSendingNotification ? 'Sending...' : 'Send Notification' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminExpensesComponent implements OnInit {
    expenses: Database['public']['Tables']['tenant_expenses']['Row'][] = [];
    tenants: any[] = [];
    showAddModal = false;
    isSubmitting = false;
    isLoading = true;
    showNotifyModal = false;
    isSendingNotification = false;
    selectedExpense: Database['public']['Tables']['tenant_expenses']['Row'] | null = null;
    notificationMessage = '';

    newExpense = {
        tenant_id: '',
        expense_type: 'Rent',
        amount: 0,
        description: ''
    };

    constructor(
        private expensesService: ExpensesService,
        private buildingService: BuildingService,
        private authService: AuthService,
        private eventsService: EventsService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const user = this.authService.currentUser();
        if (!user) return;

        this.expensesService.getAllExpenses().subscribe({
            next: (data) => {
                this.expenses = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading expenses:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });

        this.loadTenants(user.id);
    }

    loadTenants(userId: string) {
        this.authService.getAdminBuildings(userId).subscribe(buildings => {
            buildings.forEach(b => {
                this.buildingService.getBuildingTenants(b.id).subscribe(t => {
                    this.tenants = [...this.tenants, ...t.map(tenant => ({ ...tenant, building_name: b.building_name }))];
                    this.cdr.detectChanges();
                });
            });
        });
    }

    getTenantName(tenantId: string): string {
        const tenant = this.tenants.find(t => t.id === tenantId);
        return tenant ? `${tenant.tenant_number} - ${tenant.apartment_number} (${tenant.building_name})` : 'Unknown';
    }

    createExpense() {
        if (!this.newExpense.tenant_id || this.newExpense.amount <= 0) return;

        this.isSubmitting = true;
        this.expensesService.createExpense(this.newExpense).subscribe({
            next: (expense) => {
                this.expenses.unshift(expense);
                this.showAddModal = false;
                this.isSubmitting = false;
                this.resetForm();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error creating expense:', err);
                this.isSubmitting = false;
            }
        });
    }

    deleteExpense(id: string) {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        this.expensesService.deleteExpense(id).subscribe({
            next: () => {
                this.expenses = this.expenses.filter(e => e.id !== id);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error deleting expense:', err)
        });
    }

    resetForm() {
        this.newExpense = {
            tenant_id: '',
            expense_type: 'Rent',
            amount: 0,
            description: ''
        };
    }

    openNotifyModal(expense: Database['public']['Tables']['tenant_expenses']['Row']) {
        this.selectedExpense = expense;
        const tenant = this.tenants.find(t => t.id === expense.tenant_id);
        this.notificationMessage = `Payment Reminder: Please pay your ${expense.expense_type} expense of $${expense.amount}. ${expense.description || ''}`.trim();
        this.showNotifyModal = true;
    }

    sendNotification() {
        if (!this.selectedExpense || !this.notificationMessage) return;

        const tenant = this.tenants.find(t => t.id === this.selectedExpense!.tenant_id);
        if (!tenant || !tenant.building_id) {
            alert('Unable to find tenant building information');
            return;
        }

        this.isSendingNotification = true;
        const eventData = {
            building_id: tenant.building_id,
            title: 'Payment Reminder',
            scheduled_at: new Date().toISOString(),
            content: this.notificationMessage
        };

        this.eventsService.createEvent(eventData).subscribe({
            next: () => {
                this.showNotifyModal = false;
                this.isSendingNotification = false;
                this.selectedExpense = null;
                this.notificationMessage = '';
                alert('Notification sent successfully!');
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error sending notification:', err);
                alert('Failed to send notification');
                this.isSendingNotification = false;
                this.cdr.detectChanges();
            }
        });
    }
}
