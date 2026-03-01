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
import { guestTokenGuard } from './guards/guest-token.guard';
import { VerificationPendingComponent } from './features/auth/verification-pending/verification-pending.component';
import { CreateAnnouncementComponent } from './features/admin/events-messages/create-announcement.component';
import { AnnouncementsListComponent } from './features/tenant/events-messages/announcements-list.component';
import { AnnouncementsBuildingListComponent } from './features/admin/events-messages/announcements-building-list.component';

import { TenantSuggestionsComponent } from './features/tenant/suggestions/tenant-suggestions.component';
import { SuggestionsBuildingListComponent } from './features/admin/suggestions/suggestions-building-list.component';
import { ManagerSuggestionsComponent } from './features/admin/suggestions/manager-suggestions.component';
import { TenantLayoutComponent } from './layout/tenant-layout/tenant-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AnalyticsDashboardComponent } from './features/admin/analytics/analytics-dashboard.component';
import { AdminDocumentsComponent } from './features/admin/documents/admin-documents.component';
import { TenantDocumentsComponent } from './features/tenant/documents/tenant-documents.component';
import { TenantStatsComponent } from './features/tenant/stats/tenant-stats.component';
import { TenantExpensesComponent } from './features/tenant/expenses/tenant-expenses.component';
import { AdminExpensesComponent } from './features/admin/expenses/admin-expenses.component';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'verification-pending',
        component: VerificationPendingComponent
    },
    {
        path: 'admin/register',
        component: AdminRegister,
        canActivate: [guestGuard]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [roleGuard(['manager'])],
        children: [
            {
                path: '',
                redirectTo: 'admin/analytics',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'admin/qr',
                component: BuildingQR
            },
            {
                path: 'admin/tenants',
                component: TenantManagement
            },
            {
                path: 'admin/servicers',
                component: ServicerManagementComponent
            },
            {
                path: 'admin/tokens',
                component: AccessTokensComponent
            },
            {
                path: 'admin/malfunctions',
                component: AdminMalfunctionListComponent
            },
            {
                path: 'admin/announcements',
                component: AnnouncementsBuildingListComponent
            },
            {
                path: 'admin/announcements/:buildingId',
                component: CreateAnnouncementComponent
            },
            {
                path: 'admin/suggestions',
                component: SuggestionsBuildingListComponent
            },
            {
                path: 'admin/suggestions/:buildingId',
                component: ManagerSuggestionsComponent
            },
            {
                path: 'admin/analytics',
                component: AnalyticsDashboardComponent
            },
            {
                path: 'admin/documents',
                component: AdminDocumentsComponent
            },
            {
                path: 'admin/expenses',
                component: AdminExpensesComponent
            }
        ]
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
        path: 'tenant',
        component: TenantLayoutComponent,
        canActivate: [roleGuard(['tenant'])],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: TenantDashboard
            },
            {
                path: 'malfunctions',
                component: MalfunctionListComponent
            },
            {
                path: 'malfunctions/report',
                component: ReportMalfunctionComponent
            },
            {
                path: 'announcements',
                component: AnnouncementsListComponent
            },
            {
                path: 'suggestions',
                component: TenantSuggestionsComponent
            },
            {
                path: 'documents',
                component: TenantDocumentsComponent
            },
            {
                path: 'stats',
                component: TenantStatsComponent
            },
            {
                path: 'expenses',
                component: TenantExpensesComponent
            },

        ]
    },
    {
        path: 'servicer/access',
        component: ServicerAccessComponent,
        canActivate: [guestTokenGuard]
    },
    {
        path: 'servicer/access/:token',
        component: ServicerAccessComponent,
        canActivate: [guestTokenGuard]
    },
    {
        path: '',
        redirectTo: 'admin/analytics',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'admin/analytics'
    }
];
