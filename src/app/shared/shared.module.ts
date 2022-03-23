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
import { UserListComponent } from './user-list/user-list.component';
import { ListboxModule } from 'primeng/listbox';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CommonExportsModule,
    IonicModule,
    QuillModule.forRoot(),
    ListboxModule
  ],
  exports: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent,
    UserListComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
