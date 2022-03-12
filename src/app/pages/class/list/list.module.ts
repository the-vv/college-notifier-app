import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ClassListPage } from './list.page';
import { TableModule } from 'primeng/table';
import { CommonExportsModule } from 'src/app/common-exports.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    TableModule,
    CommonExportsModule
  ],
  declarations: [ClassListPage]
})
export class ListPageModule {}
