import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { FormManagePage } from './manage.page';
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
    SharedModule,
    IonicSelectableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [FormManagePage]
})
export class ManagePageModule {}
