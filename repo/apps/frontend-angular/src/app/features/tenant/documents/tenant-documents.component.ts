import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, Document } from '../../../services/document.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-tenant-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-black text-[#1B3C53] mb-8">Documents</h1>

      <div *ngIf="documents.length === 0" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 text-center text-gray-400">
          <span class="material-icons text-6xl mb-4 opacity-20">folder_open</span>
          <p class="font-bold">No documents available</p>
          <p class="text-sm mt-2">Check back later for building updates.</p>
        </div>
      </div>

      <div *ngIf="documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let doc of documents" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <span class="material-icons">description</span>
                </div>
            </div>
            <h3 class="font-bold text-[#1B3C53] mb-1">{{ doc.title }}</h3>
            <p class="text-xs text-gray-400 mb-4">Uploaded on {{ doc.created_at | date }}</p>
            <a [href]="doc.file_url" target="_blank" class="mt-auto text-blue-500 font-bold text-sm hover:underline flex items-center gap-1">
                View Document <span class="material-icons text-sm">open_in_new</span>
            </a>
        </div>
      </div>
    </div>
  `
})
export class TenantDocumentsComponent implements OnInit {
  documents: Document[] = [];

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.buildingService.getTenantData(user.id).subscribe(tenantData => {
        if (tenantData) {
          this.documentService.getDocumentsByBuilding(tenantData.building_id).subscribe(docs => {
            this.documents = docs;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }
}
