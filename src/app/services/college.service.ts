import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { EStorageKeys } from '../interfaces/common.enum';
import { ICollege } from '../interfaces/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  public currentCollege$: BehaviorSubject<ICollege | null> = new BehaviorSubject(null);
  private collegeUrl = 'api/college';

  constructor(
    private http: HttpService
  ) {
    Storage.get({ key: EStorageKeys.college }).then(college => {
      if (college.value) {
        this.currentCollege$.next(JSON.parse(college.value));
      }
    });
  }

  getCurrentCollege(): ICollege {
    return this.currentCollege$.value;
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

}
