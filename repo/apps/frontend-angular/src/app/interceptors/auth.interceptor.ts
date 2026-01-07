import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Skip auth for servicer public endpoints
    const publicEndpoints = ['/servicers/verify-token', '/servicers/update-status', '/auth/refresh'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint) {
        return next(req);
    }

    const sessionStr = localStorage.getItem('sb-session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            const token = session.access_token;
            const refreshToken = session.refresh_token;

            if (token) {
                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return next(authReq).pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401 && refreshToken) {
                            // Token might be expired, try to refresh
                            return authService.refreshToken(refreshToken).pipe(
                                switchMap((res: any) => {
                                    const newToken = res.session.access_token;
                                    const retryReq = req.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${newToken}`
                                        }
                                    });
                                    return next(retryReq);
                                }),
                                catchError((refreshError) => {
                                    // Refresh failed, logout
                                    authService.logout();
                                    return throwError(() => refreshError);
                                })
                            );
                        }
                        return throwError(() => error);
                    })
                );
            }
        } catch (e) {
            console.error('Error parsing session', e);
        }
    }
    return next(req);
};
