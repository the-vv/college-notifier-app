import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment, IRoom, ISource } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomUrl = 'api/room';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IRoom): Observable<IRoom> {
    return this.http.postAsync(data, this.roomUrl);
  }

  putAsync(data: IRoom): Observable<IRoom> {
    return this.http.putAsync(data, this.roomUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IRoom[]> {
    return this.http.getAsync(`${this.roomUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IRoom> {
    return this.http.getAsync(`${this.roomUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IRoom> {
    return this.http.getAsync(`${this.roomUrl}/getByAdmin/${id}`);
  }

}
