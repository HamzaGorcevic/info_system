import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Unified functional guard for role-based authorization.
 * Usage in routes: 
 * { 
 *   path: 'admin', 
 *   canActivate: [roleGuard(['manager'])],
 *   ... 
 * }
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.hasRole(allowedRoles)) {
            return true;
        }

        // If logged in but wrong role, redirect to their correct dashboard
        if (authService.isLoggedIn()) {
            const user = authService.currentUser();
            if (user?.role === 'manager') {
                router.navigate(['/dashboard']);
            } else {
                router.navigate(['/tenant/dashboard']);
            }
            return false;
        }

        // Not logged in at all
        router.navigate(['/login']);
        return false;
    };
};

/**
 * Guard to prevent logged-in users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const user = authService.currentUser();
        if (user?.role === 'manager') {
            router.navigate(['/dashboard']);
        } else {
            router.navigate(['/tenant/dashboard']);
        }
        return false;
    }
    return true;
};
