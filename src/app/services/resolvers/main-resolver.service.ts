import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MainResolverService {

  constructor(
    private authService: AuthService
  ) { }

  //TODO: add user verification with user id

  init() {
    return new Promise((resolve, reject) => {
      this.authService.initAuth().then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
