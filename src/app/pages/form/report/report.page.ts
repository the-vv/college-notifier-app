/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { IDepartment, IForm, IUser } from 'src/app/interfaces/common.model';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { CollegeService } from 'src/app/services/college.service';
import { ModalController } from '@ionic/angular';
import { TargetViewComponent } from 'src/app/shared/target-view/target-view.component';
import { EStrings } from 'src/app/interfaces/strings.enum';

@Component({
  selector: 'app-form-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class FormReportPage implements OnInit {

  public formsData: IForm[] = [];
  public eUserRoles = EUserRoles;
  public currentRole: string | EUserRoles;
  public exportColumns = [
    {
      header: EStrings.title,
      field: 'title',
    },
    {
      header: EStrings.createdAt,
      field: 'createdAt',
    },
    {
      header: EStrings.createdBy,
      field: 'createdBy.email',
    },
  ];

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private commonService: CommonService,
    public config: ConfigService,
    private collegeService: CollegeService,
    private modalController: ModalController
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

  viewTarget(form: IForm) {
    this.modalController.create({
      component: TargetViewComponent,
      componentProps: {
        target: form.target,
        title: `${form.title} ${EStrings.form} ${EStrings.target}`
      },
    }).then(modal => {
      modal.present();
    });
  }

  checkPermission(userId: string) {
    return this.config.sameUserOrAdmin(userId);
  }


}
