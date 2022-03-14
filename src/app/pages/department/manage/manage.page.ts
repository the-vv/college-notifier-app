import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { ActionSheetController, AlertController, IonAccordionGroup } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EBreakPoints, ESegmentViews, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IDepartment, IUser, IUserMap } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-department-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class DepartmentManagePage implements OnInit, OnDestroy {

  @ViewChild('modal') public userModal: IonicSelectableComponent;
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  public isUpdate = false;
  public dptId: string;
  public availableFaculties: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public dptForm: FormGroup;
  public loading = false;
  public segmentValue: ESegmentViews = ESegmentViews.home;
  public allStudents: IUser[] = [];
  public allFaculties: IUser[] = [];
  public accordianLoading = false;
  public selectedUsers: IUser[] = [];
  public selectedModalUsers: string[] = [];
  public availableUsersToChoose: IUser[] = [];
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private userService: UserService,
    private collegeService: CollegeService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) { }

  get f() { return this.dptForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.dptForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: [''],
      admins: [[], [Validators.required]],
    });
  }

  async ionViewWillEnter() {
    this.dptId = this.activatedRoute.snapshot.params.id;
    if (this.dptId) {
      this.isUpdate = true;
      const loading = await this.commonService.showLoading();
      this.departmentService.getByIdAsync(this.dptId).subscribe((res: IDepartment) => {
        loading.dismiss();
        this.dptForm.patchValue({
          name: res.name,
          description: res.description,
          image: res.image,
          admins: (res.admins as IUser[])?.map((val: IUser) => val._id)
        });
        console.log(this.dptForm.value);
      }, (err) => {
        loading.dismiss();
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.availableFaculties = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onSubmit() {
    console.log(this.dptForm.value);
    this.showErrors = true;
    this.dptForm.markAllAsTouched();
    if (this.dptForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const department = this.dptForm.value as IDepartment;
    this.loading = true;
    if (this.isUpdate) {
      department._id = this.dptId;
      this.departmentService.putAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;
        this.router.navigate(['/department/list'], { replaceUrl: true });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    else {
      department.active = true;
      department.source = {
        college: this.collegeService.currentCollege$.value._id,
        source: ESourceTargetType.college
      };
      this.departmentService.postAsync(department).subscribe((res: IDepartment) => {
        this.loading = false;
        this.router.navigate(['/department/list'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
  }

  loadStudents() {
    this.accordianLoading = true;
    this.userService.getBySourceAsync(ESourceTargetType.department, this.dptId, EUserRoles.student)
      .subscribe((res: IUser[]) => {
        this.accordianLoading = false;
        this.allStudents = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
      }, err => {
        console.log(err);
        this.accordianLoading = false;
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  loadFaculties() {
    this.accordianLoading = true;
    this.userService.getBySourceAsync(ESourceTargetType.department, this.dptId, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.accordianLoading = false;
        this.allFaculties = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
      }, err => {
        this.accordianLoading = false;
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }


  onChangeSegment(event: any) {
    this.segmentValue = event.detail.value;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onUserOpen(event: any) {
    const accrdian = event?.detail?.value;
    if (accrdian === EUserRoles.student) {
      this.loadStudents();
    }
    else if (accrdian === EUserRoles.faculty) {
      this.loadFaculties();
    }
  }

  onMapClick() {
    this.actionSheetController.create({
      header: `${EStrings.choose} ${EStrings.role}`,
      buttons: [
        {
          text: EStrings.student,
          handler: () => {
            this.showUserModal(EUserRoles.student);
          }
        },
        {
          text: EStrings.faculty,
          handler: () => {
            this.showUserModal(EUserRoles.faculty);
          }
        },
        {
          text: EStrings.cancel,
          role: 'cancel'
        }
      ]
    }).then(actionSheet => {
      actionSheet.present();
    });
  }

  showUserModal(role: EUserRoles) {
    this.userModal.items = [];
    this.userModal.open();
    this.userModal.showLoading();
    this.userService.getBySourceAsync(ESourceTargetType.college, this.collegeService.currentCollege$.value._id, role)
      .subscribe((res: IUser[]) => {
        const allUsers = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
        this.userService.getBySourceAsync(ESourceTargetType.department, this.dptId, role)
          .subscribe((mapRes: IUser[]) => {
            this.userModal.hideLoading();
            const mapped = mapRes?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
            this.userModal.items = allUsers?.filter((val: any) => !mapped.find(mapVal => mapVal._id === val._id));
          }, err => {
            console.log(err);
            this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
          });
      }, err => {
        this.userModal.hideLoading();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
    this.userModal.onClose.pipe(take(1)).subscribe(() => {
      this.submitUserMaps(this.selectedModalUsers);
    });
  }

  submitUserMaps(users: string[], unMap: boolean = false) {
    if (!users || users.length === 0) {
      return;
    }
    const postData: IUserMap[] = [];
    users.forEach((val: string) => {
      postData.push({
        user: val,
        source: {
          college: this.collegeService.currentCollege$.value._id,
          department: unMap ? undefined : this.dptId,
          batch: undefined,
          class: undefined,
          source: unMap ? ESourceTargetType.college : ESourceTargetType.department,
        }
      });
    });
    this.loading = true;
    this.userService.postUserMapsAsync(postData)
      .subscribe((res: any) => {
        this.accordionGroup.value = undefined;
        this.selectedUsers = [];
        this.loading = false;
        Toast.show({
          text: [EStrings.successfully, EStrings.mapped].join(' '),
        });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
  }

  onOptionsClick() {
    this.actionSheetController.create({
      header: `${EStrings.choose} ${EStrings.option}`,
      buttons: [
        {
          text: EStrings.removeMap,
          handler: async () => {
            const alert = await this.alertController.create({
              header: EStrings.areYouSure,
              subHeader: `${EStrings.removingUserMap}...!`,
              message: `${EStrings.thisActionWillRemove} 
               ${this.selectedUsers.length} ${EStrings.users} ${EStrings.from} ${EStrings.department}`,
              buttons: [{
                text: EStrings.removeMap,
                handler: () => {
                  this.submitUserMaps(this.selectedUsers.map(el => el._id), true);
                }
              }]
            });
            await alert.present();
          }
        },
        {
          text: EStrings.cancel,
          role: 'cancel'
        }
      ]
    }).then(actionSheet => {
      actionSheet.present();
    });
  }

}
