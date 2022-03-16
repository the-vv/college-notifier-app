import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INotification } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private roomUrl = 'api/notification';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: INotification): Observable<INotification> {
    return this.http.postAsync(data, this.roomUrl);
  }

  putAsync(data: INotification): Observable<INotification> {
    return this.http.putAsync(data, this.roomUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<INotification[]> {
    return this.http.getAsync(`${this.roomUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<INotification> {
    return this.http.getAsync(`${this.roomUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<INotification> {
    return this.http.getAsync(`${this.roomUrl}/getByAdmin/${id}`);
  }

}
