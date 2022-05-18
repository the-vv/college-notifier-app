import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormSubmission } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionService {

  private formSubmissionUrl = 'api/formSubmission';

  constructor(
    private http: HttpService
  ) { }

  postAsync(data: IFormSubmission): Observable<IFormSubmission> {
    return this.http.postAsync(data, this.formSubmissionUrl);
  }

  putAsync(data: IFormSubmission): Observable<IFormSubmission> {
    return this.http.putAsync(data, this.formSubmissionUrl);
  }

  getByCollegeAsync(collegeId: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.formSubmissionUrl}/getByCollege/${collegeId}`);
  }

  getByIdAsync(id: string): Observable<IFormSubmission> {
    return this.http.getAsync(`${this.formSubmissionUrl}/${id}`);
  }

  getByUserIdAsync(id: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.formSubmissionUrl}/getByUser/${id}`);
  }

  getByFormIdAsync(id: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.formSubmissionUrl}/getByForm/${id}`);
  }

  getByFormIdAnduserIdAsync(formId: string, userId: string): Observable<IFormSubmission[]> {
    return this.http.getAsync(`${this.formSubmissionUrl}/getByFormAnduser/${formId}/${userId}`);
  }

  deleteAsync(id: string): Observable<IFormSubmission> {
    return this.http.deleteByIdAsync(this.formSubmissionUrl, id);
  }

}
