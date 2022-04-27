import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeTablePageRoutingModule } from './time-table-routing.module';

import { TimeTablePage } from './time-table.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeTablePageRoutingModule,
    CommonExportsModule,
    SharedModule,
    TableModule
  ],
  declarations: [TimeTablePage]
})
export class TimeTablePageModule {}
