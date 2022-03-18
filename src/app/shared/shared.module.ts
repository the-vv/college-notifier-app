import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { CommonExportsModule } from '../common-exports.module';
import { IonicModule } from '@ionic/angular';
import { UsersImportComponent } from './users-import/users-import.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { QuillModule } from 'ngx-quill';
import { NotificationViewComponent } from './notification-view/notification-view.component';


@NgModule({
  declarations: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent
  ],
  imports: [
    CommonModule,
    CommonExportsModule,
    IonicModule,
    QuillModule.forRoot()
  ],
  exports: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
