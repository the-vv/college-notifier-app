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
  {
    path: 'view/:id',
    loadChildren: () => import('./renderer/renderer.module').then( m => m.RendererPageModule)
  },
  {
    path: 'submission/:id',
    loadChildren: () => import('./renderer/renderer.module').then( m => m.RendererPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'submissions/:id',
    loadChildren: () => import('./submissions-list/submissions-list.module').then( m => m.SubmissionsListPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
