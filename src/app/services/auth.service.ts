import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../interfaces/commons-interfaces';
import { HttpService } from './http.service';
import { Storage } from '@capacitor/storage';
import { EStorageKeys } from '../interfaces/commons-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$: BehaviorSubject<IUser | null> = new BehaviorSubject(null);
  private authAPiUrl = 'api/auth';

  constructor(
    private httpService: HttpService
  ) {
    Storage.get({ key: EStorageKeys.user }).then(user => {
      if (user.value) {
        this.currentUser$.next(JSON.parse(user.value));
        console.log(this.currentUser$.value);
      }
    });
  }

  saveUser(user: IUser) {
    this.currentUser$.next(user);
    Storage.set({
      key: EStorageKeys.user,
      value: JSON.stringify(user)
    });
  }

  loginAsync(email: string, password: string): Observable<IUser> {
    return this.httpService.postAsync({ email, password }, [this.authAPiUrl, 'login'].join('/'));
  };

  sugnupAsync(user: IUser): Observable<IUser> {
    return this.httpService.postAsync(user, [this.authAPiUrl, 'signup'].join('/'));
  }

}
