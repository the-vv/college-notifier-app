/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IForm, IFormSubmission } from 'src/app/interfaces/common.model';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormSubmissionService } from 'src/app/services/form-submission.service';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissions-list.page.html',
  styleUrls: ['./submissions-list.page.scss'],
})
export class SubmissionsListPage implements OnInit {

  public submissionsData: IFormSubmission[] = [];
  public formTitle: string;

  constructor(
    private formSubmissionSerivce: FormSubmissionService,
    private commonService: CommonService,
    public config: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    const formId = this.route.snapshot.paramMap.get('id');
    const loading = await this.commonService.showLoading();
    this.formSubmissionSerivce.getByFormIdAsync(formId).subscribe(submissions => {
      loading.dismiss();
      this.submissionsData = submissions;
      if (this.submissionsData.length > 0) {
        this.formTitle = (this.submissionsData[0].form as IForm).title;
      }
    }, err => {
      loading.dismiss();
      this.commonService.showToast(err.message);
    });
  }

  onRowClick(submission: IFormSubmission) {
    this.router.navigate(['/form/submission/' + submission._id]);
  }

}
