/* eslint-disable no-underscore-dangle */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IForm, IFormSubmission, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { FormSubmissionService } from 'src/app/services/form-submission.service';
import { FormService } from 'src/app/services/form.service';

declare const $: any;

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.page.html',
  styleUrls: ['./renderer.page.scss'],
})
export class RendererPage implements OnInit, AfterViewInit {

  public formId: string;
  public form: IForm;
  public formSubmission: IFormSubmission;
  public loading = false;
  public submitted = false;
  public invalid = false;
  public isResultMode = false;
  private renderedForm: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    private commonService: CommonService,
    private submissonSerice: FormSubmissionService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngAfterViewInit() {
    const currentUrl = this.router.url;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (currentUrl.includes('/form/submission/')) {
      this.isResultMode = true;
      const loading = await this.commonService.showLoading();
      this.submissonSerice.getByIdAsync(id).subscribe(submission => {
        loading.dismiss();
        this.formSubmission = submission;
        this.form = (this.formSubmission.form as IForm);
        setTimeout(() => {
          this.renderedForm = $('#form_wrap').formRender({ formData: submission.data });
          $(':input').prop('readonly', true).click(() => false);
        });
      }, err => {
        loading.dismiss();
        this.commonService.showToast(err.message);
      });
    } else {
      this.formId = this.activatedRoute.snapshot.paramMap.get('id');
      const loading = await this.commonService.showLoading();
      this.formService.getByIdAsync(this.formId).subscribe(form => {
        loading.dismiss();
        this.form = form;
        setTimeout(() => {
          this.renderedForm = $('#form_wrap').formRender({ formData: form.formData });
        });
      }, err => {
        console.log(err.message);
        loading.dismiss();
        this.commonService.showToast(err.message);
      });
    }
  }

  ngOnInit() {
  }

  getCreatedByUser(form: IForm) {
    return `${(form.createdBy as IUser).name} | ${EStrings[(form.createdBy as IUser).role]}`;
  }

  getSubmissionCreatedByUser(form: IFormSubmission) {
    return `${(form.user as IUser).name} | ${EStrings[(form.user as IUser).role]}`;
  }

  checkValidity() {
    let valid = true;
    // eslint-disable-next-line space-before-function-paren
    $('[required]').each(function () {
      if ($(this).is(':invalid') || !$(this).val()) {
        valid = false;
      }
    });
    return valid;
  }

  onSubmit() {
    this.invalid = !this.checkValidity();
    this.submitted = true;
    if (this.invalid) {
      return;
    }
    const postBody: IFormSubmission = {
      createdAt: this.commonService.toLocaleIsoDateString(new Date()),
      form: this.formId,
      data: JSON.stringify(this.renderedForm.userData),
      user: this.authService.currentUser$.value._id,
    };
    this.loading = true;
    this.submissonSerice.postAsync(postBody).subscribe(res => {
      this.loading = false;
      this.commonService.showToast('Form submitted successfully');
      this.submitted = false;
    }, err => {
      this.loading = false;
      this.commonService.showToast(err.message);
    });
  }

}
