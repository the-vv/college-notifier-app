import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ECustomUserRoles, EUserRoles } from 'src/app/interfaces/common.enum';
import { IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { UserManageComponent } from 'src/app/shared/user-manage/user-manage.component';
import { UsersImportComponent } from 'src/app/shared/users-import/users-import.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class StudentListPage implements OnInit {

  public studentsData: IUser[] = [];
  public currentRole: EUserRoles;
  public eCustomRles: ECustomUserRoles;

  constructor(
    public collegeService: CollegeService,
    public modalController: ModalController,
    public userService: UserService,
    public commonService: CommonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.currentRole = this.route.snapshot.params.role;
    this.getUsers();
  }

  async getUsers() {
    const loader = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, this.currentRole)
      .subscribe(data => {
        loader.dismiss();
        this.studentsData = data;
      }, err => {
        loader.dismiss();
        this.commonService.showToast(err.error.message);
      });
  }

  async showImportFacultyModal() {
    const modal = await this.modalController.create({
      component: UsersImportComponent,
      backdropDismiss: false,
      componentProps: {
        role: this.currentRole,
        collegeId: this.collegeService.currentCollege$.value._id
      }
    });
    modal.onWillDismiss().then(() => {
      this.getUsers();
    });
    modal.present();
  }

  async openStudentCreateModal(user?: IUser) {
    const modal = await this.modalController.create({
      component: UserManageComponent,
      backdropDismiss: false,
      componentProps: {
        role: this.currentRole,
        collegeId: this.collegeService.currentCollege$.value._id,
        user
      }
    });
    modal.onWillDismiss().then(() => {
      this.getUsers();
    });
    modal.present();
  }

  deleteStudent(user: IUser) {
    this.commonService.showAlert(`${EStrings.confirm} ${EStrings.delete}`,
      `${EStrings.areYouSureWantToDelete} ${EStrings.user.toLowerCase()} '${user.name}'?`,
      [
        {
          text: EStrings.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: EStrings.delete,
          handler: () => {
            this.userService.deleteUserAsync(user._id)
            .subscribe(() => {
              this.getUsers();
            }, err => {
              this.commonService.showToast(err.error.message);
            });
          }
        }
      ]);
  }

  getCustommRoles(cRoles: string[]) {
    if(!cRoles.length) { return; }
    return cRoles.map(role => EStrings[role]).join(', ');
  }

}
