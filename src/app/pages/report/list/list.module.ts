import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ReportListPage } from './list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    CommonExportsModule,
  ],
  declarations: [ReportListPage]
})
export class ListPageModule {}
