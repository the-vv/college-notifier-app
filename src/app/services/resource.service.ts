import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResource, IResourceSchedule } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resourceUrl = 'api/resource';
  private scheduleUrl = 'api/resourceSchedule';

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

  deleteAsync(id: string): Observable<IResource> {
    return this.http.deleteByIdAsync(this.resourceUrl, id);
  }

  getScheduleAsync(id: string): Observable<IResourceSchedule> {
    return this.http.getAsync(`${this.scheduleUrl}/${id}`);
  }

  postScheduleAsync(data: IResourceSchedule): Observable<IResourceSchedule> {
    return this.http.postAsync(data, this.scheduleUrl);
  }

  putScheduleAsync(data: IResourceSchedule): Observable<IResourceSchedule> {
    return this.http.putAsync(data, this.scheduleUrl);
  }

  deleteScheduleAsync(id: string): Observable<IResourceSchedule> {
    return this.http.deleteByIdAsync(this.scheduleUrl, id);
  }

  getScheduleByResourceAsync(id: string): Observable<IResourceSchedule> {
    return this.http.getAsync(`${this.scheduleUrl}/getByResource/${id}`);
  }

  getScheduleByDateRangeAsync(collegeId: string, start: string | Date, end: string | Date): Observable<IResourceSchedule[]> {
    return this.http.postAsync({college: collegeId, start, end}, `${this.scheduleUrl}/getByDateRange`);
  }

  checkResourceyAvailabilityAsync(resourceId: string, start: string, end: string): Observable<{
    available: boolean;
    schedules?: IResourceSchedule[];
  }> {
    return this.http.postAsync({ start, end }, `${this.scheduleUrl}/availability/${resourceId}`);
  }

}
