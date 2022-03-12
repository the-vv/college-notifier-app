import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BatchManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: BatchManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
