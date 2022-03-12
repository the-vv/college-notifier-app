import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { BatchListPage } from './list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { TableModule } from 'primeng/table';
import { SlideMenuModule } from 'primeng/slidemenu';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    CommonExportsModule,
    TableModule,
    SlideMenuModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [BatchListPage]
})
export class ListPageModule { }
