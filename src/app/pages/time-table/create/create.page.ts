import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { endOfDay, startOfDay } from 'date-fns';
import { IDepartment, ISchedule } from 'src/app/interfaces/common.model';
import { CommonService } from 'src/app/services/common.service';

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
  departmentControl = new FormControl('');
  availableDpts: IDepartment[] = [];
  classesControl = new FormControl([]);

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit() {
  }

}
