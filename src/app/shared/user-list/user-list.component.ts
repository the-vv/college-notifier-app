/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Toast } from '@capacitor/toast';
import { ActionSheetController, AlertController, IonAccordionGroup } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, ICollege, IDepartment, IRoom, ISource, IUser, IUserMap } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  public sourceData: ISource;
  @Input() set source(value: ISource) {
    console.log(value);
    if (!value) { return; }
    this.sourceData = value;
    switch (value.source) {
      case ESourceTargetType.college:
        this.sourceId = (value.college as ICollege)._id;
        break;
      case ESourceTargetType.department:
        this.sourceId = (value.department as IDepartment)._id;
        break;
      case ESourceTargetType.batch:
        this.sourceId = (value.batch as IBatch)._id;
        break;
      case ESourceTargetType.class:
        this.sourceId = (value.class as IClass)._id;
        break;
      case ESourceTargetType.room:
        this.sourceId = (value.room as IRoom)._id;
        break;
      default:
        this.sourceId = null;
    }
  }

  @ViewChild('modal') public userModal: IonicSelectableComponent;
  @ViewChild(IonAccordionGroup) public accordionGroup: IonAccordionGroup;

  public allStudents: IUser[] = [];
  public allFaculties: IUser[] = [];
  public accordianLoading = false;
  public selectedUsers: IUser[] = [];
  public selectedModalUsers: string[] = [];
  public availableUsersToChoose: IUser[] = [];
  public sourceId: string;

  constructor(
    private userService: UserService,
    private collegeService: CollegeService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private commonService: CommonService,
  ) { }

  ngOnInit() { }


  loadStudents() {
    this.accordianLoading = true;
    this.userService.getBySourceAsync(this.sourceData.source, this.sourceId, EUserRoles.student)
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
    this.userService.getBySourceAsync(this.sourceData.source, this.sourceId, EUserRoles.faculty)
      .subscribe((res: IUser[]) => {
        this.accordianLoading = false;
        this.allFaculties = res?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
      }, err => {
        this.accordianLoading = false;
        console.log(err);
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onUserOpen(event: any) {
    this.selectedUsers = [];
    const accordian = event?.detail?.value;
    if (accordian === EUserRoles.student) {
      this.loadStudents();
    }
    else if (accordian === EUserRoles.faculty) {
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
        this.userService.getBySourceAsync(this.sourceData.source, this.sourceId, role)
          .subscribe((mapRes: IUser[]) => {
            this.userModal.hideLoading();
            const mapped = mapRes?.map((val: IUser) => ({ ...val, userName: `${val.name} (${val.email})` }));
            this.userModal.items = allUsers?.filter((val: any) => !mapped.find(mapVal => mapVal._id === val._id));
          }, err => {
            this.userModal.hideLoading();
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
    console.log(this.sourceData);
    if (this.sourceData.source === ESourceTargetType.room && unMap) {
      this.userService.deleteMultipleRoomUsersMapAsync(this.sourceId, users)
        .subscribe((res: any) => {
          this.commonService.showToast(`${EStrings.success}: ${EStrings.mapped}`);
          this.loadStudents();
          this.loadFaculties();
        }, err => {
          console.log(err);
          this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
        });
    } else {
      const postData: IUserMap[] = [];
      users.forEach((val: string) => {
        postData.push({
          user: val,
          source: {
            college: this.collegeService.currentCollege$.value._id,
            department: unMap ? undefined : (this.sourceData.department as IDepartment)?._id,
            batch: unMap ? undefined : (this.sourceData.batch as IBatch)?._id,
            class: unMap ? undefined : (this.sourceData.class as IClass)?._id,
            room: unMap ? undefined : (this.sourceData.room as IRoom)?._id,
            source: unMap ? ESourceTargetType.college : this.sourceData.source,
          }
        });
      });
      // this.loading = true;
      this.userService.postUserMapsAsync(postData)
        .subscribe((res: any) => {
          this.accordionGroup.value = undefined;
          this.selectedUsers = [];
          this.selectedModalUsers = [];
          // this.loading = false;
          Toast.show({
            text: [EStrings.successfully, EStrings.mapped].join(' '),
          });
        }, (err: any) => {
          // this.loading = false;
          Toast.show({
            text: [EStrings.error + ':', err.error.message].join(' '),
          });
        });
    }
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
                text: EStrings.cancel,
                role: 'cancel',
                id: 'cancel-button',
              }, {
                text: EStrings.removeMap,
                handler: () => {
                  this.submitUserMaps(this.selectedUsers.map(el => el._id), true);
                },
              }]
            });
            await alert.present();
          }
        },
        {
          text: `${EStrings.assign} ${EStrings.custom} ${EStrings.role}`,
          handler: () => {
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
