import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INotification, ISource, IUserMap } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationUrl = 'api/notification';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: INotification): Observable<INotification> {
    return this.http.postAsync(data, this.notificationUrl);
  }

  putAsync(data: INotification): Observable<INotification> {
    return this.http.putAsync(data, this.notificationUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<INotification[]> {
    return this.http.getAsync(`${this.notificationUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<INotification> {
    return this.http.getAsync(`${this.notificationUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<INotification> {
    return this.http.getAsync(`${this.notificationUrl}/getByAdmin/${id}`);
  }

  getBySourceAndUserAsync(source: ISource): Observable<INotification[]> {
    return this.http.postAsync(source, `${this.notificationUrl}/getBySourceAndUser`);
  }

  getByUserMapAsync(map: IUserMap): Observable<INotification[]> {
    return this.http.postAsync(map, `${this.notificationUrl}/getByMap`);
  }

  deleteAsync(id: string): Observable<INotification> {
    return this.http.deleteByIdAsync(this.notificationUrl, id);
  }

}
