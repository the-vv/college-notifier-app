import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { Subscription } from 'rxjs';
import { EBreakPoints, EPrivacyType, ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IRoom, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-room-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class RoomManagePage implements OnInit, OnDestroy {

  public isUpdate = false;
  public roomId: string;
  public ePrivacyType = EPrivacyType;
  public availableFaculties: IUser[] = [];
  public currentBreakPoint: EBreakPoints;
  public showErrors = false;
  public roomForm: FormGroup;
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private collegeService: CollegeService,
    private roomService: RoomService
  ) { }

  get f() { return this.roomForm.controls; }
  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.roomForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: [''],
      admins: [[], [Validators.required]],
      private: [false, [Validators.required]]
    });
  }

  async ionViewWillEnter() {
    this.roomId = this.activatedRoute.snapshot.params.id;
    if (this.roomId) {
      this.isUpdate = true;
      const loading = await this.commonService.showLoading();
      this.roomService.getByIdAsync(this.roomId).subscribe((res: IRoom) => {
        loading.dismiss();
        this.roomForm.patchValue({
          name: res.name,
          description: res.description,
          image: res.image,
          admins: (res.admins as IUser[])?.map((val: IUser) => val._id),
          private: res.private
        });
        console.log(this.roomForm.value);
      }, (err) => {
        loading.dismiss();
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.availableFaculties = res?.map((val: IUser) => ({...val, userName: `${val.name} (${val.email})`}));
      }, err => {
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onSubmit() {
    console.log(this.roomForm.value);
    this.showErrors = true;
    this.roomForm.markAllAsTouched();
    if (this.roomForm.invalid) {
      return;
    }
    /* eslint no-underscore-dangle: 0 */
    const room = this.roomForm.value as IRoom;
    this.loading = true;
    if (this.isUpdate) {
      room._id = this.roomId;
      this.roomService.putAsync(room).subscribe((res: IRoom) => {
        this.loading = false;
        this.router.navigate(['/room/list'], { replaceUrl: true });
      }, (err: any) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
    else {
      room.active = true;
      room.createdAt = new Date();
      room.createdBy = this.authService.currentUser$.value._id;
      room.source = {
        college: this.collegeService.currentCollege$.value._id,
        source: ESourceTargetType.college
      };
      this.roomService.postAsync(room).subscribe((res: IRoom) => {
        this.loading = false;
        this.router.navigate(['/room/list'], { replaceUrl: true });
      }, (err) => {
        this.loading = false;
        Toast.show({
          text: [EStrings.error + ':', err.error.message].join(' '),
        });
      });
    }
  }

  ionViewWillLeave(): void {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
