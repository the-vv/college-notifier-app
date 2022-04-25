import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { TableModule } from 'primeng/table';
import { DragulaModule, DragulaService } from 'ng2-dragula';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    CommonExportsModule,
    SharedModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    TableModule,
    DragulaModule
  ],
  declarations: [CreatePage],
  providers: [
    DragulaService
  ]
})
export class CreatePageModule {}
