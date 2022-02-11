import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints, EUserRoles } from 'src/app/interfaces/commons-enum';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;
  public userForm: FormGroup;
  private subs: Subscription = new Subscription();
  private currentRole: EUserRoles;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public get f() { return this.userForm?.controls; }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.currentRole = this.route.snapshot.params.role;
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cPassword: ['', [Validators.required, this.confirmPassword()]],
      role: [this.currentRole],
      active: [true],
      image: [''],
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    console.log('onSubmit');
    console.log(this.currentRole);
    if (this.currentRole === EUserRoles.admin) {
      this.router.navigate(['/', 'auth', 'signup', 'create-college']);
    }
  }

  confirmPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.f?.password.value ? null : { confirm: true };
  }

}
