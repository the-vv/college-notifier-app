import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { NotificationManagePage } from './manage.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CommonExportsModule,
    SharedModule
  ],
  declarations: [NotificationManagePage]
})
export class ManagePageModule {}
