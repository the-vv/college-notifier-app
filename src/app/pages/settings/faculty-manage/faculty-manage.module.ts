import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacultyManagePageRoutingModule } from './faculty-manage-routing.module';

import { FacultyManagePage } from './faculty-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacultyManagePageRoutingModule
  ],
  declarations: [FacultyManagePage]
})
export class FacultyManagePageModule {}
