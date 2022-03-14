import { Injectable } from '@angular/core';
import { ESourceTargetType, EUserRoles } from '../interfaces/common.enum';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userUrl = 'api/users';
  private userMapUrl = 'api/userMap';

  constructor(
    private http: HttpService,
  ) { }

  postUsersAsync(data: any) {
    return this.http.postAsync(data, `${this.userUrl}/multiple`);
  }

  getUserByCollegeIdAsync(collegeId: string, role: EUserRoles) {
    return this.http.getAsync(`${this.userMapUrl}/college/${collegeId}`, { role });
  }

  getBySourceAsync(sourceType: ESourceTargetType, sourceId: string, role: EUserRoles) {
    return this.http.getAsync(`${this.userMapUrl}/${sourceType}/${sourceId}`, { role });
  }

}
