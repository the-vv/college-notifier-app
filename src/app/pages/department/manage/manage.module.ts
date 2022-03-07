import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { DepartmentManagePage } from './manage.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { AvatarModule } from 'primeng/avatar';
import {AutoCompleteModule} from 'primeng/autocomplete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CommonExportsModule,
    ReactiveFormsModule,
    AvatarModule,
    AutoCompleteModule
  ],
  declarations: [DepartmentManagePage]
})
export class ManagePageModule {}
