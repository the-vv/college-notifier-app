import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBatch, IClass } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private classUrl = 'api/class';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IClass): Observable<IClass> {
    return this.http.postAsync(data, this.classUrl);
  }

  putAsync(data: IClass): Observable<IClass> {
    return this.http.putAsync(data, this.classUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IClass[]> {
    return this.http.getAsync(`${this.classUrl}/getByCollege/${collegeId}`);
  }

  getByDepartmentAsync(departmentId: string, collegeId: string): Observable<IClass[]> {
    return this.http.getAsync(`${this.classUrl}/getByDepartment`, { departmentId, collegeId });
  }

  getByBatchAsync(batchId: string, departmentId: string, collegeId: string): Observable<IClass[]> {
    return this.http.getAsync(`${this.classUrl}/getByDepartment`, { departmentId, collegeId, batchId });
  }

  getByIdAsync(id: string): Observable<IClass> {
    return this.http.getAsync(`${this.classUrl}/${id}`);
  }

  getByAdminIdAsync(id: string): Observable<IClass> {
    return this.http.getAsync(`${this.classUrl}/getByAdmin/${id}`);
  }

  getActiveClassesByDepartmentAsync(collegeId: string, departmentId: string): Observable<IClass[]> {
    return this.http.getAsync(`${this.classUrl}/getActiveByDepartment/${collegeId}/${departmentId}`);
  }

}
