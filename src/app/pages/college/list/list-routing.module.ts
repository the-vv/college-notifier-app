import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollegeListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: CollegeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule {}
