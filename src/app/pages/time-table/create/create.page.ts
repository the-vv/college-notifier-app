/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { endOfDay, startOfDay } from 'date-fns';
import { Subscription } from 'rxjs';
import { IBatch, IClass, IDepartment, ISchedule } from 'src/app/interfaces/common.model';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';

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
  accordianVal: 'settings' | null = 'settings';
  departmentControl = new FormControl([]);
  availableDpts: IDepartment[] = [];
  availableClasses: IClass[] = [];
  classesControl = new FormControl([]);
  hoursCtrl = new FormControl(6);
  hoursCount = 6;
  private subs: Subscription = new Subscription();

  constructor(
    public commonService: CommonService,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private classServoce: ClassService
  ) { }

  ngOnInit() {
  }


  setStartDate(date: string) {
    this.dateRange.start = date;
    if(this.dateRange.end < date) {
      this.dateRange.end = date;
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
                  name: `${item.name} (${(item.source.batch as IBatch).startDate} - ${(item.source.batch as IBatch).endDate})`
                }
              ));
              this.classesControl.setValue(res);
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


}
