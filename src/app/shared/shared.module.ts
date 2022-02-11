import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { CommonExportsModule } from '../common-exports.module';


@NgModule({
  declarations: [
    SideMenuComponent,
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    CommonExportsModule
  ],
  exports: [
    SideMenuComponent,
    ImageUploadComponent
  ]
})
export class SharedModule { }
