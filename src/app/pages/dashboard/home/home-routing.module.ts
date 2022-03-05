import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('src/app/pages/admin/admin.module').then( m => m.AdminModule)
      },
      {
        path: 'college', loadChildren: () => import('src/app/pages/college/college.module').then(m => m.CollegeModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
