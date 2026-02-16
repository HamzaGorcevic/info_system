import {
    Component,
    Input,
    forwardRef,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as L from 'leaflet';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

@Component({
    selector: 'app-location-picker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LocationPicker),
            multi: true,
        },
    ],
    template: `
    <!-- Trigger Button — mimics the same input-field + floating label as other form fields -->
    <div class="location-trigger" (click)="openDialog()" [class.has-value]="!!value">
      <div class="location-input-fake">
        <span class="location-input-text" *ngIf="value">{{ value }}</span>
        <span class="location-input-placeholder" *ngIf="!value">&nbsp;</span>
        <svg class="location-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <label class="location-floating-label" [class.floated]="!!value">{{ label }}</label>
    </div>

    <!-- Map Dialog Overlay -->
    <div class="map-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="map-dialog" (click)="$event.stopPropagation()">
        <!-- Dialog Header -->
        <div class="map-dialog-header">
          <div class="map-dialog-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>SELECT LOCATION</span>
          </div>
          <button class="map-dialog-close" (click)="closeDialog()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="map-search-container">
          <div class="map-search-wrapper">
            <svg class="map-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              #searchInput
              type="text"
              class="map-search-input"
              [(ngModel)]="searchQuery"
              (keydown.enter)="searchLocation()"
              placeholder="Search for an address or place..."
            />
            <button
              class="map-search-btn"
              (click)="searchLocation()"
              [disabled]="searching"
            >
              <span *ngIf="!searching">SEARCH</span>
              <span *ngIf="searching" class="map-search-spinner"></span>
            </button>
          </div>
          <!-- Search Results -->
          <div class="map-search-results" *ngIf="searchResults.length > 0">
            <button
              class="map-search-result-item"
              *ngFor="let result of searchResults"
              (click)="selectSearchResult(result)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ result.display_name }}</span>
            </button>
          </div>
        </div>

        <!-- Map Container -->
        <div class="map-container" #mapContainer></div>

        <!-- Selected Location Bar -->
        <div class="map-dialog-footer">
          <div class="selected-location" *ngIf="selectedAddress">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="selected-location-text">{{ selectedAddress }}</span>
          </div>
          <div class="selected-location selected-location-empty" *ngIf="!selectedAddress">
            <span>Click on the map or search to select a location</span>
          </div>
          <div class="map-dialog-actions">
            <button class="map-btn-cancel" (click)="closeDialog()">CANCEL</button>
            <button
              class="map-btn-confirm"
              (click)="confirmSelection()"
              [disabled]="!selectedAddress"
            >
              CONFIRM LOCATION
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      /* ========= Trigger — matches .input-field exactly ========= */
      .location-trigger {
        position: relative;
        cursor: pointer;
      }

      .location-input-fake {
        width: 100%;
        padding: 1.25rem 1.5rem;
        padding-right: 3rem;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        border: 2px solid rgba(69, 104, 130, 0.1);
        border-radius: 1.25rem;
        font-weight: 700;
        font-size: 0.875rem;
        color: #1b3c53;
        transition: all 0.3s ease;
        min-height: 0;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .location-trigger:hover .location-input-fake {
        border-color: #1b3c53;
        background: white;
      }

      .location-trigger.has-value .location-input-fake {
        background: white;
      }

      .location-input-text {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .location-input-placeholder {
        color: rgba(69, 104, 130, 0.3);
      }

      /* Small map-pin icon inside the field on the right */
      .location-input-icon {
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(69, 104, 130, 0.4);
        pointer-events: none;
        transition: color 0.3s ease;
      }

      .location-trigger:hover .location-input-icon {
        color: #1b3c53;
      }

      /* Floating label — matches admin-register peer-label style */
      .location-floating-label {
        position: absolute;
        left: 1.5rem;
        top: 1.25rem;
        padding: 0 0.5rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: rgba(69, 104, 130, 0.6);
        background: transparent;
        transform-origin: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        line-height: 1;
      }

      .location-floating-label.floated {
        top: -0.55rem;
        font-size: 0.79rem;
        background: white;
        color: #1b3c53;
      }

      .location-trigger:hover .location-floating-label {
        color: #1b3c53;
      }

      /* ========= Dialog Overlay ========= */
      .map-overlay {
        position: fixed;
        inset: 0;
        background: rgba(27, 60, 83, 0.6);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: overlayFadeIn 0.3s ease;
      }

      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* ========= Dialog ========= */
      .map-dialog {
        width: 100%;
        max-width: 900px;
        max-height: 90vh;
        background: white;
        border-radius: 2rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow:
          0 50px 100px rgba(27, 60, 83, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        animation: dialogSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes dialogSlideUp {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* ========= Dialog Header ========= */
      .map-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 28px;
        background: #1b3c53;
        color: white;
      }

      .map-dialog-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.3em;
        text-transform: uppercase;
      }

      .map-dialog-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .map-dialog-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }

      /* ========= Search ========= */
      .map-search-container {
        padding: 16px 20px 0;
        background: #f8f9fb;
        position: relative;
      }

      .map-search-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 2px solid rgba(69, 104, 130, 0.15);
        border-radius: 1rem;
        padding: 4px 4px 4px 16px;
        transition: border-color 0.3s ease;
      }

      .map-search-wrapper:focus-within {
        border-color: #1b3c53;
        box-shadow: 0 4px 20px rgba(27, 60, 83, 0.08);
      }

      .map-search-icon {
        flex-shrink: 0;
        color: #456882;
      }

      .map-search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        color: #1b3c53;
        padding: 10px 8px;
        background: transparent;
        font-family: 'Outfit', sans-serif;
      }

      .map-search-input::placeholder {
        color: rgba(69, 104, 130, 0.35);
        font-weight: 500;
      }

      .map-search-btn {
        flex-shrink: 0;
        padding: 10px 20px;
        background: #1b3c53;
        color: white;
        border: none;
        border-radius: 0.75rem;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.15em;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Outfit', sans-serif;
      }

      .map-search-btn:hover:not(:disabled) {
        background: #234c6a;
        transform: translateY(-1px);
      }

      .map-search-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .map-search-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* ========= Search Results ========= */
      .map-search-results {
        position: absolute;
        top: 100%;
        left: 20px;
        right: 20px;
        background: white;
        border: 1px solid rgba(69, 104, 130, 0.12);
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(27, 60, 83, 0.15);
        z-index: 10;
        max-height: 250px;
        overflow-y: auto;
        margin-top: 4px;
      }

      .map-search-result-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
        padding: 14px 18px;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
        font-family: 'Outfit', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #1b3c53;
        transition: background 0.15s ease;
        border-bottom: 1px solid rgba(69, 104, 130, 0.06);
      }

      .map-search-result-item:last-child {
        border-bottom: none;
      }

      .map-search-result-item:hover {
        background: #f0f4f8;
      }

      .map-search-result-item svg {
        flex-shrink: 0;
        margin-top: 2px;
        color: #456882;
      }

      .map-search-result-item span {
        line-height: 1.4;
      }

      /* ========= Map Container ========= */
      .map-container {
        flex: 1;
        min-height: 400px;
        position: relative;
        z-index: 1;
      }

      /* ========= Footer ========= */
      .map-dialog-footer {
        padding: 16px 20px;
        background: #f8f9fb;
        border-top: 1px solid rgba(69, 104, 130, 0.08);
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .selected-location {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        font-weight: 700;
        color: #1b3c53;
        min-width: 0;
      }

      .selected-location svg {
        flex-shrink: 0;
        color: #1b3c53;
      }

      .selected-location-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .selected-location-empty {
        color: rgba(69, 104, 130, 0.4);
        font-weight: 600;
      }

      .map-dialog-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }

      .map-btn-cancel {
        padding: 10px 20px;
        background: transparent;
        color: #456882;
        border: 2px solid rgba(69, 104, 130, 0.2);
        border-radius: 0.75rem;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Outfit', sans-serif;
      }

      .map-btn-cancel:hover {
        border-color: #1b3c53;
        color: #1b3c53;
      }

      .map-btn-confirm {
        padding: 10px 24px;
        background: #1b3c53;
        color: white;
        border: none;
        border-radius: 0.75rem;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Outfit', sans-serif;
      }

      .map-btn-confirm:hover:not(:disabled) {
        background: #234c6a;
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(27, 60, 83, 0.2);
      }

      .map-btn-confirm:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      /* ========= Responsive ========= */
      @media (max-width: 640px) {
        .map-dialog {
          border-radius: 1.25rem;
          max-height: 95vh;
        }

        .map-dialog-header {
          padding: 16px 20px;
        }

        .map-dialog-title {
          font-size: 10px;
          letter-spacing: 0.2em;
        }

        .map-container {
          min-height: 300px;
        }

        .map-dialog-footer {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 14px 16px;
        }

        .map-dialog-actions {
          justify-content: stretch;
        }

        .map-btn-cancel,
        .map-btn-confirm {
          flex: 1;
          text-align: center;
        }
      }
    `,
    ],
})
export class LocationPicker implements AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() label = 'LOCATION / ADDRESS';
    @ViewChild('mapContainer') mapContainer!: ElementRef;
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

    value: string = '';
    isOpen = false;
    searchQuery = '';
    searchResults: NominatimResult[] = [];
    searching = false;
    selectedAddress: string = '';

    private map!: L.Map;
    private marker: L.Marker | null = null;
    private searchTimeout: any;

    private onChange: (val: string) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterViewInit() { }

    ngOnDestroy() {
        this.destroyMap();
    }

    // ControlValueAccessor
    writeValue(val: string): void {
        this.value = val || '';
        this.selectedAddress = this.value;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Dialog
    openDialog() {
        this.isOpen = true;
        this.selectedAddress = this.value || '';
        this.searchResults = [];
        this.cdr.markForCheck();

        // Wait for the DOM to render
        setTimeout(() => this.initMap(), 50);
    }

    closeDialog() {
        this.isOpen = false;
        this.searchResults = [];
        this.destroyMap();
        this.cdr.markForCheck();
    }

    onOverlayClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('map-overlay')) {
            this.closeDialog();
        }
    }

    confirmSelection() {
        if (this.selectedAddress) {
            this.value = this.selectedAddress;
            this.onChange(this.value);
            this.onTouched();
            this.closeDialog();
        }
    }

    // Map
    private initMap() {
        if (!this.mapContainer?.nativeElement) return;

        this.map = L.map(this.mapContainer.nativeElement, {
            zoomControl: true,
        }).setView([43.8563, 18.4131], 13); // Default: Sarajevo

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(this.map);

        // If there's already a selected address, try to geocode it
        if (this.value) {
            this.geocodeAndMark(this.value);
        }

        // On map click, reverse geocode
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        // Force a map size recalculation after dialog animation
        setTimeout(() => {
            this.map?.invalidateSize();
        }, 400);

        // Focus search input
        setTimeout(() => {
            this.searchInput?.nativeElement?.focus();
        }, 500);
    }

    private destroyMap() {
        if (this.map) {
            this.map.remove();
            this.map = null as any;
        }
        this.marker = null;
    }

    private setMarker(lat: number, lng: number) {
        if (this.marker) {
            this.marker.setLatLng([lat, lng]);
        } else {
            this.marker = L.marker([lat, lng]).addTo(this.map);
        }
        this.map.setView([lat, lng], Math.max(this.map.getZoom(), 15));
    }

    // Search
    searchLocation() {
        const query = this.searchQuery.trim();
        if (!query) return;

        this.searching = true;
        this.searchResults = [];
        this.cdr.markForCheck();

        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        )
            .then((res) => res.json())
            .then((results: NominatimResult[]) => {
                this.searchResults = results;
                this.searching = false;
                this.cdr.markForCheck();
            })
            .catch(() => {
                this.searching = false;
                this.cdr.markForCheck();
            });
    }

    selectSearchResult(result: NominatimResult) {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        this.selectedAddress = result.display_name;
        this.searchResults = [];
        this.searchQuery = result.display_name;
        this.setMarker(lat, lng);
        this.cdr.markForCheck();
    }

    private reverseGeocode(lat: number, lng: number) {
        this.setMarker(lat, lng);

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
            .then((res) => res.json())
            .then((data: any) => {
                if (data.display_name) {
                    this.selectedAddress = data.display_name;
                    this.searchQuery = data.display_name;
                    this.cdr.markForCheck();
                }
            })
            .catch(() => { });
    }

    private geocodeAndMark(address: string) {
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        )
            .then((res) => res.json())
            .then((results: NominatimResult[]) => {
                if (results.length > 0) {
                    const lat = parseFloat(results[0].lat);
                    const lng = parseFloat(results[0].lon);
                    this.setMarker(lat, lng);
                }
            })
            .catch(() => { });
    }
}
