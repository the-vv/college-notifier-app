/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { INotification, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.scss'],
})
export class NotificationViewComponent implements OnInit {

  @Input() public notification: INotification;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  dissmiss() {
    this.modalCtrl.dismiss();
  }

  getCreatedByUser(notification: INotification) {
    return `${(notification.createdBy as IUser).name} | ${EStrings[(notification.createdBy as IUser).role]}`;
  }

  hasEditPermission(notification: INotification) {
    return this.authService.currentUser$.value.role === EUserRoles.admin
      || this.authService.currentUser$.value._id === notification.createdBy;
  }

}
