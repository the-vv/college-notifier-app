import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: BehaviorSubject<any> = new BehaviorSubject(null);
  private authAPiUrl = 'api/auth';

  constructor(
    private httpService: HttpService
  ) { }

  login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}
