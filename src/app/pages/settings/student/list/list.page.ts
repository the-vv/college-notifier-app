import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { IUser } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { UsersImportComponent } from 'src/app/shared/users-import/users-import.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class StudentListPage implements OnInit {

  public studentsData: IUser[] = [];

  constructor(
    public collegeService: CollegeService,
    public modalController: ModalController,
    public userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getStudents();
  }

  async getStudents() {
    const loader = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id, EUserRoles.student)
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
        role: EUserRoles.student,
        collegeId: this.collegeService.currentCollege$.value._id
      }
    });
    modal.onWillDismiss().then(() => {
      this.getStudents();
    });
    modal.present();
  }

}
