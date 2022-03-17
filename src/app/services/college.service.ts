import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { ERequestStatus, EStorageKeys } from '../interfaces/common.enum';
import { ICollege } from '../interfaces/common.model';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  public currentCollege$: BehaviorSubject<ICollege | null> = new BehaviorSubject(null);
  private collegeUrl = 'api/college';

  constructor(
    private http: HttpService,
    private authService: AuthService
  ) {
    Storage.get({ key: EStorageKeys.college }).then(college => {
      if (college.value) {
        this.currentCollege$.next(JSON.parse(college.value));
      }
    });
    this.authService.currentUser$.subscribe(user => {
      if(!user) {
        this.currentCollege$.next(null);
      }
    });
  }

  saveCollege(college: ICollege) {
    this.currentCollege$.next(college);
    Storage.set({
      key: EStorageKeys.college,
      value: JSON.stringify(college)
    });
  }

  postAsync(data: ICollege): Observable<ICollege> {
    return this.http.postAsync(data, this.collegeUrl);
  }

  putAsync(data: ICollege): Observable<ICollege> {
    return this.http.putAsync(data, this.collegeUrl);
  }

  getAllCollegeAsync(): Observable<ICollege[]> {
    return this.http.getAsync(this.collegeUrl);
  }

  getByIdAsync(id: string): Observable<ICollege> {
    return this.http.getAsync(`${this.collegeUrl}/${id}`);
  }

  approveRejectAsync(id: string, status: ERequestStatus): Observable<ICollege> {
    return this.http.putByIdAsync([this.collegeUrl, 'approveReject'].join('/'), id, { status });
  }

  getByAdminIdAsync(id: string): Observable<ICollege> {
    return this.http.getAsync(`${this.collegeUrl}/getByAdmin/${id}`);
  }

  private getCurrentCollege(): ICollege {
    return this.currentCollege$.value;
  }
}
