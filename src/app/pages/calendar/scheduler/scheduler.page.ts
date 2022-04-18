import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
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
import { addHours, addMonths, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';

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

  title = 'Angular Calendar Scheduler Demo';
  calendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = DAYS_IN_WEEK;
  refresh: Subject<any> = new Subject();
  locale = 'en';
  hourSegments: 1 | 2 | 4 | 6 = 4;
  weekStartsOn = 1;
  startsWithToday = true;
  activeDayIsOpen = true;
  excludeDays: number[] = []; // [0];
  weekendDays: number[] = [0, 6];
  dayStartHour = 0;
  dayEndHour = 24;
  events: CalendarSchedulerEvent[] = [
    {
      id: '8',
      start: new Date(),
      end: addHours(new Date(), 3),
      title: 'Event 8',
      content: 'CONCURRENT EVENT',
      color: {
        primary: '#E0E0E0',
        secondary: '#EEEEEE'
      },
      actions: [
        {
          when: 'enabled',
          label: 'Delete',
          title: 'Delete',
          onClick: () => { console.log('calcelled'); }
        }
      ],
      status: 'ok',
      isClickable: true,
      isDisabled: false
    }
  ];

  minDate: Date = new Date();
  maxDate: Date = endOfDay(addMonths(new Date(), 1));

  dayModifier: () => void;
  hourModifier: () => void;
  segmentModifier: () => void;
  eventModifier: () => void;

  prevBtnDisabled = false;
  nextBtnDisabled = false;

  actions: CalendarSchedulerEventAction[] = [
    {
      when: 'enabled',
      label: '<span class="valign-center">cancel</span>',
      title: 'Delete',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log('Pressed action \'Delete\' on event ' + event.id);
      }
    }
  ];

  constructor(@Inject(LOCALE_ID) locale: string, private dateAdapter: DateAdapter) {
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
      event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.dateOrViewChanged();
  }

  ngOnInit(): void {
    // this.appService.getEvents(this.actions)
    //   .then((events: CalendarSchedulerEvent[]) => this.events = events);
  }

  viewDaysOptionChanged(viewDays: string): void {
    console.log('viewDaysOptionChanged', viewDays);
    this.calendarScheduler.setViewDays(Number(viewDays));
  }

  hourSegmentChanged(val: string): void {
    this.calendarScheduler.hourSegments = Number(val) as 1 | 2 | 4 | 6;
    this.refresh.next();
  }

  changeDate(date: Date): void {
    console.log('changeDate', date);
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
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
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

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked Action', action);
    console.log('segmentClicked Segment', segment);
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
  }

  eventTimesChanged({ event, newStart, newEnd }: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    const ev = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }
}
