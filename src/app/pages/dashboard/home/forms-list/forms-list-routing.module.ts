import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsListPage } from './forms-list.page';

const routes: Routes = [
  {
    path: '',
    component: FormsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsListPageRoutingModule {}
