import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule {}
