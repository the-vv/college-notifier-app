import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { DepartmentManagePage } from './manage.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { AvatarModule } from 'primeng/avatar';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListboxModule } from 'primeng/listbox';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CommonExportsModule,
    ReactiveFormsModule,
    AvatarModule,
    IonicSelectableModule,
    SharedModule,
    ListboxModule
  ],
  declarations: [DepartmentManagePage]
})
export class ManagePageModule { }
