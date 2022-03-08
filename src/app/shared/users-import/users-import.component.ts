import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-import',
  templateUrl: './users-import.component.html',
  styleUrls: ['./users-import.component.scss'],
})
export class UsersImportComponent implements OnInit {

  @Input() role: string;
  @Input() collegeId: string;

  public fileUrl: string = `${environment.baseUrl}/excel/user.xlsx`;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
