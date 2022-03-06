import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollegeManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: CollegeManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
