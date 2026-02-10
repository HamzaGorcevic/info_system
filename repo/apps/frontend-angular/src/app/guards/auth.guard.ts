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
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.hasRole(allowedRoles)) {
            if (authService.isVerified()) {
                return true;
            }
            if (state.url === '/verification-pending') {
                return true;
            }
            return router.createUrlTree(['/verification-pending']);
        }

        if (authService.isLoggedIn()) {
            const user = authService.currentUser();
            const targetRoute = user?.role === 'manager' ? '/admin/analytics' : '/tenant/dashboard';

            // Prevent infinite loop if we are already trying to access the target route
            if (state.url === targetRoute) {
                // If we are here, it means we are logged in, at the dashboard, 
                // BUT hasRole() returned false. This implies a role mismatch or data issue.
                // We should probably allow access if the role matches the specific dashboard
                // or redirect to a generic error/login to be safe.
                // For now, let's log and return false to stop the loop.
                console.error('Role Guard: Loop detected or role mismatch on dashboard.', { userRole: user?.role, allowedRoles });
                return false;
            }

            return router.createUrlTree([targetRoute]);
        }

        return router.createUrlTree(['/login']);
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
            router.navigate(['/admin/analytics']);
        } else {
            router.navigate(['/tenant/dashboard']);
        }
        return false;
    }
    return true;
};
