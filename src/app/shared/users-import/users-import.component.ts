import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ESourceTargetType, EUserRoles } from 'src/app/interfaces/common.enum';
import { ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-import',
  templateUrl: './users-import.component.html',
  styleUrls: ['./users-import.component.scss'],
})
export class UsersImportComponent implements OnInit {

  @Input() role: string;
  @Input() collegeId: string;

  public fileUrl = `${environment.baseUrl}/excel/user.xlsx`;

  public userData: IUser[] = [];

  constructor(
    private modalController: ModalController,
    private commonServicce: CommonService,
    public alertController: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }


  onFileChoose(event: any) {
    this.commonServicce.readExcelFile(event.target.files[0])
      .then((data: any) => {
        if (!('Name' in data[0] && 'Email' in data[0])) {
          this.alertController.create({
            header: EStrings.error,
            message: EStrings.excelErrorText,
            buttons: ['OK']
          }).then(alert => alert.present());
          return;
        }
        (data as any[]).forEach(user => {
          user.active = true;
          user.password = '12345678';
          user.role = this.role;
          user.name = user.Name;
          user.email = user.Email;
          delete user.Name;
          delete user.Email;
        });
        this.userData = data;
        const postData: { users: IUser[]; source: ISource } = {
          users: this.userData,
          source: {
            college: this.collegeId,
            source: ESourceTargetType.college,
          }
        };
        this.userService.postUsersAsync(postData)
          .subscribe(res => {
            this.commonServicce.showToast(`${EStrings.users} ${EStrings.imported}`);
            this.modalController.dismiss();
          }, err => {
            console.log(err);
            this.commonServicce.showToast(`${EStrings.error}: ${EStrings.users} ${EStrings.import} ${EStrings.failed},
              ${(err.error.message as string).includes('duplicate key error') ? EStrings.duplicateFoundText : err.error.message}`);
            this.modalController.dismiss();
          });
      }).catch(() => {
        this.alertController.create({
          header: EStrings.error,
          message: EStrings.excelErrorText,
          buttons: ['OK']
        }).then(alert => alert.present());
      });
  }
}
