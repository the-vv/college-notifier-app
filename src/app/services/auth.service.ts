/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBatch, IClass, ICollege, IDepartment, IUser, IUserMap } from '../interfaces/common.model';
import { HttpService } from './http.service';
import { Storage } from '@capacitor/storage';
import { ECustomUserRoles, EStorageKeys, EUserRoles } from '../interfaces/common.enum';
import { Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { EStrings } from '../interfaces/strings.enum';
import { UserService } from './user.service';
import { CollegeService } from './college.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserRole: string;
  public currentUser$: BehaviorSubject<IUser | null> = new BehaviorSubject(null);
  public isLoggedIn: boolean;
  public currentUserMap$: BehaviorSubject<IUserMap> = new BehaviorSubject(null);
  // public isAdmin = false;
  private authAPiUrl = 'api/auth';
  private collegeService: CollegeService;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private userService: UserService,
    private config: ConfigService
  ) {
  }
  get isSuperAdmin(): boolean {
    return this.currentUserRole === EUserRoles.superAdmin;
  }

  public setCollegeService(collegeService: CollegeService) {
    this.collegeService = collegeService;
  }

  initAuth(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Storage.get({ key: EStorageKeys.user }).then(user => {
        if (user.value) {
          this.isLoggedIn = true;
          this.currentUser$.next(JSON.parse(user.value));
          this.currentUserRole = this.currentUser$.value.role;
        }
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }



  saveUser(user: IUser) {
    this.currentUser$.next(user);
    this.currentUserRole = user.role;
    Storage.set({
      key: EStorageKeys.user,
      value: JSON.stringify(user)
    });
  }

  onLogin(user: any) {
    if (!(user.user && user.token)) {
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
    this.currentUserRole = null;
    Storage.remove({ key: EStorageKeys.user });
    Storage.remove({ key: EStorageKeys.token });
    this.router.navigate(['/auth'], { replaceUrl: true });
    this.httpService.getAsync([this.authAPiUrl, 'logout'].join('/'))
      .subscribe(_ => {
      }, _ => {
        Toast.show({
          text: [EStrings.error + ':', EStrings.logout].join(' '),
        });
      });
  }

  loginAsync(email: string, password: string): Observable<any> {
    return this.httpService.postAsync({ email, password }, [this.authAPiUrl, 'login'].join('/'));
  };

  signupAsync(user: IUser): Observable<any> {
    return this.httpService.postAsync(user, [this.authAPiUrl, 'signup'].join('/'));
  }

  doUserLogin(userId: string) {
    return new Promise<IUserMap>((resolve, reject) => {
      this.userService.getUserMapByUserIdAsync(userId).subscribe((userMap: IUserMap) => {
        // console.log(userMap);
        this.currentUserMap$.next(userMap);
        this.collegeService.currentCollege$.next(userMap.source.college as ICollege);
        // console.log(this.collegeService.currentCollege$.value);
        if (!userMap) {
          this.router.navigate(['/auth/signup', 'join-college'], { replaceUrl: true });
        } else if (userMap.active === false) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          const user = userMap.user;
          const map = userMap;
          this.config.isAdmin = ((map.source.college as ICollege).admins as string[]).includes((user as IUser)._id) ||
            (user as IUser).role === EUserRoles.admin;
          this.config.departmentAdmin = ((map.source.department as IDepartment)?.admins as string[])?.includes((user as IUser)._id);
          this.config.batchAdmin = ((map.source.batch as IBatch)?.admins as string[])?.includes((user as IUser)._id);
          this.config.classAdmin = ((map.source.class as IClass)?.admins as string[])?.includes((user as IUser)._id);
          this.config.isHOD = (user as IUser).customRoles.includes(ECustomUserRoles.hod);
          if (!this.router.url.includes('dashboard')) {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
          console.log(JSON.parse(JSON.stringify(this.config)));
        }
        resolve(userMap);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

}
