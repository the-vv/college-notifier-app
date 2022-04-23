import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ECustomUserRoles, ESourceTargetType } from 'src/app/interfaces/common.enum';
import { ISource, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss'],
})
export class UserManageComponent implements OnInit {

  @Input() role: string;
  @Input() collegeId: string;
  @Input() userId: string;

  @ViewChild(ImageUploadComponent) imageUploader: ImageUploadComponent;

  userForm: FormGroup;
  showErrors = false;
  loading = false;
  customRoles = Object.keys(ECustomUserRoles).map(key => ({ name: key, value: ECustomUserRoles[key] }));
  eCustomUserRoles = ECustomUserRoles;


  constructor(
    private modalController: ModalController,
    private commonServicce: CommonService,
    public alertController: AlertController,
    private userService: UserService,
    private config: ConfigService
  ) { }

  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      role: new FormControl(this.role, [Validators.required]),
      customRole: new FormControl([]),
      active: new FormControl(true),
      image: new FormControl('')
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  async onSubmit() {
    console.log(this.userForm.value);
    try {
      this.loading = true;
      await this.imageUploader.uploadImage();
    }
    catch (err) {
      this.loading = false;
      return;
    }
    if (!this.userId) {
      const postData: { user: IUser; source: ISource } = {
        user: this.userForm.value,
        source: {
          college: this.collegeId,
          source: ESourceTargetType.college,
        }
      };
      this.userService.postUserAsync(postData)
        .subscribe(res => {
          this.commonServicce.showToast(`${EStrings[this.role]} ${EStrings.added}`);
          this.modalController.dismiss();
        }, err => {
          console.log(err);
          this.commonServicce.showToast(`${EStrings.error}: ${EStrings.users} ${EStrings.create} ${EStrings.failed},
              ${(err.error.message as string).includes('duplicate key error') ? EStrings.userAlreadyExists : err.error.message}`);
          // this.modalController.dismiss();
        });
    }
  }

}
