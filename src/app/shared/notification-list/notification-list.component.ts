/* eslint-disable no-underscore-dangle */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ENotificationType, EUserRoles } from 'src/app/interfaces/common.enum';
import { INotification, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit, OnChanges {

  @Input() public source: ISource;
  public allNotifications: INotification[] = [];
  public loading = true;
  public eNotificationType = ENotificationType;

  constructor(
    private notificationService: NotificationService,
    private commonService: CommonService,
    private authService: AuthService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getNotifications();
  }

  ngOnInit() {
  }

  getNotifications() {
    this.loading = true;
    this.notificationService.getBySourceAndUserAsync(this.source).subscribe(res => {
      this.allNotifications = res;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.commonService.showToast(err.error.message);
    });
  }



  getStringFromHtml(html: string) {
    return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
  }

  getCreatedByUser(notification: INotification) {
    return `${(notification.createdBy as IUser).name} | ${EStrings[(notification.createdBy as IUser).role]}`;
  }

  hasEditPermission(notification: INotification) {
    return this.authService.currentUser$.value.role === EUserRoles.admin
      || this.authService.currentUser$.value._id === notification.createdBy;
  }

}
