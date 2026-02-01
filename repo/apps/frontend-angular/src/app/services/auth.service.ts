import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    // Use a signal for reactive user state
    private _user = signal<any>(this.getStoredUser());
    currentUser = computed(() => this._user());

    constructor(private http: HttpClient) { }

    private getStoredUser() {
        const sessionStr = localStorage.getItem('sb-session');
        if (!sessionStr) return null;
        try {
            const session = JSON.parse(sessionStr);
            const user = session.user?.profile || session.user || null;
            return user;
        } catch {
            return null;
        }
    }


    registerAdmin(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register-admin`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(
            tap((res: any) => {
                this.saveSession(res);
            })
        );
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
            tap((res: any) => {
                this.saveSession(res);
            })
        );
    }

    private saveSession(res: any) {
        if (res.session) {
            const session = { ...res.session };
            if (res.user) {
                session.user = { ...session.user, profile: res.user };
            }
            localStorage.setItem('sb-session', JSON.stringify(session));
            this._user.set(res.user);
        }
    }

    registerTenant(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register-tenant`, data);
    }

    getAdminBuildings(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/buildings?userId=${userId}`);
    }

    logout() {
        localStorage.removeItem('sb-session');
        this._user.set(null);
    }

    isLoggedIn(): boolean {
        return !!this._user();
    }


    hasRole(roles: string[]): boolean {
        const user = this._user();
        if (!user) return false;

        // Check explicit role from our DB profile
        if (roles.includes(user.role)) {
            return true;
        }

        // Handle Supabase default 'authenticated' role
        if (user.role === 'authenticated') {
            const metadataRole = user.user_metadata?.role;

            // If checking for manager, require explicit manager role in metadata
            if (roles.includes('manager')) {
                return metadataRole === 'manager';
            }

            // If checking for tenant, allow if NOT a manager (failed manager check check above covers explicit manager)
            // primarily: if no metadata role is set, it's a tenant
            if (roles.includes('tenant')) {
                return metadataRole !== 'manager';
            }
        }

        return false;
    }

    isVerified(): boolean {
        const user = this._user();
        if (user?.role === 'manager') return true;
        return !!user?.is_verified;
    }
}
