import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormSubmission } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionService {

  private notificationUrl = 'api/formSubmission';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IFormSubmission): Observable<IFormSubmission> {
    return this.http.postAsync(data, this.notificationUrl);
  }

  putAsync(data: IFormSubmission): Observable<IFormSubmission> {
    return this.http.putAsync(data, this.notificationUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.notificationUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IFormSubmission> {
    return this.http.getAsync(`${this.notificationUrl}/${id}`);
  }

  getByUserIdAsync(id: string): Observable<IFormSubmission> {
    return this.http.getAsync(`${this.notificationUrl}/getByUser/${id}`);
  }

  getByFormIdAsync(id: string): Observable<IFormSubmission> {
    return this.http.getAsync(`${this.notificationUrl}/getByForm/${id}`);
  }

  getByFormIdAnduserIdAsync(formId: string, userId: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.notificationUrl}/getByFormAnduser/${formId}/${userId}`);
  }

  deleteAsync(id: string): Observable<IFormSubmission> {
    return this.http.deleteByIdAsync(this.notificationUrl, id);
  }

}
