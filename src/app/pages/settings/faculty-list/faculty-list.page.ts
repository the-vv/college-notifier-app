import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { ModalController } from '@ionic/angular';
import { UsersImportComponent } from 'src/app/shared/users-import/users-import.component';
import { EUserRoles } from 'src/app/interfaces/common.enum';


@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.page.html',
  styleUrls: ['./faculty-list.page.scss'],
})
export class FacultyListPage implements OnInit {

  public facultiesData: IUser[] = [];

  constructor(
    public collegeService: CollegeService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
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

  onFileChoose($event) {
    
  }

}
