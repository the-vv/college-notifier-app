import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsListPageRoutingModule } from './forms-list-routing.module';

import { FormsListPage } from './forms-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsListPageRoutingModule
  ],
  declarations: [FormsListPage]
})
export class FormsListPageModule {}
