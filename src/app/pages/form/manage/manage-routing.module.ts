import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: FormManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
