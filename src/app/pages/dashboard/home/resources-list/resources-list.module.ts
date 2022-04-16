import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcesListPageRoutingModule } from './resources-list-routing.module';

import { ResourcesListPage } from './resources-list.page';
import { TableModule } from 'primeng/table';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourcesListPageRoutingModule,
    TableModule,
    CommonExportsModule,
    SharedModule
  ],
  declarations: [ResourcesListPage]
})
export class ResourcesListPageModule {}
