import { Component, OnInit } from '@angular/core';
import { IResourceSchedule } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  public scheduleData: IResourceSchedule[] = [];
  public exportColumns = [
    {
      header: EStrings.resource,
      field: 'resource.name',
    },
    {
      header: EStrings.createdAt,
      field: 'createdAt',
    },
    {
      header: EStrings.createdBy,
      field: 'createdBy.name',
    },
    {
      header: EStrings.startTime,
      field: 'schedule.start',
    },
    {
      header: EStrings.endTime,
      field: 'schedule.end',
    },
  ];

  constructor(
    public collegeService: CollegeService,
    private commonService: CommonService,
    private resourceService: ResourceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  async getUsers() {
    const loader = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.resourceService.getSchedulesByCollegeAsync(this.collegeService.currentCollege$.value?._id)
      .subscribe(data => {
        loader.dismiss();
        this.scheduleData = data;
        console.log(data);
      }, err => {
        loader.dismiss();
        this.commonService.showToast(err.error.message);
      });
  }

}
