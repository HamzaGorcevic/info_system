import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, Document } from '../../../services/document.service';
import { AuthService } from '../../../services/auth.service';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-[#1B3C53]">Building Documents</h1>
        <button (click)="triggerUpload()" [disabled]="isUploading" class="px-6 py-3 bg-[#1B3C53] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#2C5F8D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="material-icons" *ngIf="!isUploading">upload_file</span>
          <span class="material-icons animate-spin" *ngIf="isUploading">refresh</span>
          {{ isUploading ? 'Uploading...' : 'Upload Document' }}
        </button>
        <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)">
      </div>

      <div *ngIf="documents.length === 0" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 text-center text-gray-400">
          <span class="material-icons text-6xl mb-4 opacity-20">folder_open</span>
          <p class="font-bold">No documents uploaded yet</p>
          <p class="text-sm mt-2">Upload building regulations, meeting minutes, or notices.</p>
        </div>
      </div>

      <div *ngIf="documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let doc of documents" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <span class="material-icons">description</span>
                </div>
                <button (click)="deleteDocument(doc.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <span class="material-icons">delete</span>
                </button>
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
export class AdminDocumentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  documents: Document[] = [];
  buildingId: string | null = null;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    const user = this.authService.currentUser();
    if (user) {
      this.authService.getAdminBuildings(user.id).subscribe(buildings => {
        if (buildings && buildings.length > 0) {
          this.buildingId = buildings[0].id; // Assuming single building for now
          this.documentService.getDocumentsByBuilding(this.buildingId!).subscribe(docs => {
            console.log('Documents loaded:', docs);
            this.documents = docs;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  isUploading = false;

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.buildingId) {
      const title = prompt('Enter document title:', file.name);
      if (title) {
        this.isUploading = true;
        const user = this.authService.currentUser();
        this.documentService.uploadDocument(file, title, this.buildingId, user.id).subscribe({
          next: (doc) => {
            this.documents.unshift(doc);
            this.isUploading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Upload failed', err);
            this.isUploading = false;
            alert('Upload failed. Please try again.');
            this.cdr.detectChanges();
          }
        });
      }
    }
    // Reset input
    event.target.value = '';
  }

  deleteDocument(id: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe(() => {
        this.documents = this.documents.filter(d => d.id !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
