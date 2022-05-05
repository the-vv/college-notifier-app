import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessRequestPageRoutingModule } from './access-request-routing.module';

import { AccessRequestPage } from './access-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessRequestPageRoutingModule
  ],
  declarations: [AccessRequestPage]
})
export class AccessRequestPageModule {}
