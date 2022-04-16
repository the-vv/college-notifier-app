import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceManagePage } from './manage.page';

const routes: Routes = [
  {
    path: '',
    component: ResourceManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
