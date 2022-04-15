import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmissionsListPage } from './submissions-list.page';

const routes: Routes = [
  {
    path: '',
    component: SubmissionsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmissionsListPageRoutingModule {}
