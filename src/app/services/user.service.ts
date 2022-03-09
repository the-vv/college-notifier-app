import { Injectable } from '@angular/core';
import { EUserRoles } from '../interfaces/common.enum';
import { IUser } from '../interfaces/common.model';
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
}
