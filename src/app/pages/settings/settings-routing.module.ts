import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'faculty/list',
    loadChildren: () => import('./faculty-list/faculty-list.module').then( m => m.FacultyListPageModule)
  },
  {
    path: 'faculty/manage',
    loadChildren: () => import('./faculty-manage/faculty-manage.module').then( m => m.FacultyManagePageModule)
  },
  {
    path: 'faculty/manage/:id',
    loadChildren: () => import('./faculty-manage/faculty-manage.module').then( m => m.FacultyManagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
