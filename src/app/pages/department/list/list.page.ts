import { Component, OnInit } from '@angular/core';
import { IDepartment, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  departmentsData: IDepartment[] = [];

  constructor(
    public collegeService: CollegeService,
    private departmentService: DepartmentService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDepartments();
  }

  async getDepartments() {
    const laoding = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id)
      .subscribe((res) => {
        laoding.dismiss();
        console.log(res);
        this.departmentsData = res;
      }, err => {
        laoding.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  getAdminNames(department: IDepartment) {
    return( department.admins as IUser[]).map((admin) => admin.name).join(', ');
  }

}
