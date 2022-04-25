/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { endOfDay, startOfDay } from 'date-fns';
import { Subscription } from 'rxjs';
import { ECustomUserRoles, ESourceTargetType } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, ICollege, IDepartment, ISchedule, ITimeTable, IUser } from 'src/app/interfaces/common.model';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-timetable-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {


  dateRange: ISchedule = {
    start: this.commonService.toLocaleIsoDateString(startOfDay(new Date())),
    end: this.commonService.toLocaleIsoDateString(endOfDay(new Date())),
  };
  accordianVal: 'settings' | undefined = 'settings';
  tutorAccordian: 'tutor' | undefined = undefined;
  departmentControl = new FormControl([]);
  availableDpts: IDepartment[] = [];
  availableClasses: IClass[] = [];
  classesControl = new FormControl([]);
  hoursCtrl = new FormControl(6);
  finalHoursCount = 0;
  rolesCtrl = new FormControl([ECustomUserRoles.teachingStaff, ECustomUserRoles.assistProf]);
  hoursCount: string | number = 6;
  minDate = this.commonService.toLocaleIsoDateString(startOfDay(new Date()));
  customRoles = Object.keys(ECustomUserRoles).map(key => ({ name: key, value: ECustomUserRoles[key] }));
  eCustomUserRoles = ECustomUserRoles;
  allocationData: ITimeTable[] = [];
  showGrid = false;
  allTutorList: IUser[] = [];
  private subs: Subscription = new Subscription();

  constructor(
    public commonService: CommonService,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private classServoce: ClassService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  accChange(e: any) {
    if ((e?.path[0]?.classList as DOMTokenList)?.contains('accordion-group-expand-compact')) {
      this.accordianVal = e.detail.value;
    }
  }

  tutorAcccChange(e: any) {
    this.tutorAccordian = e.detail.value;
  }

  setStartDate(date: string) {
    this.dateRange.start = date;
    if (new Date(this.dateRange.end) < new Date(date)) {
      this.dateRange.end = date;
    }
  }

  setEndDate(date: string) {
    this.dateRange.end = date;
    if (new Date(this.dateRange.start) > new Date(date)) {
      this.dateRange.start = date;
    }
  }

  ionViewWillEnter() {
    this.getDpts();
    this.subs.add(
      this.departmentControl.valueChanges.subscribe(async (val) => {
        if (val) {
          const loader = await this.commonService.showLoading();
          this.classServoce.getActiveClassesByDepartmentAsync(this.collegeService.currentCollege$.value._id, val._id)
            .subscribe(res => {
              this.availableClasses = res?.map(item => (
                {
                  ...item,
                  nameLong: `${item.name} (${(item.source.batch as IBatch).startDate} - ${(item.source.batch as IBatch).endDate})`
                }
              ));
              this.classesControl.setValue(this.availableClasses);
              loader.dismiss();
            }, err => {
              loader.dismiss();
              this.commonService.showToast(err.error.message);
            });
        }
      })
    );
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    this.classesControl.setValue([]);
    this.departmentControl.setValue('');
  }

  async getDpts() {
    const loader = await this.commonService.showLoading();
    this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
      this.availableDpts = res;
      if (res?.length) {
        this.departmentControl.setValue(res[0]);
      }
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.commonService.showToast(err.error.message);
    });
  }

  async onStart() {
    if (!(this.hoursCtrl.value && this.rolesCtrl.value?.length && this.departmentControl.value && this.classesControl.value)) {
      return;
    }
    this.finalHoursCount = this.hoursCtrl.value;
    this.allocationData = [];
    for (let i = 0; i < this.classesControl.value?.length; i++) {
      this.allocationData.push({
        class: this.classesControl.value[i] as IClass,
        college: this.collegeService.currentCollege$.value as ICollege,
        department: this.departmentControl.value as IDepartment,
        hoursCount: this.hoursCtrl.value,
        schedule: {
          start: this.dateRange.start,
          end: this.dateRange.end,
        },
        allocation: []
      });
    }
    console.log(this.allocationData);
    const loader = await this.commonService.showLoading();
    this.userService.getBySourceCustomRoleAsync(
      ESourceTargetType.department, this.departmentControl.value?._id, this.rolesCtrl.value
    ).subscribe(res => {
      loader.dismiss();
      console.log(res);
      this.accordianVal = undefined;
      this.showGrid = true;
      this.allTutorList = res;
      this.tutorAccordian = 'tutor';
    }, err => {
      loader.dismiss();
      this.commonService.showToast(err.error.message);
    });
  }

  getRangeArray(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

}
