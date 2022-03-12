import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment, ISource } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private dptUrl = 'api/department';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IDepartment): Observable<IDepartment> {
    return this.http.postAsync(data, this.dptUrl);
  }

  putAsync(data: IDepartment): Observable<IDepartment> {
    return this.http.putAsync(data, this.dptUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IDepartment[]> {
    return this.http.getAsync(`${this.dptUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IDepartment> {
    return this.http.getAsync(`${this.dptUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IDepartment> {
    return this.http.getAsync(`${this.dptUrl}/getByAdmin/${id}`);
  }

}
