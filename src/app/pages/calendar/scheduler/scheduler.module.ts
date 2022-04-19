import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulerPageRoutingModule } from './scheduler-routing.module';

import { SchedulerPage } from './scheduler.page';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonExportsModule,
    SharedModule,
    SchedulerPageRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
  ],
  declarations: [SchedulerPage]
})
export class SchedulerPageModule { }
