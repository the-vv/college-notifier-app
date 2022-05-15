import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints, ERequestStatus, EUserRoles } from 'src/app/interfaces/common.enum';
import { ICollege } from 'src/app/interfaces/common.model';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';

@Component({
  selector: 'app-create-college',
  templateUrl: './create-college.component.html',
  styleUrls: ['./create-college.component.scss'],
})
export class CreateCollegeComponent implements OnInit, OnDestroy {

  @ViewChild(ImageUploadComponent) imageUpload: ImageUploadComponent;
  public currentBreakPoint: EBreakPoints;
  public collegeForm: FormGroup;
  public showErrors = false;
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private collegeService: CollegeService
  ) { }

  get f() { return this.collegeForm.controls; }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.collegeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      website: ['', [Validators.pattern(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/)]],
      image: ['']
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async onSubmit() {
    console.log('onSubmit');
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
    college.admins = [this.authService.currentUser$.value._id];
    college.status = this.authService.currentUser$.value.role === EUserRoles.admin ? ERequestStatus.pending : ERequestStatus.active;
    console.log(college);
    this.loading = true;
    this.collegeService.postAsync(college).subscribe((res: ICollege) => {
      this.loading = false;
      if(res) {
        this.collegeService.saveCollege(res);
      }
      this.commonService.goToDashboard();
    }, (err) => {
      this.loading = false;
    });
  }

}
