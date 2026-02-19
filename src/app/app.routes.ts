import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'customer-profile',
    loadComponent: () => import('./components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent)
  },
  {
    path: 'fee-management',
    loadComponent: () => import('./components/fee-management/fee-management.component').then(m => m.FeeManagementComponent)
  }
];
