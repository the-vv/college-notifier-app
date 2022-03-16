/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { ENotificationType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IDepartment, INotification, ITarget } from 'src/app/interfaces/common.model';
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
import { FileUploadComponent } from 'src/app/shared/file-upload/file-upload.component';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class NotificationManagePage implements OnInit {

  @ViewChild('dpts', { static: true }) private dptCtrl: IonicSelectableComponent;
  @ViewChild('batches', { static: true }) private batchCtrl: IonicSelectableComponent;
  @ViewChild('classes', { static: true }) private classCtrl: IonicSelectableComponent;
  @ViewChild('rooms', { static: true }) private roomCtrl: IonicSelectableComponent;
  @ViewChild('users', { static: true }) private userCtrl: IonicSelectableComponent;
  @ViewChild('uploader', { static: true }) private uploadCtrl: FileUploadComponent;

  public quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link']
    ]
  };
  public showErrors = false;
  public eSourceTargetType = ESourceTargetType;
  public loading = false;
  public currentTime = this.commonService.toLocaleIsoDateString(new Date());
  public sendInstantly = true;
  public sendToCollege = false;
  public sendSchedule = new FormControl(this.commonService.toLocaleIsoDateString(new Date()));
  public notificationForm = this.fb.group({
    title: ['', Validators.required],
    content: [''],
    attachment: [''],
    type: [ENotificationType.notification, Validators.required],
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
    private notificationService: NotificationService
  ) { }
  public get b() {
    return this.notificationForm.controls;
  }
  public get t() {
    return this.targetForm.controls;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  async onSubmit() {
    this.showErrors = true;
    if (!this.notificationForm.valid) {
      return;
    }
    if (!this.sendInstantly) {
      if (new Date(this.sendSchedule.value) < new Date()) {
        this.commonService.showToast(EStrings.chooseFutureTime);
        return;
      }
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
    try {
      this.loading = true;
      await this.uploadCtrl.uploadFile();
    }
    catch(e) {
      console.log(e);
      this.loading = false;
      return;
    }
    const reqBody: INotification = {
      ...this.notificationForm.value,
      target: this.targetForm.value
    };
    reqBody.createdAt = this.sendInstantly ?
      this.commonService.toLocaleIsoDateString(new Date()) :
      this.sendSchedule.value;
    reqBody.createdBy = this.authService.currentUser$.value._id;
    reqBody.active = this.sendInstantly;
    console.log(reqBody);
    this.notificationService.postAsync(reqBody).subscribe((res) => {
      console.log(res);
      this.loading = false;
      this.commonService.showToast('published');
    }, (err) => {
      this.loading = false;
      console.log(err);
      this.commonService.showToast(err.error.message);
    });
  }


  onTargetCollege() {
    if (this.sendToCollege) {
      this.targetForm.disable();
      this.targetForm.reset();
    } else {
      this.targetForm.enable();
    }
  }

  onChangeType(event: any) {
    this.notificationForm.get('type').setValue(event.detail.checked ? ENotificationType.event : ENotificationType.notification);
  }

  onChooseTarget(targetType: ESourceTargetType | 'user') {
    switch (targetType) {
      case ESourceTargetType.department:
        this.dptCtrl.items = [];
        this.dptCtrl.showLoading();
        this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          this.dptCtrl.items = res;
          this.dptCtrl.hideLoading();
          this.dptCtrl.onClose.pipe(take(1)).subscribe(() => {
            if (this.t.departments.value?.length) {
              this.t.batches.setValue([]);
              this.t.batches.disable();
              this.t.classes.setValue([]);
              this.t.classes.disable();
            } else {
              this.t.batches.enable();
              this.t.classes.enable();
            }
          });
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
          this.batchCtrl.onClose.pipe(take(1)).subscribe(() => {
            if (this.t.batches.value?.length) {
              this.t.classes.setValue([]);
              this.t.classes.disable();
            } else {
              this.t.classes.enable();
            }
          });
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
          this.userCtrl.items = [...res[0], ...res[1]];
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
