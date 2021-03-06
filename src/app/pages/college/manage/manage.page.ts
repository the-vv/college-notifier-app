import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, ERequestStatus, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { ICollege, IUser, IUserUsername } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';

@Component({
  selector: 'app-college-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class CollegeManagePage implements OnInit, OnDestroy {

  @ViewChild(ImageUploadComponent) imageUpload: ImageUploadComponent;
  public currentBreakPoint: EBreakPoints;
  public collegeForm: FormGroup;
  public showErrors = false;
  public loading = false;
  public isUpdate = false;
  public collegeId: string;
  public availableFaculties: IUserUsername[] = [];
  public disabledAdmins: IUserUsername[] = [];
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private collegeService: CollegeService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  get f() { return this.collegeForm.controls; }

  async ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.collegeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      website: ['', [Validators.pattern(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/)]],
      image: [''],
      admins: ['', Validators.required]
    });
    this.collegeId = this.activatedRoute.snapshot.params.id;
    if (this.collegeId) {
      this.isUpdate = true;
      const loader = await this.commonService.showLoading();
      this.collegeService.getByIdAsync(this.collegeId).subscribe((res: ICollege) => {
        loader.dismiss();
        this.collegeForm.patchValue({
          name: res.name,
          address: res.address,
          phone: res.phone,
          website: res.website,
          image: res.image,
          admins: (res.admins as IUser[]).map((val: IUser) => val._id)
        });
        this.userService.getBySourceAsync(ESourceTargetType.college, this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
          .subscribe((facRes: IUser[]) => {
            this.availableFaculties = facRes?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
            (res.admins as IUser[]).forEach((val) => {
              this.availableFaculties.push({ ...val, userName: `${val.name} (${val.email})` });
            });
            // remove duplicate values from available faculties
            this.availableFaculties = this.availableFaculties
              .filter((val, index, self) => self.findIndex((t) => t._id === val._id) === index);
            const currentUser = this.authService.currentUser$.value;
            this.disabledAdmins.push({ ...currentUser, userName: `${currentUser.name} (${currentUser.email})` });
          }, err => {
            console.log(err);
            this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
          });
      },
        (err) => {
          loader.dismiss();
          Toast.show({
            text: [EStrings.error + ':', , err.error.message].join(' '),
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async onSubmit() {
    this.showErrors = true;
    this.collegeForm.markAllAsTouched();
    if (this.collegeForm.invalid) {
      return;
    }
    try {
      this.loading = true;
      await this.imageUpload.uploadImage();
    }
    catch (err) {
      this.loading = false;
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const college = this.collegeForm.value as ICollege;
    console.log(college);
    this.loading = true;
    if (this.isUpdate) {
      college._id = this.collegeId;
      this.collegeService.putAsync(college).subscribe((res: ICollege) => {
        this.loading = false;
        this.commonService.showToast(EStrings.collegeUpdatedSuccessfully);
        if (res) {
          this.collegeService.saveCollege(res);
        }
        if(this.authService.isSuperAdmin) {
        this.router.navigate(['/college/list']);
        } else {
          this.router.navigate(['/settings']);
        }
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
    else {
      college.admins = [this.authService.currentUser$.value._id];
      college.status = this.authService.currentUser$.value.role === EUserRoles.admin ? ERequestStatus.pending : ERequestStatus.active;
      this.collegeService.postAsync(college).subscribe((res: ICollege) => {
        this.loading = false;
        if (res) {
          this.collegeService.saveCollege(res);
        }
        this.router.navigate(['/college/list']);
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
  }

}
