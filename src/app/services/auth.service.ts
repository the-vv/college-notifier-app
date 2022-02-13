import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../interfaces/commons-interfaces';
import { HttpService } from './http.service';
import { Storage } from '@capacitor/storage';
import { EStorageKeys } from '../interfaces/commons-enum';
import { Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { EStrings } from '../interfaces/strings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$: BehaviorSubject<IUser | null> = new BehaviorSubject(null);
  public isLoggedIn: boolean;
  private authAPiUrl = 'api/auth';

  constructor(
    private httpService: HttpService,
    private router: Router
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

  onLogin(user: any) {
    if(!(user.user && user.token)) {
      return;
    }
    this.isLoggedIn = true;
    this.saveUser(user?.user);
    Storage.set({
      key: EStorageKeys.token,
      value: user.token
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.currentUser$.next(null);
    Storage.remove({ key: EStorageKeys.user });
    Storage.remove({ key: EStorageKeys.token });
    this.httpService.getAsync([this.authAPiUrl, 'logout'].join('/'))
    .subscribe(_ => {
      this.router.navigate(['/auth']);
    }, _ => {
      Toast.show({
        text: [EStrings.error + ':', , EStrings.logout].join(' '),
      });
    });
  }

  loginAsync(email: string, password: string): Observable<any> {
    return this.httpService.postAsync({ email, password }, [this.authAPiUrl, 'login'].join('/'));
  };

  signupAsync(user: IUser): Observable<any> {
    return this.httpService.postAsync(user, [this.authAPiUrl, 'signup'].join('/'));
  }

}
