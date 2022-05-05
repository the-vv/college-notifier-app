import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints, ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { Toast } from '@capacitor/toast';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public loginForm: FormGroup;
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private collegeService: CollegeService
  ) { }

  get f() { return this.loginForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    this.showErrors = true;
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    this.showErrors = false;
    this.loading = true;
    this.authService.loginAsync(this.f.email.value, this.f.password.value)
      .subscribe(res => {
        this.loading = false;
        if (res.user && res.token) {
          // console.log(res);
          this.loading = false;
          this.authService.onLogin(res);
          if (this.authService.currentUser$?.value?.role === EUserRoles.admin) {
            /* eslint no-underscore-dangle: 0 */
            this.collegeService.getByAdminIdAsync(this.authService.currentUser$.value._id)
              .subscribe(collegeRes => {
                this.collegeService.saveCollege(collegeRes);
                if (collegeRes) {
                  if (collegeRes.status === ERequestStatus.pending) {
                    this.commonService.showSuccessPage(`${EStrings.college} ${EStrings.requested}`, EStrings.collegeRequestedText);
                  }
                  else {
                    this.commonService.goToDashboard();
                  }
                } else {
                  this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
                }
              }, err => {
                this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
                this.router.navigate(['/', 'auth', 'signup', 'create-college'], { replaceUrl: true });
              });
          }
          else if (this.authService.currentUser$?.value?.role === EUserRoles.faculty) {
            this.authService.doUserLogin(this.authService.currentUser$?.value._id);
          }
        }
      }, err => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ': ', err.error?.message].join(' '),
        });
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
