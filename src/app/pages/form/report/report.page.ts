/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { IDepartment, IForm, IUser } from 'src/app/interfaces/common.model';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { CollegeService } from 'src/app/services/college.service';

@Component({
  selector: 'app-form-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class FormReportPage implements OnInit {

  public formsData: IForm[] = [];
  public eUserRoles = EUserRoles;
  public currentRole: string | EUserRoles;

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private commonService: CommonService,
    public config: ConfigService,
    private collegeService: CollegeService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.currentRole = this.authService.currentUserRole;
    if (this.config.isAdmin) {
      const loading = await this.commonService.showLoading();
      this.formService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(forms => {
        loading.dismiss();
        this.formsData = forms;
      }, err => {
        loading.dismiss();
        this.commonService.showToast(err.message);
      });
    } else {
      const loading = await this.commonService.showLoading();
      this.formService.getByUserMapAsync(this.config.currentUsermap).subscribe(forms => {
        loading.dismiss();
        this.formsData = forms;
      }, err => {
        loading.dismiss();
        this.commonService.showToast(err.message);
      });
    }
  }


}
