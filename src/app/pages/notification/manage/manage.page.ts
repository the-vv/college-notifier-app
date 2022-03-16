/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ENotificationType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IUser } from 'src/app/interfaces/common.model';
import { BatchService } from 'src/app/services/batch.service';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { DepartmentService } from 'src/app/services/department.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class NotificationManagePage implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private batchService: BatchService,
    private classService: ClassService,
    private roomServce: RoomService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  onSubmit() {
    console.log(this.notificationForm.value);
  }

  onChangeType(event) {
    this.notificationForm.get('type').setValue(event.detail.checked ? ENotificationType.event : ENotificationType.notification);
  }

  onChooseTarget(targetType: ESourceTargetType | 'user') {
    switch (targetType) {
      case ESourceTargetType.department:
        this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          console.log(res);
        });
        break;
      case ESourceTargetType.batch:
        this.batchService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          console.log(res);
        });
        break;
      case ESourceTargetType.class:
        this.classService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          console.log(res);
        });
        break;
      case ESourceTargetType.room:
        this.roomServce.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
          console.log(res);
        });
        break;
      case 'user':
        const reqs: Observable<IUser[]>[] = [];
        reqs.push(this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.faculty));
        reqs.push(this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.student));
        forkJoin(reqs).subscribe(res => {
          console.log(res);
        });
        break;
    }
  }

  ionViewWillLeave() {
  }

}
