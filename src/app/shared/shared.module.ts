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
import { FormListComponent } from './form-list/form-list.component';
import { ScheduleResourceComponent } from './schedule-resource/schedule-resource.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { AvatarModule } from 'primeng/avatar';
import { TargetViewComponent } from './target-view/target-view.component';


@NgModule({
  declarations: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent,
    UserListComponent,
    FormListComponent,
    ScheduleResourceComponent,
    UserManageComponent,
    TargetViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CommonExportsModule,
    IonicModule,
    QuillModule.forRoot(),
    ListboxModule,
    AvatarModule
  ],
  exports: [
    SideMenuComponent,
    ImageUploadComponent,
    UsersImportComponent,
    FileUploadComponent,
    NotificationListComponent,
    NotificationViewComponent,
    UserListComponent,
    FormListComponent,
    ScheduleResourceComponent,
    UserManageComponent,
    TargetViewComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
