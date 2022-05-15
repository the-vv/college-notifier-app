import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessRequestPageRoutingModule } from './access-request-routing.module';

import { AccessRequestPage } from './access-request.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessRequestPageRoutingModule,
    CommonExportsModule,
    SharedModule,
    TableModule
  ],
  declarations: [AccessRequestPage]
})
export class AccessRequestPageModule {}
