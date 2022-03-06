import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints } from 'src/app/interfaces/common.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { Toast } from '@capacitor/toast';
import { EStrings } from 'src/app/interfaces/strings.enum';

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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  get f() { return this.loginForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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
          this.router.navigate(['/dashboard'], { replaceUrl: true });
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
