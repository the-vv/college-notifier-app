import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RendererPageRoutingModule } from './renderer-routing.module';

import { RendererPage } from './renderer.page';
import { CommonExportsModule } from 'src/app/common-exports.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RendererPageRoutingModule,
    CommonExportsModule
  ],
  declarations: [RendererPage]
})
export class RendererPageModule {}
