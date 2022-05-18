/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { ICollege } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit,  OnDestroy {

  public currentCollege: ICollege;
  public loading = true;
  private subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService,
    private collegeService: CollegeService,
    public config: ConfigService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    if (this.authService.currentUserRole === EUserRoles.admin) {
      const collegeSubscription = this.collegeService.currentCollege$
        .pipe(take(1))
        .subscribe(res => {
          // console.log(res);
          if (res) {
            if (res.status === ERequestStatus.pending) {
              // this.loading = false;
              this.commonService.showSuccessPage(`${EStrings.college} ${EStrings.requested}`, EStrings.collegeRequestedText, false);
            } else {
              this.loading = false;
              this.currentCollege = res;
            }
          } else {
            this.loading = false;
            this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
          }
        }, err => {
          console.log(err);
          this.loading = false;
          this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
          this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
        });
      this.subs.add(collegeSubscription);
    } else if (this.authService.currentUserRole === EUserRoles.superAdmin) {
      this.commonService.goToDashboard();
    } else {
      this.loading = false;
      console.log('calling user login');
      this.authService.doUserLogin(this.authService.currentUser$?.value._id, !this.router.url.includes('dashboard'))
      .then((userMap) => {
        if(!userMap?.active) {
          this.commonService.showSuccessPage(`${EStrings.collegeJoinRequestSemtSuccessFully}`, EStrings.pleaseWaitForApproval, false);
        }
      }).catch(err => {
        console.log(err);
        this.loading = false;
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    }
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }

  ngOnDestroy(): void {
  }


}
