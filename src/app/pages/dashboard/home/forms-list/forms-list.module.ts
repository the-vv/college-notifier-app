import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsListPageRoutingModule } from './forms-list-routing.module';

import { FormsListPage } from './forms-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsListPageRoutingModule,
    SharedModule
  ],
  declarations: [FormsListPage]
})
export class FormsListPageModule {}
