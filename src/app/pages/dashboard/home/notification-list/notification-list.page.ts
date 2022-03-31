/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ESourceTargetType } from 'src/app/interfaces/common.enum';
import { ISource } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { NotificationListComponent } from 'src/app/shared/notification-list/notification-list.component';

@Component({
  selector: 'app-notification-list-home',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage implements OnInit, OnDestroy {

  @ViewChild('notifList') public notifLister: NotificationListComponent;
  public loading = true;
  public currentSource: ISource = {
    source: ESourceTargetType.college
  };
  private subs: Subscription = new Subscription();
  private notifsLoaded = false;

  constructor(
    private router: Router,
    private collegeServoce: CollegeService,
  ) { }

  ngOnInit() {
    this.currentSource.college = this.collegeServoce.currentCollege$.value._id;
    this.subs.add(this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && (event.url) === '/dashboard/notifications') {
        this.notifLister.getNotifications();
        this.notifsLoaded = true;
      }
    }));
  }

  ionViewWillEnter() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
