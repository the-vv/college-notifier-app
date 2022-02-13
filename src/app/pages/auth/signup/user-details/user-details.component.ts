import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, EUserRoles } from 'src/app/interfaces/commons-enum';
import { EStrings } from 'src/app/interfaces/strings';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;
  public userForm: FormGroup;
  public showErrors = false;
  public currentRole: EUserRoles;
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private collegeService: CollegeService
  ) {
    this.subs.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          if (user.role === EUserRoles.admin) {
            this.subs.add(
              this.collegeService.currentCollege$.subscribe(college => {
                if (college) {
                  this.router.navigate(['/dashboard']);
                } else {
                  this.router.navigate(['/auth/signup', 'create-college']);
                }
              })
            );
          }
          if (user.role === EUserRoles.faculty) {
            console.log('faculty');
          }
        }
      })
    );
  }

  public get f() { return this.userForm?.controls; }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.currentRole = this.route.snapshot.params.role;
    if (Object.keys(EUserRoles).includes(this.currentRole)) {
      this.router.navigate(['/auth/signup', this.currentRole]);
    }
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cPassword: ['', [Validators.required, this.confirmPassword()]],
      role: [this.currentRole],
      active: [true],
      image: [''],
    });
    this.userForm.get('password').valueChanges.subscribe(() => {
      this.userForm.get('cPassword').updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.showErrors = true;
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.signupAsync({ ...this.userForm.value, cPassword: undefined })
      .subscribe((user) => {
        if (user) {
          console.log(user);
          this.loading = false;
          this.authService.onLogin(user);
          this.navigateByRole(this.currentRole);
        }
      }, err => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error?.message].join(' '),
        });
      });
  }

  confirmPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.f?.password.value ? null : { confirm: true };
  }

  navigateByRole(role: EUserRoles) {
    switch (role) {
      case EUserRoles.admin:
        this.router.navigate(['/auth/signup', 'create-college']);
        break;
      case EUserRoles.faculty:
        this.router.navigate(['/auth/signup', 'join-college']);
        break;
      case EUserRoles.student:
        this.router.navigate(['/auth/signup', 'join-college']);
        break;
      case EUserRoles.parent:
        this.router.navigate(['/auth/signup', '']);
        break;
    }
  }

}
