/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { IClass, IDepartment, ISchedule, ITimeTable, ITimeTableSchedule, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TimeTableService } from 'src/app/services/time-table.service';
import { saveAsPng, saveAsJpeg } from 'save-html-as-image';

declare const $: any;

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
        console.log('TimeTablePage: ngOnInit');
        this.loaded = true;
        this.initMethod();
      }
    }));
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    if (!this.loaded) {
      this.initMethod();
    }
  }

  async initMethod() {
    const loader = await this.commonService.showLoading();
    this.dptServce.getByCollegeAsync(this.collegeService.currentCollege$.value._id)
      .subscribe((res: IDepartment[]) => {
        loader.dismiss();
        this.availableDpts = res;
        if (res.length) {
          this.departmentControl.setValue(this.availableDpts[0]);
          this.timeTableService.getByDepartmentAsync(this.departmentControl.value._id)
            .subscribe((timeTableRes: any) => {
              this.displayTimeTable(timeTableRes);
              this.loaded = false;
            }, err => {
              console.log(err);
              this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
            });
        }
      }, err => {
        loader.dismiss();
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
    if (value.startsWith('TEXT: ')) {
      return value.split('TEXT: ')[1];
    } else {
      const tutor = this.activeTutors.find((t: IUser) => t._id === value);
      return tutor.name;
    }
  }

  getClassHourAllocation(classId: string, hour: number, timeTableId: string) {
    let choosenClass: ITimeTable;
    this.allTimeTables.forEach((timeTable: ITimeTableSchedule) => {
      if (timeTable._id === timeTableId) {
        timeTable.classes.forEach((cls: ITimeTable) => {
          // console.log(cls, classId);
          if ((cls.class as IClass)._id === classId) {
            choosenClass = cls;
          }
        });
      }
    });
    const allocation = choosenClass.allocation[hour];
    if (!allocation) { return '-'; }
    return this.getTutorOrText(allocation);
  }

  exportAsImage(nodeId: string, schedule: string) {
    const node = document.getElementById(nodeId);
    $('.hide-when-downloading').hide();
    saveAsPng(node, { filename: EStrings.timetableExport + `-${schedule.slice(5)}`, printDate: false })
      .then(() => {
        $('.hide-when-downloading').show();
      }).catch(() => {
        $('.hide-when-downloading').show();
      });
  }

}
