import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../../services/expenses.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';
import { Expense } from '@repo/domain';

@Component({
  selector: 'app-tenant-expenses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-black text-[#1B3C53] mb-8">My Expenses</h1>
      
      <div *ngIf="isLoading" class="text-center py-8 text-gray-500">
        Loading expenses...
      </div>

      <div *ngIf="!isLoading && expenses.length === 0" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 text-center text-gray-400">
          <span class="material-icons text-6xl mb-4 opacity-20">receipt_long</span>
          <p class="font-bold">No expenses recorded</p>
        </div>
      </div>

      <div *ngIf="!isLoading && expenses.length > 0" class="grid gap-4">
        <div *ngFor="let expense of expenses" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                [ngClass]="{
                  'bg-green-100 text-green-700': expense.status === 'paid',
                  'bg-red-100 text-red-700': expense.status === 'unpaid',
                  'bg-gray-100 text-gray-700': expense.status === 'cancelled'
                }">
                {{ expense.status }}
              </span>
              <span class="text-gray-400 text-sm">{{ expense.created_at | date:'mediumDate' }}</span>
            </div>
            <h3 class="text-xl font-bold text-[#1B3C53]">{{ expense.expense_type }}</h3>
            <p class="text-gray-500 mt-1" *ngIf="expense.description">{{ expense.description }}</p>
          </div>
          
          <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div class="text-right">
              <p class="text-sm text-gray-400 uppercase font-bold tracking-wider">Amount</p>
              <p class="text-2xl font-black text-[#1B3C53]">{{ expense.amount | currency }}</p>
            </div>

            <button *ngIf="expense.status === 'unpaid'" 
              (click)="payExpense(expense)"
              [disabled]="isProcessing === expense.id"
              class="bg-[#1B3C53] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2A5A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span class="material-icons text-sm" *ngIf="isProcessing !== expense.id">payment</span>
              <span *ngIf="isProcessing === expense.id" class="animate-spin material-icons text-sm">refresh</span>
              Pay Now
            </button>
             <div *ngIf="expense.status === 'paid'" class="text-green-600 font-bold flex items-center gap-1">
                <span class="material-icons">check_circle</span>
                Paid on {{ expense.paid_at | date:'shortDate' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TenantExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading = true;
  isProcessing: string | null = null;

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.buildingService.getTenantData(user.id).subscribe({
      next: (tenantData) => {
        if (!tenantData) {
          this.isLoading = false;
          return;
        }

        this.expensesService.getTenantExpenses(tenantData.id).subscribe({
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
      },
      error: (err) => {
        console.error('Error loading tenant data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  payExpense(expense: Expense) {
    if (!confirm('Are you sure you want to pay this expense?')) return;

    this.isProcessing = expense.id;
    this.expensesService.updateExpense(expense.id, {
      status: 'paid',
      paid_at: new Date().toISOString()
    }).subscribe({
      next: (updatedExpense) => {
        const index = this.expenses.findIndex(e => e.id === updatedExpense.id);
        if (index !== -1) {
          this.expenses[index] = updatedExpense;
        }
        this.isProcessing = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error paying expense:', err);
        alert('Failed to process payment');
        this.isProcessing = null;
        this.cdr.detectChanges();
      }
    });
  }
}
