import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tenant-expenses',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6">
      <h1 class="text-3xl font-black text-[#1B3C53] mb-8">My Expenses</h1>
      
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 text-center text-gray-400">
          <span class="material-icons text-6xl mb-4 opacity-20">receipt_long</span>
          <p class="font-bold">No expenses recorded</p>
        </div>
      </div>
    </div>
  `
})
export class TenantExpensesComponent { }
