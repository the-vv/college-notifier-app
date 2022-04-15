import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionsListPageRoutingModule } from './submissions-list-routing.module';

import { SubmissionsListPage } from './submissions-list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmissionsListPageRoutingModule,
    CommonExportsModule,
    SharedModule,
    TableModule
  ],
  declarations: [SubmissionsListPage]
})
export class SubmissionsListPageModule {}
