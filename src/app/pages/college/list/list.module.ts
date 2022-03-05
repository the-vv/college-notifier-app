import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { CollegeListPage } from './list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import {TableModule} from 'primeng/table';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    CommonExportsModule,
    TableModule
  ],
  declarations: [CollegeListPage]
})
export class ListPageModule {}
