import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../interfaces/commons-interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: BehaviorSubject<IUser | null> = new BehaviorSubject(null);
  private authAPiUrl = 'api/auth';

  constructor(
    private httpService: HttpService
  ) { }

  loginAsync(email: string, password: string): Observable<IUser> {
    return this.httpService.postAsync({ email, password }, [this.authAPiUrl, 'login'].join('/'));
  };

  sugnupAsync(user: IUser): Observable<IUser> {
    return this.httpService.postAsync(user, [this.authAPiUrl, 'signup'].join('/'));
  }

}
