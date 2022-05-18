import { Component, OnInit } from '@angular/core';
import { ECustomUserRoles, EUserRoles } from 'src/app/interfaces/common.enum';
import { IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  public studentsData: IUser[] = [];
  public currentRole: EUserRoles;
  public eCustomRles: ECustomUserRoles;
  public exportColumns = [
    {
      header: EStrings.name,
      field: 'name',
    },
    {
      header: EStrings.email,
      field: 'email',
    },
    {
      header: EStrings.role,
      field: 'role',
    },
    {
      header: EStrings.customRoles,
      field: 'customRoles',
    },
  ];

  constructor(
    public collegeService: CollegeService,
    public userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  async getUsers() {
    const loader = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.userService.getAllusersAsync()
      .subscribe(data => {
        loader.dismiss();
        this.studentsData = data;
      }, err => {
        loader.dismiss();
        this.commonService.showToast(err.error.message);
      });
  }

  getCustommRoles(cRoles: string[]) {
    if(!cRoles.length) { return; }
    return cRoles.map(role => EStrings[role]).join(', ');
  }

}
