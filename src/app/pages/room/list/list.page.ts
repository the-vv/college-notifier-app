import { Component, OnInit } from '@angular/core';
import { IRoom, IUser } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { DepartmentService } from 'src/app/services/department.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class RoomListPage implements OnInit {

  roomsData: IRoom[] = [];

  constructor(
    public collegeService: CollegeService,
    private roomServce: RoomService,
    private commonService: CommonService,
    public config: ConfigService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getRooms();
  }

  async getRooms() {
    const laoding = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.roomServce.getByCollegeAsync(this.collegeService.currentCollege$.value?._id)
      .subscribe((res) => {
        laoding.dismiss();
        console.log(res);
        this.roomsData = res;
      }, err => {
        laoding.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  getAdminNames(room: IRoom) {
    return( room.admins as IUser[]).map((admin) => admin.name).join(', ');
  }

}
