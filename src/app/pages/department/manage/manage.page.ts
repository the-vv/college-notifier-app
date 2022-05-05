import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { IonAccordionGroup } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { EBreakPoints, ESegmentViews, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IDepartment, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';

@Component({
  selector: 'app-department-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class DepartmentManagePage implements OnInit, OnDestroy {

  @ViewChild('modal') public userModal: IonicSelectableComponent;
  @ViewChild(IonAccordionGroup) public accordionGroup: IonAccordionGroup;
  @ViewChild(ImageUploadComponent) public imageUploader: ImageUploadComponent;

  public isUpdate = false;
  public dptId: string;
  public availableFaculties: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public dptForm: FormGroup;
  public loading = false;
  public segmentValue: ESegmentViews = ESegmentViews.home;
  public availableUsersToChoose: IUser[] = [];
  public currentSource: ISource;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private userService: UserService,
    private collegeService: CollegeService,
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

  async ionViewWillEnter() {
    this.dptId = this.activatedRoute.snapshot.params.id;
    this.segmentValue = ESegmentViews.edit;
    if (this.dptId) {
      this.isUpdate = true;
      this.segmentValue = ESegmentViews.home;
      const loading = await this.commonService.showLoading();
      this.departmentService.getByIdAsync(this.dptId).subscribe((res: IDepartment) => {
        loading.dismiss();
        this.dptForm.patchValue({
          name: res.name,
          description: res.description,
          image: res.image,
          admins: (res.admins as IUser[])?.map((val: IUser) => val._id)
        });
        this.currentSource = {
          college: this.collegeService.currentCollege$.value,
          department: res,
          source: ESourceTargetType.department
        };
      }, (err) => {
        loading.dismiss();
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    this.userService.getBySourceAsync(ESourceTargetType.college, this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.availableFaculties = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
        console.log(this.availableFaculties);
        console.log(this.dptForm.value.admins);
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  async onSubmit() {
    this.showErrors = true;
    this.dptForm.markAllAsTouched();
    if (this.dptForm.invalid) {
      return;
    }
    try {
      this.loading = true;
      await this.imageUploader.uploadImage();
    }
    catch (err) {
      this.loading = false;
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

  onChangeSegment(event: any) {
    this.segmentValue = event.detail.value;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
