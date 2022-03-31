/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ESourceTargetType } from 'src/app/interfaces/common.enum';
import { ISource } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { FormListComponent } from 'src/app/shared/form-list/form-list.component';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.page.html',
  styleUrls: ['./forms-list.page.scss'],
})
export class FormsListPage implements OnInit, OnDestroy {

  @ViewChild('notifList') public notifLister: FormListComponent;
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
      if (event instanceof NavigationEnd && (event.url) === '/dashboard/forms') {
        this.notifLister.getForms();
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

