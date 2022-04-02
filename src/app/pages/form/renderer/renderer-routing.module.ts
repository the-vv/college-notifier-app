import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendererPage } from './renderer.page';

const routes: Routes = [
  {
    path: '',
    component: RendererPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RendererPageRoutingModule {}
