/* eslint-disable no-underscore-dangle */
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import {
  CalendarView,
  CalendarDateFormatter,
  DateAdapter
} from 'angular-calendar';
import {
  addPeriod, CalendarSchedulerEvent, CalendarSchedulerEventAction, CalendarSchedulerViewComponent,
  DAYS_IN_WEEK, endOfPeriod, SchedulerDateFormatter, SchedulerEventTimesChangedEvent, SchedulerViewDay,
  SchedulerViewHour, SchedulerViewHourSegment, startOfPeriod, subPeriod
} from 'angular-calendar-scheduler';
import { addDays, addMinutes, addMonths, endOfDay, startOfDay, subMonths } from 'date-fns';
import { Subject } from 'rxjs';
import { IResource, IResourceSchedule, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { ResourceService } from 'src/app/services/resource.service';
import { ScheduleResourceComponent } from 'src/app/shared/schedule-resource/schedule-resource.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.page.html',
  styleUrls: ['./scheduler.page.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})
export class SchedulerPage implements OnInit {

  @ViewChild(CalendarSchedulerViewComponent) calendarScheduler: CalendarSchedulerViewComponent;

  calendarView = CalendarView;

  listMode = false;
  resourceId: string;
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays = DAYS_IN_WEEK;
  refresh: Subject<any> = new Subject();
  locale = 'en';
  hourSegments: 1 | 2 | 4 | 6 = 2;
  weekStartsOn = 1;
  startsWithToday = true;
  activeDayIsOpen = true;
  excludeDays: number[] = []; // [0];
  weekendDays: number[] = [0, 6];
  dayStartHour = 8;
  dayEndHour = 16;
  events: CalendarSchedulerEvent[] = [];
  allSchedules: IResourceSchedule[] = [];
  currentResource: IResource;
  loading = true;

  minDate: Date = subMonths(new Date(), 1);
  maxDate: Date = endOfDay(addMonths(new Date(), 1));

  dayModifier: () => void;
  hourModifier: () => void;
  segmentModifier: () => void;
  eventModifier: () => void;

  prevBtnDisabled = false;
  nextBtnDisabled = false;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private dateAdapter: DateAdapter,
    private route: ActivatedRoute,
    private resourceScrvice: ResourceService,
    private collegeService: CollegeService,
    private commonService: CommonService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private config: ConfigService,
    private router: Router
  ) {

    this.locale = locale;

    this.dayModifier = ((day: SchedulerViewDay): void => {
      if (!this.isDateValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    }).bind(this);

    this.hourModifier = ((hour: SchedulerViewHour): void => {
      if (!this.isDateValid(hour.date)) {
        hour.cssClass = 'cal-disabled';
      }
    }).bind(this);

    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
      if (!this.isDateValid(segment.date)) {
        segment.isDisabled = true;
      }
    }).bind(this);

    this.eventModifier = ((event: CalendarSchedulerEvent): void => {
      if (event.end < new Date()) {
        event.isDisabled = true;
      }
      // event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.dateOrViewChanged();
  }

  async ngOnInit() {
    this.resourceId = this.route.snapshot.paramMap.get('id');
    if (this.resourceId) {
      this.resourceScrvice.getByIdAsync(this.resourceId).subscribe(async (res) => {
        this.currentResource = res;
        const alert = await this.alertController.create({
          header: EStrings.scheduleMode,
          message: `${EStrings.clickOnSlotToSchedule} ${res?.name}`,
          buttons: ['OK']
        });
        await alert.present();
      });
    }
  }

  async getResourceByDateRange(startDate: Date) {
    const start = this.commonService.toLocaleIsoDateString(startOfDay(startDate));
    const end = this.commonService.toLocaleIsoDateString(endOfDay(addDays(startDate, this.viewDays - 1)));
    const loading = await this.commonService.showLoading();
    this.resourceScrvice.getScheduleByDateRangeAsync(this.collegeService.currentCollege$.value._id, start, end, this.resourceId)
      .subscribe(res => {
        this.loading = false;
        loading.dismiss();
        // console.log(res);
        this.allSchedules = res;
        this.events = [];
        res?.forEach(el => {
          this.events.push({
            id: el._id,
            start: new Date(el.schedule.start),
            end: new Date(el.schedule.end),
            title: (el.resource as IResource)?.name,
            content: el.description ? el.description : '<i>No Description</i>',
            color: {
              primary: '#78d2ff',
              secondary: '#91f4ff'
            },
            actions: this.config.sameUserOrAdmin((el.createdBy as IUser)?._id) ? [
              {
                when: 'enabled',
                label: '<i class="bi bi-trash"></i>',
                title: 'Delete',
                onClick: (event) => this.deleteSchedule(event)
              }
            ] : [],
            // status: 'ok',
            isClickable: true,
            isDisabled: false,
            draggable: this.config.sameUserOrAdmin((el.createdBy as IUser)?._id),
            resizable: {
              beforeStart: this.config.sameUserOrAdmin((el.createdBy as IUser)?._id),
              afterEnd: this.config.sameUserOrAdmin((el.createdBy as IUser)?._id)
            },
          });
        });
        this.refresh.next();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  viewDaysOptionChanged(viewDays: string): void {
    console.log('viewDaysOptionChanged', viewDays);
    this.calendarScheduler.setViewDays(Number(viewDays));
    this.getResourceByDateRange(this.viewDate);
  }

  hourSegmentChanged(val: string): void {
    this.hourSegments = Number(val) as 1 | 2 | 4 | 6;
    this.calendarScheduler.hourSegments = Number(val) as 1 | 2 | 4 | 6;
    this.changeView(this.view);
    this.refresh.next();
  }

  changeDate(date: Date): void {
    // console.log('changeDate', date);
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
    console.log('changeView', view);
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    if (this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
      this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
    } else {
      this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/,
        subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
      this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/,
        addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
    }

    if (this.viewDate < this.minDate) {
      return this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      return this.changeDate(this.maxDate);
    }

    this.getResourceByDateRange(this.viewDate);
  }


  viewDaysChanged(viewDays: number): void {
    console.log('viewDaysChanged', viewDays);
    this.viewDays = viewDays;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }

  async segmentClicked(segment: SchedulerViewHourSegment) {
    if (segment.date < new Date()) {
      return this.commonService.showToast(EStrings.cannotCreateSchedulePastDate);
    }
    if (!this.resourceId) {
      const result = await this.commonService.showOkCancelAlert(EStrings.chooseResource, EStrings.chooseResourceDescription);
      if (result) {
        this.router.navigate(['/dashboard/resources']);
        return;
      } else {
        return;
      }
    }
    const startTime = this.commonService.toLocaleIsoDateString(segment.date);
    const minutesToAdd = 60 / this.calendarScheduler.hourSegments;
    this.modalCtrl.create({
      component: ScheduleResourceComponent,
      componentProps: {
        startTime,
        endTime: this.commonService.toLocaleIsoDateString(addMinutes(new Date(startTime), minutesToAdd)),
        resourceId: this.resourceId
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((needReload: any) => {
        if (needReload?.data === true) {
          console.log(needReload);
          this.getResourceByDateRange(this.viewDate);
        }
      });
    });
  }

  eventClicked(event: CalendarSchedulerEvent): void {
    // console.log('eventClicked Event', event);
    const choosenEvent = this.allSchedules.find(el => el._id === event.id);
    this.modalCtrl.create({
      component: ScheduleResourceComponent,
      componentProps: {
        startTime: this.commonService.toLocaleIsoDateString(new Date(choosenEvent.schedule.start)),
        endTime: this.commonService.toLocaleIsoDateString(new Date(choosenEvent.schedule.end)),
        resourceId: (choosenEvent.resource as IResource)?._id,
        scheduleId: choosenEvent._id
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((needReload: any) => {
        if (needReload?.data) {
          const schedule = this.events.find(el => el.id === needReload.data?._id);
          if (schedule) {
            schedule.start = new Date(needReload.data.schedule.start);
            schedule.end = new Date(needReload.data.schedule.end);
            schedule.title = needReload.data.title;
            schedule.content = needReload.data.description ? needReload.data.description : '<i>No Description</i>';
            this.changeView(this.view);
            this.refresh.next();
          }
        }
      });
    });
  }

  async eventTimesChanged({ event, newStart, newEnd }: SchedulerEventTimesChangedEvent) {
    if (newStart < new Date()) { return; }
    const ev = this.events.find(e => e.id === event.id);
    const oldSchedule = { start: ev.start, end: ev.end };
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
    const resource = this.allSchedules.find(el => el._id === event.id)?.resource as IResource;
    const loading = await this.commonService.showLoading(EStrings.checkingAvailability);
    this.resourceScrvice.checkResourceyAvailabilityAsync(
      resource?._id, this.commonService.toLocaleIsoDateString(newStart),
      this.commonService.toLocaleIsoDateString(newEnd),
      event.id
    )
      .subscribe(res => {
        loading.dismiss();
        if (res.available) {
          this.refresh.next();
          const itemToUpdate = this.allSchedules.find(el => el._id === event.id);
          itemToUpdate.schedule.start = this.commonService.toLocaleIsoDateString(newStart);
          itemToUpdate.schedule.end = this.commonService.toLocaleIsoDateString(newEnd);
          this.updateSchedule(itemToUpdate);
        } else {
          ev.start = oldSchedule.start;
          ev.end = oldSchedule.end;
          this.refresh.next();
          this.commonService.showAlert(EStrings.notAvailable, EStrings.timeSlotNotAvailable);
        }
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
        ev.start = oldSchedule.start;
        ev.end = oldSchedule.end;
        this.refresh.next();
      });
  }

  async deleteSchedule(event: CalendarSchedulerEvent) {
    const alert = await this.alertController.create({
      header: EStrings.confirmDelete,
      message: `${EStrings.areYouSureWantToDelete} ${EStrings.schedule.toLowerCase()} '${event.title}'?`,
      buttons: [
        {
          text: EStrings.cancel,
          role: 'cancel',
          id: 'cancel-button',
        }, {
          text: EStrings.delete,
          id: 'confirm-button',
          handler: () => {
            this.resourceScrvice.deleteScheduleAsync(event.id).subscribe(() => {
              this.getResourceByDateRange(this.viewDate);
            }, err => {
              this.commonService.showToast(err.error.message);
            });
          }
        }
      ]
    });
    await alert.present();
  }


  updateSchedule(schedule: IResourceSchedule): void {
    const updateBody = {
      schedule: {
        start: schedule.schedule.start,
        end: schedule.schedule.end
      },
      createdAt: schedule.createdAt,
      _id: schedule._id
    };
    this.resourceScrvice.putScheduleAsync(updateBody as IResourceSchedule)
      .subscribe(res => {
        this.commonService.showToast(`${EStrings.scheduleUpdatedSuccessfully}`);
        this.getResourceByDateRange(this.viewDate);
        this.refresh.next();
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }
}
