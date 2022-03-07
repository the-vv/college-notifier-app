import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'department', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('src/app/pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'college', loadChildren: () => import('./pages/college/college.module').then(m => m.CollegeModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/common/success/success.module').then(m => m.SuccessPageModule)
  },
  {
    path: 'college', loadChildren: () => import('src/app/pages/college/college.module').then(m => m.CollegeModule)
  },
  {
    path: 'department', loadChildren: () => import('src/app/pages/department/department.module').then(m => m.DepartmentModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
