import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerPageModule) },
  { path: ':scheduleType/:id', loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerPageModule) },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
