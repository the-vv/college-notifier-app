import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from '../auth.service';
import { CollegeService } from '../college.service';
import { CommonService } from '../common.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class MainResolverService {

  constructor(
    private authService: AuthService,
    private collegeService: CollegeService,
    private router: Router,
    private commonService: CommonService,
    private config: ConfigService
  ) { }

  //TODO: add user verification with user id

  init() {
    return new Promise((resolve, reject) => {
      this.authService.initAuth().then(async () => {
        if (!this.authService.currentUser$.value) {
          this.router.navigate(['/', 'auth', 'login'], { replaceUrl: true });
          return resolve(true);
        }
        else if (this.authService.currentUser$?.value?.role === EUserRoles.admin) {
          /* eslint no-underscore-dangle: 0 */
          this.collegeService.getByAdminIdAsync(this.authService.currentUser$.value._id)
            .subscribe(res => {
              this.config.isAdmin = true;
              this.collegeService.saveCollege(res);
              if (res) {
                if (res.status === ERequestStatus.pending) {
                  this.commonService.showSuccessPage(`${EStrings.college} ${EStrings.requested}`, EStrings.collegeRequestedText);
                }
              } else {
                this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
              }
              resolve(true);
            }, err => {
              resolve(true);
              this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
              this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
            });
        } else if (this.authService.currentUser$?.value?.role === EUserRoles.superAdmin) {
          this.commonService.goToDashboard();
          resolve(true);
        } else {
          console.log('calling user login');
          this.authService.doUserLogin(this.authService.currentUser$?.value._id)
            .then(() => {
              resolve(true);
            })
            .catch(err => {
              this.router.navigate(['/'], { replaceUrl: true });
              resolve(true);
            });
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}
