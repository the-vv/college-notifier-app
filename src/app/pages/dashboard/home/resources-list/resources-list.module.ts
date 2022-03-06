import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcesListPageRoutingModule } from './resources-list-routing.module';

import { ResourcesListPage } from './resources-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourcesListPageRoutingModule
  ],
  declarations: [ResourcesListPage]
})
export class ResourcesListPageModule {}
