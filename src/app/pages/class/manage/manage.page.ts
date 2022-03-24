import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, ESegmentViews, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, IDepartment, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { BatchService } from 'src/app/services/batch.service';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-class-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ClassManagePage implements OnInit {

  public isUpdate = false;
  public classId: string;
  public availableFaculties: IUser[] = [];
  public selectedAdmins: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public availableDpts: IDepartment[] = [];
  public availablebatches: IBatch[] = [];
  public showErrors = false;
  public classForm: FormGroup;
  public loading = false;
  public departmentControl = new FormControl(null, [Validators.required]);
  public batchControl = new FormControl(null, [Validators.required]);
  public currentSource: ISource;
  public segmentValue: ESegmentViews = ESegmentViews.home;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private batchService: BatchService,
    private classService: ClassService,
    private userService: UserService,
    private collegeService: CollegeService
  ) { }

  get f() { return this.classForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.classForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: [''],
      admins: [[], [Validators.required]],
    });
  }

  async ionViewWillEnter() {
    this.classId = this.activatedRoute.snapshot.params.id;
    this.segmentValue = ESegmentViews.edit;
    if (this.classId) {
      this.segmentValue = ESegmentViews.home;
      const loading = await this.commonService.showLoading();
      this.isUpdate = true;
      this.classService.getByIdAsync(this.classId).subscribe((res: IClass) => {
        loading.dismiss();
        this.classForm.patchValue({
          name: res.name,
          description: res.description,
          image: res.image,
          admins: (res.admins as IUser[])?.map((val: IUser) => val._id),
        });
        this.currentSource = {
          college: this.collegeService.currentCollege$.value,
          department: res.source.department,
          batch: res.source.batch,
          class: res,
          source: ESourceTargetType.class
        };
      }, err => {
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    }
    this.userService.getBySourceAsync(ESourceTargetType.college, this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.availableFaculties = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id)
      .subscribe((res: IDepartment[]) => {
        this.availableDpts = res;
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    this.subs.add(
      this.departmentControl.valueChanges.subscribe((val: IDepartment) => {
        this.batchControl.reset();
        if (val) {
          this.getBatchesByDepartment(val);
        }
      })
    );
  }

  onChangeSegment(event: any) {
    this.segmentValue = event.detail.value;
  }

  async getBatchesByDepartment(department: IDepartment) {
    const loading = await this.commonService.showLoading();
    this.batchService.getByDepartmentAsync(department._id, this.collegeService.currentCollege$.value._id)
      .subscribe((res: IBatch[]) => {
        this.availablebatches = res?.map((val: IBatch) => ({ ...val, title: `${val.startDate} - ${val.endDate}` }));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onSubmit() {
    console.log(this.classForm.value);
    this.showErrors = true;
    this.classForm.markAllAsTouched();
    if (this.classForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const classData = this.classForm.value as IClass;
    this.loading = true;
    if (this.isUpdate) {
      classData._id = this.classId;
      this.classService.putAsync(classData).subscribe((res: IClass) => {
        this.loading = false;
        this.router.navigate(['/class/list'], { replaceUrl: true });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    else {
      classData.active = true;
      classData.source = {
        college: this.collegeService.currentCollege$.value._id,
        department: this.departmentControl.value?._id,
        batch: this.batchControl.value?._id,
        source: ESourceTargetType.batch,
      };
      this.classService.postAsync(classData).subscribe((res: IClass) => {
        this.loading = false;
        this.router.navigate(['/class/list'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
  }

  onChooseDate(date: string, control: string) {
    this.classForm.get(control).setValue(new Date(date).getFullYear());
  }

  ionViewWillLeave(): void {
    this.subs.unsubscribe();
  }


}
