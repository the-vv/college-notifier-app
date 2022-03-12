import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBatch } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private batchUrl = 'api/batch';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IBatch): Observable<IBatch> {
    return this.http.postAsync(data, this.batchUrl);
  }

  putAsync(data: IBatch): Observable<IBatch> {
    return this.http.putAsync(data, this.batchUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IBatch[]> {
    return this.http.getAsync(`${this.batchUrl}/getByCollege/${collegeId}`);
  }

  getByDepartmentAsync(departmentId: string, collegeId: string): Observable<IBatch[]> {
    return this.http.getAsync(`${this.batchUrl}/getByDepartment`, { departmentId, collegeId });
  }

  getByIdAsync(id: string): Observable<IBatch> {
    return this.http.getAsync(`${this.batchUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IBatch> {
    return this.http.getAsync(`${this.batchUrl}/getByAdmin/${id}`);
  }

}
