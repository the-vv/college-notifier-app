/* eslint-disable no-underscore-dangle */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EBreakPoints, ENotificationType, EUserRoles } from 'src/app/interfaces/common.enum';
import { INotification, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationViewComponent } from '../notification-view/notification-view.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public source: ISource;
  public allNotifications: INotification[] = [];
  public loading = true;
  public eNotificationType = ENotificationType;
  public currentBreakPoint: EBreakPoints;
  private subs: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private commonService: CommonService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getNotifications();
  }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
  }

  getNotifications() {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.notificationService.getBySourceAndUserAsync(this.source).subscribe(res => {
        this.allNotifications = res;
        this.loading = false;
        // this.openNotification(res[0]);
        resolve();
      }, err => {
        this.loading = false;
        this.commonService.showToast(err.error.message);
        reject();
      });
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

  openNotification(notification: INotification) {
    this.modalCtrl.create({
      component: NotificationViewComponent,
      componentProps: {
        notification,
      },
    }).then(modal => {
      modal.present();
    });
  }

  onEdit(notification: INotification, ev: any) {
    ev.stopPropagation();
    this.router.navigate(['/notification/manage', notification._id]);
  }

  async onDelete(notification: INotification, ev: any) {
    ev.stopPropagation();
    const alert = await this.alertController.create({
      header: EStrings.confirmDelete,
      message: `${EStrings.areYouSureWantToDelete} ${EStrings.notification.toLowerCase()} '${notification.title}'?`,
      buttons: [
        {
          text: EStrings.cancel,
          role: 'cancel',
          id: 'cancel-button',
        }, {
          text: EStrings.delete,
          id: 'confirm-button',
          handler: () => {
            this.notificationService.deleeAsync(notification._id).subscribe(() => {
              this.getNotifications();
            }, err => {
              this.commonService.showToast(err.error.message);
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
