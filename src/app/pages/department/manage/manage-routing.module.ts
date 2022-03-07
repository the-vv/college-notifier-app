import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: DepartmentManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
