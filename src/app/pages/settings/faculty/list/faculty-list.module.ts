import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacultyListPageRoutingModule } from './faculty-list-routing.module';

import { FacultyListPage } from './faculty-list.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacultyListPageRoutingModule,
    CommonExportsModule,
    TableModule
  ],
  declarations: [FacultyListPage]
})
export class FacultyListPageModule {}
