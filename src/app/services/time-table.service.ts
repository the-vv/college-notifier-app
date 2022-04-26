import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimeTableSchedule } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  private timeTableUrl = 'api/timeTable';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: ITimeTableSchedule): Observable<ITimeTableSchedule> {
    return this.http.postAsync(data, this.timeTableUrl);
  }

  putAsync(data: ITimeTableSchedule): Observable<ITimeTableSchedule> {
    return this.http.putAsync(data, this.timeTableUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<ITimeTableSchedule[]> {
    return this.http.getAsync(`${this.timeTableUrl}/getByCollege/${collegeId}`);
  }

  getByDepartmentAsync(departmentId: string): Observable<ITimeTableSchedule[]> {
    return this.http.getAsync(`${this.timeTableUrl}/getByDepartment/${departmentId}`);
  }

  getByIdAsync(id: string): Observable<ITimeTableSchedule> {
    return this.http.getAsync(`${this.timeTableUrl}/${id}`);
  }

  deleteAsync(id: string): Observable<ITimeTableSchedule> {
    return this.http.deleteByIdAsync(this.timeTableUrl, id);
  }

}
