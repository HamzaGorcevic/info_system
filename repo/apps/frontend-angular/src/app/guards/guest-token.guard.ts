import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestTokenGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = sessionStorage.getItem('servicer_token');

    if (token) {
        return true;
    }


    const urlToken = route.paramMap.get('token');
    if (urlToken) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
