import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'manage',
    loadChildren: () => import('./manage/manage.module').then(m => m.ManagePageModule)
  },
  {
    path: 'manage/:id',
    loadChildren: () => import('./manage/manage.module').then(m => m.ManagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
