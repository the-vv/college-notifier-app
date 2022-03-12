import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { BatchManagePage } from './manage.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CommonExportsModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [BatchManagePage]
})
export class ManagePageModule { }
