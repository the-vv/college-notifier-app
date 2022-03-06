import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'list', loadChildren: () => import('./list/list.module').then( m => m.ListPageModule) },
  {
    path: 'manage/:id',
    loadChildren: () => import('./manage/manage.module').then( m => m.ManagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeRoutingModule { }
