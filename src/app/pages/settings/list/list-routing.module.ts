import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule {}
