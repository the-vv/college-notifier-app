/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBatch, IClass, IDepartment, ISource, IUser } from 'src/app/interfaces/common.model';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.page.html',
  styleUrls: ['./rooms-list.page.scss'],
})
export class RoomsListPage implements OnInit {

  currentMap: ISource;
  isDptAdmin = false;
  isBatchAdmin = false;

  constructor(
    public config: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.currentMap = this.config.currentUsermap.source;
    const user = this.config.currentUsermap.user as IUser;
    console.log(this.currentMap);
    if(this.currentMap.department) {
      if(((this.currentMap.department as IDepartment).admins as string[]).includes(user._id)) {
        this.isDptAdmin = true;
      }
      if(((this.currentMap.batch as IBatch).admins as string[]).includes(user._id)) {
        this.isBatchAdmin = true;
      }
    }
  }

  goToDepartment() {
    if (this.config.isAdmin) {
      this.router.navigate(['/', 'department', 'list']);
    } else if (this.currentMap.department) {
      this.router.navigate(['/', 'department', 'manage', (this.currentMap.department as IDepartment)._id]);
    }
  }

  goToBatch() {
    if (this.config.isAdmin || this.isDptAdmin) {
      this.router.navigate(['/', 'batch', 'list']);
    } else if (this.currentMap.batch) {
      this.router.navigate(['/', 'batch', 'manage', (this.currentMap.batch as IBatch)._id]);
    }
  }

  goToClass() {
    if (this.config.isAdmin || this.isBatchAdmin) {
      this.router.navigate(['/', 'class', 'list']);
    } else if(this.currentMap.class) {
      this.router.navigate(['/', 'class', 'manage', (this.currentMap.class as IClass)._id]);
    }
  }

}
