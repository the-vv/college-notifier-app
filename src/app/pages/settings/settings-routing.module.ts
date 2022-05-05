import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: ':role/list',
    loadChildren: () => import('./student/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'access-request',
    loadChildren: () => import('./users/access-request/access-request.module').then( m => m.AccessRequestPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
