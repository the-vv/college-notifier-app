import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'time-table',
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notification-list/notification-list.module').then(m => m.NotificationListPageModule)
      },
      {
        path: 'resources',
        loadChildren: () => import('./resources-list/resources-list.module').then( m => m.ResourcesListPageModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms-list/forms-list.module').then( m => m.FormsListPageModule)
      },
      {
        path: 'time-table',
        loadChildren: () => import('./time-table/time-table.module').then( m => m.TimeTablePageModule)
      },
      {
        path: 'rooms',
        loadChildren: () => import('./rooms-list/rooms-list.module').then( m => m.RoomsListPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
