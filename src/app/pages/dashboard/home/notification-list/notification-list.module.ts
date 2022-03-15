import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationListPageRoutingModule } from './notification-list-routing.module';

import { NotificationListPage } from './notification-list.page';
import {SpeedDialModule} from 'primeng/speeddial';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationListPageRoutingModule,
    SpeedDialModule
  ],
  declarations: [NotificationListPage]
})
export class NotificationListPageModule {}
