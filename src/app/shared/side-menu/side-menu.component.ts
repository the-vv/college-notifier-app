/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { IUser } from 'src/app/interfaces/common.model';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit, OnDestroy {

  public eUserRoles = EUserRoles;
  public isAdmin = false;
  public isSuperAdmin = false;
  public userIsActive = false;
  private subs = new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router,
    private commonService: CommonService,
    private collegeService: CollegeService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.setupMenu();
    this.userIsActive = this.configService.currentUsermap?.active;
    this.setupMenu();
  }



  setupMenu() {
    this.subs.add(
      this.collegeService.currentCollege$.subscribe(res => {
        this.isSuperAdmin = [EUserRoles.superAdmin].includes(this.authService.currentUser$.value?.role);
        console.log('isSuperAdmin', this.isSuperAdmin);
        console.log(this.authService.currentUser$.value?.role);
        if (res && res.status === ERequestStatus.active) {
          this.isAdmin = [EUserRoles.admin].includes(this.authService.currentUser$.value?.role) ? true : false;
          if (!this.isAdmin) {
            const currentUser = this.authService.currentUser$.value;
            const collegeAdmins = (res.admins as string[]);
            if (collegeAdmins.includes(currentUser._id)) {
              this.isAdmin = true;
            }
          }
        } else {
          this.isAdmin = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  goToHome() {
    if (this.router.url.includes('/dashboard')) {
      return;
    }
    this.commonService.goToDashboard();
  }

  goToReports() {
    if (this.router.url.includes('/reports')) {
      return;
    }
    this.router.navigate(['/', 'reports']);
  }

  goToSettings() {
    if (this.router.url.endsWith('/settings')) {
      return;
    }
    this.router.navigate(['/', 'settings']);
  }

  goToCalendar() {
    if (this.router.url.endsWith('/calendar')) {
      return;
    }
    this.router.navigate(['/', 'calendar']);
  }

}
