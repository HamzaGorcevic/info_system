import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
