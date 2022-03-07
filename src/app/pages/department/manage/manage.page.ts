import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { IDepartment } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class DepartmentManagePage implements OnInit {

  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public dptForm: FormGroup;
  public loading = false;
  private subs: Subscription = new Subscription();
  public isUpdate: boolean = false;
  public dptId: string;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService
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
    });
  }

  ionViewWillEnter() {
    this.dptId = this.activatedRoute.snapshot.params.id;
    if (this.dptId) {
      this.isUpdate = true;
    }
  }

  onSubmit() {
    this.showErrors = true;
    this.dptForm.markAllAsTouched();
    if (this.dptForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const department = this.dptForm.value as IDepartment;
    console.log(department);
    this.loading = true;
    if (this.isUpdate) {
      department._id = this.dptId;
      this.departmentService.putAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;        
        this.router.navigate(['/department/list']);
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
    else {
      department.admins = [this.authService.currentUser$.value._id];
      department.active = true;
      this.departmentService.postAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;        
        this.router.navigate(['/department/list']);
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
