/* eslint-disable no-underscore-dangle */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { forkJoin } from 'rxjs';
import { ENotificationType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, IDepartment, INotification, IRoom, ITarget, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { BatchService } from 'src/app/services/batch.service';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

declare const $: any; // for JQuery

@Component({
  selector: 'app-notification-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class FormManagePage implements OnInit, AfterViewInit {

  @ViewChild('dpts', { static: true }) private dptCtrl: IonicSelectableComponent;
  @ViewChild('batches', { static: true }) private batchCtrl: IonicSelectableComponent;
  @ViewChild('classes', { static: true }) private classCtrl: IonicSelectableComponent;
  @ViewChild('rooms', { static: true }) private roomCtrl: IonicSelectableComponent;
  @ViewChild('users', { static: true }) private userCtrl: IonicSelectableComponent;

  public showErrors = false;
  public eSourceTargetType = ESourceTargetType;
  public loading = false;
  public sendToCollege = false;
  public isUpdate = false;
  public formId: string;
  public formBuilder: any;
  public formForm = this.fb.group({
    title: ['', Validators.required],
  });
  public targetForm = this.fb.group({
    college: '',
    departments: [],
    batches: [],
    classes: [],
    rooms: [],
    users: [],
  });

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private batchService: BatchService,
    private classService: ClassService,
    private roomServce: RoomService,
    private userService: UserService,
    private commonService: CommonService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }
  public get b() {
    return this.formForm.controls;
  }
  public get t() {
    return this.targetForm.controls;
  }

  ngAfterViewInit(): void {
    const options = {
      showActionButtons: false,
      scrollToFieldOnAdd: false,
    };
    $('#form-builder').formBuilder(options).promise.then((builder: any) => {
      this.formBuilder = builder;
      $('li.formbuilder-icon-button').hide();
      $('li.formbuilder-icon-hidden').hide();
      $('li.formbuilder-icon-file').hide();
    });
  }

  async ngOnInit() {
    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.formId) {
      this.isUpdate = true;
      const loading = await this.commonService.showLoading();
      this.notificationService.getByIdAsync(this.formId).subscribe((notification: INotification) => {
        loading.dismiss();
        this.formForm.patchValue({
          title: notification.title,
        });
        this.targetForm.patchValue({
          college: notification.target.college,
          departments: (notification.target.departments as IDepartment[])?.map((item) => item._id),
          batches: (notification.target.batches as IBatch[])?.map((item) => item._id),
          classes: (notification.target.classes as IClass[])?.map((item) => item._id),
          rooms: (notification.target.rooms as IRoom[])?.map((item) => item._id),
          users: (notification.target.users as IUser[])?.map((item) => item._id),
        });
        Object.keys(notification.target).forEach(key => {
          if (!notification.target[key] || notification.target[key]?.length === 0) {
            delete notification.target[key];
          }
        });
        this.sendToCollege = Object.keys(notification.target).length === 1;
      }, (err) => {
        loading.dismiss();
        this.commonService.showToast(err.error.message);
      });
    }
  }

  public checkIsFutureTime(isoDate: string) {
    return new Date(isoDate).getTime() > new Date().getTime();
  }

  ionViewWillEnter() {
  }

  async onSubmit() {
    this.showErrors = true;
    if (!this.formForm.valid) {
      return;
    }
    this.targetForm.get('college').setValue(this.collegeService.currentCollege$.value?._id);
    Object.keys(this.targetForm.value).forEach(key => {
      if (!this.targetForm.value[key] || this.targetForm.value[key]?.length === 0) {
        delete this.targetForm.value[key];
      }
    });
    if (Object.keys(this.targetForm.value).length === 1 && (!this.sendToCollege && 'college' in this.targetForm.value)) {
      this.commonService.showToast(EStrings.chooseAtleastOneTarget);
      return;
    }
    const reqBody: INotification = {
      ...this.formForm.value,
      target: this.targetForm.value
    };
    if (!this.isUpdate) {
      reqBody.createdBy = this.authService.currentUser$.value._id;
      reqBody.active = true;
      this.notificationService.postAsync(reqBody).subscribe((res) => {
        // console.log(res);
        this.loading = false;
        this.commonService.showToast(EStrings.formPublishedSuccessFully);
        this.router.navigate(['/', 'dashboard', 'forms'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        console.log(err);
        this.commonService.showToast(err.error.message);
      });
    } else {
      reqBody._id = this.formId;
      this.notificationService.putAsync(reqBody).subscribe((res) => {
        this.loading = false;
        this.commonService.showToast(EStrings.notificationUpdatedSuccessfully);
        this.router.navigate(['/', 'dashboard', 'forms'], { replaceUrl: true });
      }, err => {
        this.loading = false;
        this.commonService.showToast(err.error.message);
      });
    }
  }

  onTargetCollege() {
    if (this.sendToCollege) {
      this.targetForm.disable();
      this.targetForm.reset();
    } else {
      this.targetForm.enable();
    }
  }

  onChooseTarget(targetType: ESourceTargetType | 'user') {
    switch (targetType) {
      case ESourceTargetType.department:
        this.dptCtrl.items = [];
        this.dptCtrl.showLoading();
        this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          this.dptCtrl.items = res;
          this.dptCtrl.hideLoading();
        }, err => {
          this.dptCtrl.hideLoading();
          this.commonService.showToast(err.error.message);
        });
        break;
      case ESourceTargetType.batch:
        this.batchCtrl.items = [];
        this.batchCtrl.showLoading();
        this.batchService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          this.batchCtrl.items = res?.map((item) => (
            { ...item, name: `${item.startDate} - ${item.endDate} (${(item.source?.department as IDepartment)?.name})` }
          ));
          this.batchCtrl.hideLoading();
        }, err => {
          this.batchCtrl.hideLoading();
          this.commonService.showToast(err.error.message);
        });
        break;
      case ESourceTargetType.class:
        this.classCtrl.items = [];
        this.classCtrl.showLoading();
        this.classService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          this.classCtrl.items = res.map(item => (
            {
              ...item,
              name: `${item.name} (${(item.source.batch as IBatch).startDate} - ${(item.source.batch as IBatch).endDate}, 
                ${(item.source.department as IDepartment).name})`
            }
          ));
          this.classCtrl.hideLoading();
        }, err => {
          this.classCtrl.hideLoading();
          this.commonService.showToast(err.error.message);
        });
        break;
      case ESourceTargetType.room:
        this.roomCtrl.items = [];
        this.roomCtrl.showLoading();
        this.roomServce.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          this.roomCtrl.items = res;
          this.roomCtrl.hideLoading();
        }, err => {
          this.roomCtrl.hideLoading();
          this.commonService.showToast(err.error.message);
        });
        break;
      case 'user':
        this.userCtrl.items = [];
        this.userCtrl.showLoading();
        forkJoin([
          this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.faculty),
          this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.student)
        ]).subscribe(res => {
          this.userCtrl.items = [...res[0], ...res[1]].map(item => ({ ...item, name: `${item.name} (${item.email})` }));
          this.userCtrl.hideLoading();
        }, err => {
          this.userCtrl.hideLoading();
          this.commonService.showToast(err.error.message);
        });
        break;
    }
  }

  ionViewWillLeave() {
  }

}
