import { Injectable } from '@angular/core';
import { ESourceTargetType, EUserRoles } from '../interfaces/common.enum';
import { ISource, IUserMap } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'api/users';
  private userMapUrl = 'api/userMap';
  private userRoomMapUrl = 'api/roomUserMap';

  constructor(
    private http: HttpService,
  ) { }

  postUsersAsync(data: any) {
    return this.http.postAsync(data, `${this.userUrl}/multiple`);
  }

  postUserAsync(data: any) {
    return this.http.postAsync(data, this.userUrl);
  }

  putUserAsync(data: any) {
    return this.http.putAsync(data, this.userUrl);
  }

  deleteUserAsync(id: string) {
    return this.http.deleteByIdAsync(this.userUrl, id);
  }

  getUserByCollegeIdAsync(collegeId: string, role: EUserRoles) {
    return this.http.getAsync(`${this.userMapUrl}/getByCollege/${collegeId}`, { role });
  }

  getBySourceAsync(sourceType: ESourceTargetType, sourceId: string, role: EUserRoles) {
    return this.http.getAsync(`${this.userMapUrl}/${sourceType}/${sourceId}`, { role });
  }

  postUserMapsAsync(maps: IUserMap[]) {
    return this.http.postAsync(maps, `${this.userMapUrl}/multiple`);
  }

  postUserRoomMapsAsync(maps: IUserMap[]) {
    return this.http.postAsync(maps, `${this.userRoomMapUrl}/multiple`);
  }

  getUsersByRoomIdAsync(roomId: string, role: EUserRoles) {
    return this.http.getAsync(`${this.userRoomMapUrl}/${roomId}`, { role });
  }

  deleteMultipleRoomUsersMapAsync(roomId: string, userId: string[]) {
    return this.http.deleteMultipleAsync(`${this.userRoomMapUrl}/multiple/${roomId}`, userId);
  }

}
