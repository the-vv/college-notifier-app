/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ICollege } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { Toast } from '@capacitor/toast';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';
import { ERequestStatus } from 'src/app/interfaces/common.enum';


@Component({
  selector: 'app-college-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class CollegeListPage implements OnInit {

  public collegeData: ICollege[] = [];
  public eRequestStatus = ERequestStatus;
  public loading = false;

  constructor(
    private collegeService: CollegeService,
    private commonService: CommonService
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    const loader = await this.commonService.showLoading();
    this.collegeService.getAllCollegeAsync()
      .subscribe(res => {
        this.collegeData = res;
        console.log(this.collegeData);
        loader.dismiss();
      }, err => {
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
        loader.dismiss();
      });
  }

  async onStatusChange(status: ERequestStatus, id: string) {
    this.loading = true;
    this.collegeService.approveRejectAsync(id, status)
      .subscribe(() => {
        this.loading = false;
        // change status of that college to active
        const cindex = this.collegeData.findIndex(college => college._id === id);
        this.collegeData[cindex].status = status;
      }, err => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
  }

}
