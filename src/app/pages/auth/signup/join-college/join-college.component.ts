/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ESourceTargetType } from 'src/app/interfaces/common.enum';
import { ICollege, IUserMap } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-join-college',
  templateUrl: './join-college.component.html',
  styleUrls: ['./join-college.component.scss'],
})
export class JoinCollegeComponent implements OnInit {

  collegesList: ICollege[] = [];

  constructor(
    private collegeService: CollegeService,
    private commonServce: CommonService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.collegeService.getAllCollegeAsync().subscribe(res => {
      this.collegesList = res;
      console.log(this.collegesList);
    }, err => {
      console.log(err);
      this.commonServce.showToast(`${EStrings.error}: ${err.error.message}`);
    });
  }

  joinCollege(collegeId: string) {
    const postData: IUserMap[] = [{
      user: this.authService.currentUser$.value._id,
      active: false,
      source: {
        source: ESourceTargetType.college,
        college: collegeId
      }
    }];
    this.userService.postUserMapsAsync(postData).subscribe(res => {
      console.log(res);
      this.commonServce.showToast(`${EStrings.college} ${EStrings.requested}`);
      // this.authService.currentUser$.next(res.user);
      console.log('calling user login');
      this.authService.doUserLogin(this.authService.currentUser$.value._id);
    }, err => {
      console.log(err);
      this.commonServce.showToast(`${EStrings.error}: ${err.error.message}`);
    });

  }

}
