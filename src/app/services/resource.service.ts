import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResource } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resourceUrl = 'api/resource';

  constructor(
    private http: HttpService,
  ) { }

  getAllAsync(): Observable<IResource[]> {
    return this.http.getAsync(this.resourceUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IResource[]> {
    return this.http.getAsync(`${this.resourceUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IResource> {
    return this.http.getAsync(`${this.resourceUrl}/${id}`);
  }

  postAsync(data: IResource): Observable<IResource> {
    return this.http.postAsync(data, this.resourceUrl);
  }

  putAsync(data: IResource): Observable<IResource> {
    return this.http.putAsync(data, this.resourceUrl);
  }

}
