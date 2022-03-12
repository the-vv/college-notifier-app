import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { ICollege } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public currentCollege: ICollege;
  public loading = true;
  private subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService,
    private collegeService: CollegeService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    if (this.authService.currentUserRole === EUserRoles.admin) {
      const collegeSubscription = this.collegeService.currentCollege$
        .pipe(take(1))
        .subscribe(res => {
          this.loading = false;
          console.log(res);
          if (res) {
            if (res.status === ERequestStatus.pending) {
              this.commonService.showSuccessPage(`${EStrings.college} ${EStrings.requested}`, EStrings.collegeRequestedText);
            } else {
              this.currentCollege = res;
            }
          } else {
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
    }
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }


}
