/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addHours } from 'date-fns';
import { IResource, IResourceSchedule } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-schedule-resource',
  templateUrl: './schedule-resource.component.html',
  styleUrls: ['./schedule-resource.component.scss'],
})
export class ScheduleResourceComponent implements OnInit {

  @Input() public resourceId: string;
  @Input() public startTime: string;
  @Input() public endTime: string;

  scheduleForm: FormGroup;
  submitted = false;
  loading = false;
  showErrors = false;
  isUpdate = false;
  currentResource: IResource;
  minTime = this.commonService.toLocaleIsoDateString(new Date());

  constructor(
    private modalCtrl: ModalController,
    private resourceServoce: ResourceService,
    private commonService: CommonService,
    public config: ConfigService,
    private authService: AuthService,
    private collegeService: CollegeService
  ) { }

  get f() { return this.scheduleForm.controls; }

  async ngOnInit() {
    this.scheduleForm = new FormGroup({
      description: new FormControl(''),
    });
    console.log(this.startTime);
    console.log(this.endTime);
    if (this.resourceId) {
      const loading = await this.commonService.showLoading();
      this.resourceServoce.getByIdAsync(this.resourceId).subscribe(res => {
        loading.dismiss();
        this.currentResource = res;
      }, err => {
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    }
  }

  dismiss(val?: boolean) {
    this.modalCtrl.dismiss(val);
  }

  getIsoDate(date: string) {
    const formated = this.commonService.toLocaleIsoDateString(new Date(date));
    console.log(formated);
    return formated;
  }

  async onSubmit() {
    if(new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
      this.commonService.showToast(`${EStrings.error}: ${EStrings.startTimeGreaterThanEndTime}`);
      return;
    }
    if (this.scheduleForm.invalid) {
      this.showErrors = true;
      return;
    }
    const loading = await this.commonService.showLoading(EStrings.checkingAvailability);
    this.resourceServoce.checkResourceyAvailabilityAsync(this.resourceId, this.startTime, this.endTime)
      .subscribe(res => {
        loading.dismiss();
        if (res.available) {
          this.submitted = true;
          this.loading = true;
          const data: IResourceSchedule = {
            resource: this.resourceId,
            schedule: {
              start: new Date(this.startTime),
              end:new Date(this.endTime),
            },
            description: this.scheduleForm.value.description,
            college: this.collegeService.currentCollege$.value._id,
            createdAt: new Date(),
            createdBy: this.authService.currentUser$.value._id,
          };
          this.resourceServoce.postScheduleAsync(data).subscribe(schRes => {
            this.loading = false;
            this.dismiss(true);
          }, err => {
            this.loading = false;
            this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
          });
        } else {
          this.commonService.showToast(`${EStrings.timeSlotNotAvailable}`);
        }
      }, err => {
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

}
