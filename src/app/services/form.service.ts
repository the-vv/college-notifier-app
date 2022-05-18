import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IForm, ISource, IUserMap } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private formUrl = 'api/form';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IForm): Observable<IForm> {
    return this.http.postAsync(data, this.formUrl);
  }

  putAsync(data: IForm): Observable<IForm> {
    return this.http.putAsync(data, this.formUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IForm[]> {
    return this.http.getAsync(`${this.formUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IForm> {
    return this.http.getAsync(`${this.formUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IForm> {
    return this.http.getAsync(`${this.formUrl}/getByAdmin/${id}`);
  }

  getBySourceAndUserAsync(source: ISource): Observable<IForm[]> {
    return this.http.postAsync(source, `${this.formUrl}/getBySourceAndUser`);
  }

  getByUserMapAsync(map: IUserMap): Observable<IForm[]> {
    return this.http.postAsync(map, `${this.formUrl}/getByMap`);
  }

  // getByUserMapAsync(map: IUserMap): Observable<IForm[]> {
  //   return this.http.postAsync(map, `${this.notificationUrl}/getByMap`);
  // }

  deleteAsync(id: string): Observable<IForm> {
    return this.http.deleteByIdAsync(this.formUrl, id);
  }

}
