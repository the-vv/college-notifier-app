/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { IClass, IDepartment, ITimeTable, ITimeTableSchedule, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TimeTableService } from 'src/app/services/time-table.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.page.html',
  styleUrls: ['./time-table.page.scss'],
})
export class TimeTablePage implements OnInit, OnDestroy {

  @ViewChild('dptList') public userModal: IonicSelectableComponent;

  public availableDpts: IDepartment[] = [];
  public departmentControl = new FormControl('');
  public activeTimeTables: ITimeTableSchedule[] = [];
  public remainingTimeTables: ITimeTableSchedule[] = [];
  public activeTutors: IUser[] = [];
  private allTimeTables: ITimeTableSchedule[] = [];
  private loaded = false;
  private subs = new Subscription();


  constructor(
    private dptServce: DepartmentService,
    private router: Router,
    private collegeService: CollegeService,
    private commonService: CommonService,
    private timeTableService: TimeTableService,
    public config: ConfigService
  ) { }

  ngOnInit() {
    this.subs.add(this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && (event.url) === '/dashboard/time-table') {
        this.loaded = true;
        this.initMethod();
      }
    }));
  }

  ionViewWillEnter() {
    if (!this.loaded) {
      this.initMethod();
    }
  }

  initMethod() {
    this.dptServce.getByCollegeAsync(this.collegeService.currentCollege$.value._id)
      .subscribe((res: IDepartment[]) => {
        this.availableDpts = res;
        if (res.length) {
          this.departmentControl.setValue(this.availableDpts[0]);
          this.timeTableService.getByDepartmentAsync(this.departmentControl.value._id)
            .subscribe((timeTableRes: any) => {
              this.displayTimeTable(timeTableRes);
            }, err => {
              console.log(err);
              this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
            });
        }
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onChangeClick() {
    this.userModal.open();
    this.userModal.onClose.pipe(take(1)).subscribe(() => {
      // console.log(this.departmentControl.value);
      this.timeTableService.getByDepartmentAsync(this.departmentControl.value._id)
        .subscribe((res: any) => {
          this.displayTimeTable(res);
        }, err => {
          console.log(err);
          this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
        });
    });
  }

  displayTimeTable(respnse: { timeTables: ITimeTableSchedule[]; tutors: IUser[] }) {
    const { timeTables, tutors } = respnse;
    this.activeTutors = tutors;
    this.allTimeTables = timeTables;
    const activeTimeTables = [];
    const idsToRemove = [];
    timeTables.forEach((timetable: ITimeTableSchedule) => {
      if (new Date(timetable.schedule.start) <= new Date() && new Date(timetable.schedule.end) >= new Date()) {
        activeTimeTables.push(timetable);
        idsToRemove.push(timetable._id);
      }
    });
    this.activeTimeTables = activeTimeTables;
    this.remainingTimeTables = timeTables.filter((timetable: ITimeTableSchedule) => !idsToRemove.includes(timetable._id));
  }

  getTutorOrText(value: string) {
    if(value.startsWith('TEXT: ')) {
      return value.split('TEXT: ')[1];
    } else {
      const tutor = this.activeTutors.find((t: IUser) => t._id === value);
      return tutor.name;
    }
  }

  getClassHourAllocation(classId: string, hour: number) {
    let choosenClass: ITimeTable;
    this.allTimeTables.forEach((timeTable: ITimeTableSchedule) => {
      timeTable.classes.forEach((cls: ITimeTable) => {
        // console.log(cls, classId);
        if ((cls.class as IClass)._id === classId) {
          choosenClass = cls;
        }
      });
    });
    const allocation =  choosenClass.allocation[hour];
    if(!allocation) { return '-'; }
    return this.getTutorOrText(allocation);
  }

}
