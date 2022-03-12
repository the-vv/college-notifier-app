import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('src/app/pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'college',
    loadChildren: () => import('./pages/college/college.module').then(m => m.CollegeModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/common/success/success.module').then(m => m.SuccessPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'college',
    loadChildren: () => import('src/app/pages/college/college.module').then(m => m.CollegeModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'department',
    loadChildren: () => import('src/app/pages/department/department.module').then(m => m.DepartmentModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'batch',
    loadChildren: () => import('src/app/pages/batch/batch.module').then(m => m.BatchModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  },
  {
    path: 'class',
    loadChildren: () => import('src/app/pages/class/class.module').then(m => m.ClassModule),
    canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
