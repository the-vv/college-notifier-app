import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: StudentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule {}
