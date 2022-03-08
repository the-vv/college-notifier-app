import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacultyListPage } from './faculty-list.page';

const routes: Routes = [
  {
    path: '',
    component: FacultyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacultyListPageRoutingModule {}
