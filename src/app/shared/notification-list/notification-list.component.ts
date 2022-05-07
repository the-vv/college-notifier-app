/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EBreakPoints, ENotificationType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, IDepartment, INotification, IRoom, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationViewComponent } from '../notification-view/notification-view.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit, OnChanges, OnDestroy {

  public sourceData: ISource;
  @Input() set source(val: ISource) {
    if (!val || !val?.college) { return; }
    this.sourceData = JSON.parse(JSON.stringify(val));
    switch (val.source) {
      case ESourceTargetType.batch:
        this.sourceData.department = undefined;
        break;
      case ESourceTargetType.class:
        this.sourceData.department = undefined;
        this.sourceData.batch = undefined;
        break;
      case ESourceTargetType.room:
        this.sourceData.department = undefined;
        this.sourceData.batch = undefined;
        this.sourceData.class = undefined;
        break;
    }
  }
  @Input() public compact = false;
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
    private alertController: AlertController,
    private collegeService: CollegeService
  ) {
  }

  getNotifications() {
    return new Promise<void>((resolve, reject) => {
      if (!this.sourceData?.college) {
        return;
      }
      const postSource: ISource = {
        college: this.collegeService.currentCollege$.value._id,
        department: (this.sourceData.department as IDepartment)?._id,
        batch: (this.sourceData.batch as IBatch)?._id,
        class: (this.sourceData.class as IClass)?._id,
        room: (this.sourceData.room as IRoom)?._id,
        source: this.sourceData.source,
      };
      this.loading = true;
      this.notificationService.getBySourceAndUserAsync(postSource).subscribe(res => {
        this.allNotifications = res;
        this.loading = false;
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
            this.notificationService.deleteAsync(notification._id).subscribe(() => {
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

  public checkIsFutureTime(isoDate: string) {
    return new Date(isoDate).getTime() > new Date().getTime();
  }

}
