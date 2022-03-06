import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsListPageRoutingModule } from './rooms-list-routing.module';

import { RoomsListPage } from './rooms-list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomsListPageRoutingModule,
    CommonExportsModule
  ],
  declarations: [RoomsListPage]
})
export class RoomsListPageModule {}
