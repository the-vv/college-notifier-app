import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('src/app/pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'college',
    loadChildren: () => import('./pages/college/college.module').then(m => m.CollegeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/common/success/success.module').then(m => m.SuccessPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/report/list/list.module').then(m => m.ListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'college',
    loadChildren: () => import('src/app/pages/college/college.module').then(m => m.CollegeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'department',
    loadChildren: () => import('src/app/pages/department/department.module').then(m => m.DepartmentModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'batch',
    loadChildren: () => import('src/app/pages/batch/batch.module').then(m => m.BatchModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'class',
    loadChildren: () => import('src/app/pages/class/class.module').then(m => m.ClassModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'room',
    loadChildren: () => import('src/app/pages/room/room.module').then(m => m.RoomModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    loadChildren: () => import('src/app/pages/notification/notification.module').then(m => m.NotificationModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'form',
    loadChildren: () => import('src/app/pages/form/form.module').then(m => m.FormModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'resource',
    loadChildren: () => import('src/app/pages/resource/resource.module').then(m => m.ResourceModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    loadChildren: () => import('src/app/pages/calendar/calendar.module').then(m => m.CalendarModule),
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
