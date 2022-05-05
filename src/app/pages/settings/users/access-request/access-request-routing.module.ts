import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessRequestPage } from './access-request.page';

const routes: Routes = [
  {
    path: '',
    component: AccessRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRequestPageRoutingModule {}
