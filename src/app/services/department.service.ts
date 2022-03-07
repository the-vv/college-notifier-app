import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private collegeUrl = 'api/department';

  constructor(
    private http: HttpService
  ) { }

  
  postAsync(data: IDepartment): Observable<IDepartment> {
    return this.http.postAsync(data, this.collegeUrl);
  }

  putAsync(data: IDepartment): Observable<IDepartment> {
    return this.http.putAsync(data, this.collegeUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IDepartment[]> {
    return this.http.getAsync(`${this.collegeUrl}/getByCollege'/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IDepartment> {
    return this.http.getAsync(`${this.collegeUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IDepartment> {
    return this.http.getAsync(`${this.collegeUrl}/getByAdmin/${id}`);
  }

}
