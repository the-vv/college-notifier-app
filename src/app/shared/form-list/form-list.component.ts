/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EBreakPoints, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, IDepartment, IForm, IRoom, ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { FormService } from 'src/app/services/form.service';
// import { FormViewComponent } from '../form-view/form-view.component';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
})
export class FormListComponent implements OnInit, OnInit, OnChanges, OnDestroy {

  public sourceData: ISource;
  @Input() set source(val: ISource) {
    if (!val || !val?.college) { return; }
    this.sourceData = JSON.parse(JSON.stringify(val));
    switch (val.source) {
      case ESourceTargetType.batch:
        this.sourceData.department = undefined;
        break;
      case ESourceTargetType.class:
        this.sourceData.department = undefined;
        this.sourceData.batch = undefined;
        break;
      case ESourceTargetType.room:
        this.sourceData.department = undefined;
        this.sourceData.batch = undefined;
        this.sourceData.class = undefined;
        break;
    }
  }
  @Input() public compact = false;
  public allForms: IForm[] = [];
  public loading = true;
  public currentBreakPoint: EBreakPoints;
  private subs: Subscription = new Subscription();

  constructor(
    private formService: FormService,
    private commonService: CommonService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
    private collegeService: CollegeService
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getForms();
  }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
  }

  getForms() {
    return new Promise<void>((resolve, reject) => {
      if (!this.sourceData?.college) {
        return;
      }
      const postSource: ISource = {
        college: this.collegeService.currentCollege$.value._id,
        department: (this.sourceData.department as IDepartment)?._id,
        batch: (this.sourceData.batch as IBatch)?._id,
        class: (this.sourceData.class as IClass)?._id,
        room: (this.sourceData.room as IRoom)?._id,
        source: this.sourceData.source,
      };
      this.loading = true;
      this.formService.getBySourceAndUserAsync(postSource).subscribe(res => {
        this.allForms = res;
        this.loading = false;
        resolve();
      }, err => {
        this.loading = false;
        this.commonService.showToast(err.error.message);
        reject();
      });
    });
  }

  getStringFromHtml(html: string) {
    return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
  }

  getCreatedByUser(form: IForm) {
    return `${(form.createdBy as IUser).name} | ${EStrings[(form.createdBy as IUser).role]}`;
  }

  hasEditPermission(form: IForm) {
    return this.authService.currentUser$.value.role === EUserRoles.admin
      || this.authService.currentUser$.value._id === form.createdBy;
  }

  openForm(form: IForm) {
    // this.modalCtrl.create({
    //   component: FormViewComponent,
    //   componentProps: {
    //     form,
    //   },
    // }).then(modal => {
    //   modal.present();
    // });
  }

  onEdit(form: IForm, ev: any) {
    ev.stopPropagation();
    this.router.navigate(['/form/manage', form._id]);
  }

  async onDelete(form: IForm, ev: any) {
    ev.stopPropagation();
    const alert = await this.alertController.create({
      header: EStrings.confirmDelete,
      message: `${EStrings.areYouSureWantToDelete} ${EStrings.form.toLowerCase()} '${form.title}'?`,
      buttons: [
        {
          text: EStrings.cancel,
          role: 'cancel',
          id: 'cancel-button',
        }, {
          text: EStrings.delete,
          id: 'confirm-button',
          handler: () => {
            this.formService.deleteAsync(form._id).subscribe(() => {
              this.getForms();
            }, err => {
              this.commonService.showToast(err.error.message);
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
