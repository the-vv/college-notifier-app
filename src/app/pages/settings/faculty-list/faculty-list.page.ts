import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { ModalController } from '@ionic/angular';
import { UsersImportComponent } from 'src/app/shared/users-import/users-import.component';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.page.html',
  styleUrls: ['./faculty-list.page.scss'],
})
export class FacultyListPage implements OnInit {

  public facultiesData: IUser[] = [];

  constructor(
    public collegeService: CollegeService,
    public modalController: ModalController,
    public userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.userService.getUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id)
      .subscribe(data => {
        this.facultiesData = data;
        console.log(data);
      }, err => {
        this.commonService.showToast(err.error.message);
      })
  }

  async showImportFacultyModal() {
    const modal = await this.modalController.create({
      component: UsersImportComponent,
      backdropDismiss: false,
      componentProps: {
        role: EUserRoles.faculty,
        collegeId: this.collegeService.currentCollege$.value._id
      }
    });
    modal.present();
  }

}
