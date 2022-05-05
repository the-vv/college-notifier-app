import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { CollegeManagePage } from './manage.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import {AvatarModule} from 'primeng/avatar';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CommonExportsModule,
    ReactiveFormsModule,
    AvatarModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [CollegeManagePage]
})
export class ManagePageModule {}
