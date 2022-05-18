/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-access-request',
  templateUrl: './access-request.page.html',
  styleUrls: ['./access-request.page.scss'],
})
export class AccessRequestPage implements OnInit {

  userData: IUser[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private collegeService: CollegeService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.userService.getInactiveUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id)
      .subscribe(res => {
        this.userData = res;
        console.log(this.userData);
        this.loading = false;
      }, err => {
        this.loading = false;
        console.log(err);
      });
  }

  approveUser(userId: string) {
    this.loading = true;
    this.userService.approveUserByIdAsync(userId).subscribe(res => {
      console.log(res);
      this.userService.getInactiveUserByCollegeIdAsync(this.collegeService.currentCollege$.value._id)
        .subscribe(approveRes => {
          this.loading = false;
          this.userData = approveRes;
          console.log(this.userData);
          this.loading = false;
        }, err => {
          this.loading = false;
          console.log(err);
        });
    }, err => {
      this.loading = false;
      console.log(err);
    });
  }

}
