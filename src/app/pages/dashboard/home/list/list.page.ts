import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ERequestStatus } from 'src/app/interfaces/common.enum';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class DashboardListPage implements OnInit {

  constructor(
    private collegeService: CollegeService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    const loader = await this.commonService.showLoading();
    this.collegeService.getByAdminIdAsync(this.authService.currentUser$.value._id)
      .subscribe(res => {
        loader.dismiss();
        console.log(res)
        if (res) {
          if (res.status === ERequestStatus.pending) {
            this.commonService.showSuccessPage(`${EStrings.college} ${EStrings.requested}`, EStrings.collegeRequestedText);
          }
        } else {
          this.router.navigate(['/', 'auth', 'signup', 'create-college'], {replaceUrl: true});
        }
      }, err => {
        loader.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
        this.router.navigate(['/', 'auth', 'signup', 'create-college'], {replaceUrl: true});
      });
  }

}
