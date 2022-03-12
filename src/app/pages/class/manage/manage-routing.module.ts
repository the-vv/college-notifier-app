import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: ClassManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
