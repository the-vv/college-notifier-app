import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';

import { ReportPage } from './report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    SharedModule,
    CommonExportsModule,
    TableModule
  ],
  declarations: [ReportPage]
})
export class ReportPageModule {}
