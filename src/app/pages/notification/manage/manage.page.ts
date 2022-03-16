/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ENotificationType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IDepartment, ITarget, IUser } from 'src/app/interfaces/common.model';
import { BatchService } from 'src/app/services/batch.service';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

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
  public currentTime = new Date().toISOString();
  public sendInstantly = true;
  public sendToCollege = false;
  public sendSchedule = new FormControl([new Date().toISOString()]);
  public notificationForm = this.fb.group({
    title: ['', Validators.required],
    content: [''],
    attatchement: [''],
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
    private commonService: CommonService
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

  onSubmit() {
    console.log(this.notificationForm.value);
    console.log(this.targetForm.value);
  }


  onTargetCollege() {
    if (this.sendToCollege) {
      this.targetForm.disable();
      this.targetForm.reset();
    } else {
      this.targetForm.enable();
    }
    this.targetForm.get('college').setValue(this.sendToCollege ? this.collegeService.currentCollege$.value._id : null);
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
          this.dptCtrl.onClose.pipe(take(1)).subscribe(val => {
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
          this.commonService.showToast(err.message);
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
          this.commonService.showToast(err.message);
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
          this.commonService.showToast(err.message);
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
          this.commonService.showToast(err.message);
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
          this.commonService.showToast(err.message);
        });
        break;
    }
  }

  ionViewWillLeave() {
  }

}
