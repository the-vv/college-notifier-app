import { Component, OnInit } from '@angular/core';
import { IBatch, IDepartment, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { BatchService } from 'src/app/services/batch.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-batch-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class BatchListPage implements OnInit {

  public batchData: IBatch[] = [];

  constructor(
    public collegeService: CollegeService,
    public batchService: BatchService,
    public commonService: CommonService
  ) { }

  ionViewWillEnter() {
    this.getBatches();
  }

  ngOnInit() {
  }

  async getBatches() {
    const laoding = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.batchService.getByCollegeAsync(this.collegeService.currentCollege$.value?._id)
      .subscribe((res) => {
        laoding.dismiss();
        console.log(res);
        this.batchData = res;
      }, err => {
        laoding.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  getAdminNames(batch: IBatch) {
    return( batch.admins as IUser[]).map((admin) => admin.name).join(', ');
  }

}
