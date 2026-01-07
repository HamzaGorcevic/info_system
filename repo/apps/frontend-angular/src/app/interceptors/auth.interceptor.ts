import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip auth for servicer public endpoints
    const publicEndpoints = ['/servicers/verify-token', '/servicers/update-status'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint) {
        return next(req);
    }

    const sessionStr = localStorage.getItem('sb-session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            const token = session.access_token;
            if (token) {
                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next(authReq);
            }
        } catch (e) {
            console.error('Error parsing session', e);
        }
    }
    return next(req);
};
