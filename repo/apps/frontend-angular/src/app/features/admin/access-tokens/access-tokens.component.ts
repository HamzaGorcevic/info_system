import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicerService } from '../../../services/servicer.service';
import { UiCard } from '../../../shared/ui/card/card';
import { UiButton } from '../../../shared/ui/button/button';
import { BackButtonComponent } from '../../../shared/ui/back-button/back-button.component';
import { AdminNavComponent } from '../../../shared/ui/admin-nav/admin-nav.component';

@Component({
    selector: 'app-access-tokens',
    standalone: true,
    imports: [CommonModule, UiCard, UiButton, BackButtonComponent, AdminNavComponent],
    templateUrl: './access-tokens.component.html'
})
export class AccessTokensComponent implements OnInit {
    private servicerService = inject(ServicerService);
    private cdr = inject(ChangeDetectorRef);

    tokens: any[] = [];
    isLoading = true;

    ngOnInit() {
        this.loadTokens();
    }

    loadTokens() {
        this.servicerService.getAllTokens().subscribe({
            next: (data) => {
                this.tokens = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading tokens', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    revokeToken(token: any) {
        if (!confirm(`Are you sure you want to revoke access for ${token.servicers?.full_name || 'this servicer'}?`)) {
            return;
        }

        this.servicerService.revokeToken(token.id).subscribe({
            next: () => {
                alert('Token revoked successfully!');
                this.loadTokens();
            },
            error: (err) => {
                console.error('Error revoking token', err);
                alert('Failed to revoke token');
            }
        });
    }

    getMagicLink(token: string): string {
        return `${window.location.origin}/servicer/access/${token}`;
    }

    copyLink(token: string) {
        const link = this.getMagicLink(token);
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        });
    }

    getStatusClass(isActive: boolean, expiresAt: string): string {
        if (!isActive) return 'bg-red-100 text-red-800';
        const now = new Date();
        const expiry = new Date(expiresAt);
        if (expiry < now) return 'bg-gray-100 text-gray-800';
        return 'bg-green-100 text-green-800';
    }

    getStatusText(isActive: boolean, expiresAt: string): string {
        if (!isActive) return 'REVOKED';
        const now = new Date();
        const expiry = new Date(expiresAt);
        if (expiry < now) return 'EXPIRED';
        return 'ACTIVE';
    }

    isExpired(expiresAt: string): boolean {
        return new Date(expiresAt) < new Date();
    }
}
