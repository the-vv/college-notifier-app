import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IDepartment, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class DepartmentManagePage implements OnInit, OnDestroy {

  public isUpdate = false;
  public dptId: string;
  public availableFaculties: IUser[] = [];
  public selectedAdmins: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public dptForm: FormGroup;
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private userService: UserService,
    private collegeService: CollegeService
  ) { }

  get f() { return this.dptForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.dptForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: [''],
      admins: [[], [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.dptId = this.activatedRoute.snapshot.params.id;
    if (this.dptId) {
      this.isUpdate = true;
    }
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.availableFaculties = res?.map((val: IUser) => ({...val, userName: `${val.name} (${val.email})`}));
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onSubmit() {
    console.log(this.dptForm.value);
    this.showErrors = true;
    this.dptForm.markAllAsTouched();
    if (this.dptForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const department = this.dptForm.value as IDepartment;
    this.loading = true;
    if (this.isUpdate) {
      department._id = this.dptId;
      this.departmentService.putAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;
        this.router.navigate(['/department/list'], { replaceUrl: true });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    else {
      department.active = true;
      department.source = {
        college: this.collegeService.currentCollege$.value._id,
        source: ESourceTargetType.college
      };
      this.departmentService.postAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;
        this.router.navigate(['/department/list'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
