import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints} from 'src/app/interfaces/common.enum';
import { IResource } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ResourceService } from 'src/app/services/resource.service';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';

@Component({
  selector: 'app-resource-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ResourceManagePage implements OnInit, OnDestroy {

  @ViewChild(ImageUploadComponent) imageUpload: ImageUploadComponent;
  public currentBreakPoint: EBreakPoints;
  public resourceForm: FormGroup;
  public showErrors = false;
  public loading = false;
  public isUpdate = false;
  public resourceId: string;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private resourceService: ResourceService,
    private activatedRoute: ActivatedRoute
  ) { }

  get f() { return this.resourceForm.controls; }

  async ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.resourceForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: ['']
    });
    this.resourceId = this.activatedRoute.snapshot.params.id;
    if (this.resourceId) {
      this.isUpdate = true;
      const loader = await this.commonService.showLoading();
      this.resourceService.getByIdAsync(this.resourceId).subscribe((res: IResource) => {
        loader.dismiss();
        this.resourceForm.patchValue(res);
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
    this.resourceForm.markAllAsTouched();
    if (this.resourceForm.invalid) {
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
    const resource = this.resourceForm.value as IResource;
    this.loading = true;
    if (this.isUpdate) {
      resource._id = this.resourceId;
      this.resourceService.putAsync(resource).subscribe((res: IResource) => {
        this.loading = false;
        this.router.navigate(['/dashboard/resources'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
    else {
      resource.active = true;
      resource.college = this.collegeService.currentCollege$.value._id;
      this.resourceService.postAsync(resource).subscribe((res: IResource) => {
        this.loading = false;
        this.router.navigate(['/dashboard/resources'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
      });
    }
  }

}
