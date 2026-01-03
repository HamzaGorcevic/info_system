import { Routes } from '@angular/router';
import { AdminRegister } from './features/admin/admin-register/admin-register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { BuildingQR } from './features/admin/building-qr/building-qr';
import { TenantManagement } from './features/admin/tenant-management/tenant-management';
import { TenantRegister } from './features/tenant/tenant-register/tenant-register';
import { TenantLogin } from './features/tenant/tenant-login/tenant-login';
import { TenantDashboard } from './features/tenant/tenant-dashboard/tenant-dashboard';
import { MalfunctionListComponent } from './features/tenant/malfunctions/malfunction-list/malfunction-list.component';
import { AdminMalfunctionListComponent } from './features/admin/malfunctions/admin-malfunction-list/admin-malfunction-list.component';
import { ReportMalfunctionComponent } from './features/tenant/malfunctions/report-malfunction/report-malfunction.component';
import { ServicerManagementComponent } from './features/admin/servicers/servicer-management/servicer-management.component';
import { ServicerAccessComponent } from './features/servicer/access/servicer-access.component';
import { AccessTokensComponent } from './features/admin/access-tokens/access-tokens.component';
import { roleGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'admin/register',
        component: AdminRegister,
        canActivate: [guestGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'admin/qr',
        component: BuildingQR,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'admin/tenants',
        component: TenantManagement,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'admin/servicers',
        component: ServicerManagementComponent,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'admin/tokens',
        component: AccessTokensComponent,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'admin/malfunctions',
        component: AdminMalfunctionListComponent,
        canActivate: [roleGuard(['manager'])]
    },
    {
        path: 'tenant/register',
        component: TenantRegister,
        canActivate: [guestGuard]
    },
    {
        path: 'tenant/login',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'tenant/dashboard',
        component: TenantDashboard,
        canActivate: [roleGuard(['tenant'])]
    },
    {
        path: 'tenant/malfunctions',
        component: MalfunctionListComponent,
        canActivate: [roleGuard(['tenant'])]
    },
    {
        path: 'tenant/malfunctions/report',
        component: ReportMalfunctionComponent,
        canActivate: [roleGuard(['tenant'])]
    },
    {
        path: 'servicer/access/:token',
        component: ServicerAccessComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
