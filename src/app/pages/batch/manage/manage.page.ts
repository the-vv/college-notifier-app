import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, ESegmentViews, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IDepartment, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { BatchService } from 'src/app/services/batch.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-batch-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class BatchManagePage implements OnInit, OnDestroy {

  public isUpdate = false;
  public batchId: string;
  public availableFaculties: IUser[] = [];
  public selectedAdmins: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public availableDpts: IDepartment[] = [];
  public showErrors = false;
  public batchForm: FormGroup;
  public loading = false;
  public currentSource: ISource;
  public segmentValue: ESegmentViews = ESegmentViews.home;
  public departmentControl = new FormControl('', [Validators.required]);
  public showEdit = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private batchService: BatchService,
    private userService: UserService,
    private collegeService: CollegeService,
    private config: ConfigService
  ) { }

  get f() { return this.batchForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.batchForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      image: [''],
      admins: [[], [Validators.required]],
    });
  }

  async ionViewWillEnter() {
    this.batchId = this.activatedRoute.snapshot.params.id;
    this.segmentValue = ESegmentViews.edit;
    if (this.batchId) {
      this.isUpdate = true;
      this.segmentValue = ESegmentViews.home;
      const loading = await this.commonService.showLoading();
      this.batchService.getByIdAsync(this.batchId).subscribe((res: IBatch) => {
        loading.dismiss();
        this.batchForm.patchValue({
          startDate: res.startDate,
          endDate: res.endDate,
          image: res.image,
          admins: (res.admins as IUser[])?.map((val: IUser) => val._id)
        });
        this.currentSource = {
          college: this.collegeService.currentCollege$.value,
          department: res.source.department,
          batch: res,
          source: ESourceTargetType.batch
        };
      }, err => {
        loading.dismiss();
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    if(this.config.currentUsermap || this.config.isAdmin) {
      const batchAdmins = (this.config.currentUsermap?.source.batch as IBatch)?.admins as string[];
      if(batchAdmins?.includes((this.config.currentUsermap?.user as IUser)?._id) || this.config.isAdmin) {
        this.showEdit = true;
      }
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
  }

  onChangeSegment(event: any) {
    this.segmentValue = event.detail.value;
  }

  onSubmit() {
    console.log(this.batchForm.value);
    this.showErrors = true;
    this.batchForm.markAllAsTouched();
    if (this.batchForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const batch = this.batchForm.value as IBatch;
    this.loading = true;
    if (this.isUpdate) {
      batch._id = this.batchId;
      this.batchService.putAsync(batch).subscribe((res: IBatch) => {
        this.loading = false;
        this.router.navigate(['/batch/list'], { replaceUrl: true });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    else {
      batch.active = true;
      batch.source = {
        college: this.collegeService.currentCollege$.value._id,
        department: this.departmentControl.value?._id,
        source: ESourceTargetType.department,
      };
      this.batchService.postAsync(batch).subscribe((res: IBatch) => {
        this.loading = false;
        this.router.navigate(['/batch/list'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
  }

  onChooseDate(date: string, control: string) {
    this.batchForm.get(control).setValue(new Date(date).getFullYear());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
