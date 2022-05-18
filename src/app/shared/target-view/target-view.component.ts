import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IBatch, IClass, IDepartment, IRoom, ITarget, IUser } from 'src/app/interfaces/common.model';

@Component({
  selector: 'app-target-view',
  templateUrl: './target-view.component.html',
  styleUrls: ['./target-view.component.scss'],
})
export class TargetViewComponent implements OnInit {

  @Input() public target: ITarget;
  @Input() public title: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getAllDpts() {
    return this.target.departments as IDepartment[];
  }

  getAllBatches() {
    return this.target.batches as IBatch[];
  }

  getAllClasses() {
    return this.target.classes as IClass[];
  }

  getAllRooms() {
    return this.target.rooms as IRoom[];
  }

  getAllUsers() {
    return this.target.users as IUser[];
  }

}
