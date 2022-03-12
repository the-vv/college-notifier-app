import { Component, OnInit } from '@angular/core';
import { IBatch, IClass, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { BatchService } from 'src/app/services/batch.service';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ClassListPage implements OnInit {

  public classData: IClass[] = [];

  constructor(
    public collegeService: CollegeService,
    public batchService: BatchService,
    public commonService: CommonService,
    private classService: ClassService
  ) { }

  ionViewWillEnter() {
    this.getClasses();
  }

  ngOnInit() {
  }

  async getClasses() {
    const laoding = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.classService.getByCollegeAsync(this.collegeService.currentCollege$.value?._id)
      .subscribe((res) => {
        laoding.dismiss();
        console.log(res);
        this.classData = res;
      }, err => {
        laoding.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  getAdminNames(batch: IBatch) {
    return( batch.admins as IUser[]).map((admin) => admin.name).join(', ');
  }

}
