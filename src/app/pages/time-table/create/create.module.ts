import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    CommonExportsModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [CreatePage]
})
export class CreatePageModule {}