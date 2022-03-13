import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacultyManagePage } from './faculty-manage.page';

const routes: Routes = [
  {
    path: '',
    component: FacultyManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacultyManagePageRoutingModule {}
