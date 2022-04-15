import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IForm, ISource } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private notificationUrl = 'api/form';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IForm): Observable<IForm> {
    return this.http.postAsync(data, this.notificationUrl);
  }

  putAsync(data: IForm): Observable<IForm> {
    return this.http.putAsync(data, this.notificationUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IForm[]> {
    return this.http.getAsync(`${this.notificationUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IForm> {
    return this.http.getAsync(`${this.notificationUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IForm> {
    return this.http.getAsync(`${this.notificationUrl}/getByAdmin/${id}`);
  }

  getBySourceAndUserAsync(source: ISource): Observable<IForm[]> {
    return this.http.postAsync(source, `${this.notificationUrl}/getBySourceAndUser`);
  }

  getByUserIdAsync(id: string): Observable<IForm[]> {
    return this.http.getAsync(`${this.notificationUrl}/getByUser/${id}`);
  }

  deleteAsync(id: string): Observable<IForm> {
    return this.http.deleteByIdAsync(this.notificationUrl, id);
  }

}
