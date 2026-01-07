import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:4000/api/auth';

    // Use a signal for reactive user state
    private _user = signal<any>(this.getStoredUser());
    currentUser = computed(() => this._user());

    constructor(private http: HttpClient) { }

    private getStoredUser() {
        const sessionStr = localStorage.getItem('sb-session');
        if (!sessionStr) return null;
        try {
            const session = JSON.parse(sessionStr);
            return session.user?.profile || session.user || null;
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
        return user && roles.includes(user.role);
    }

    isVerified(): boolean {
        const user = this._user();
        if (user?.role === 'manager') return true;
        return !!user?.is_verified;
    }
}
