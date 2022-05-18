/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ECustomUserRoles, EUserRoles } from '../interfaces/common.enum';
import { IBatch, IClass, ICollege, IDepartment, IUser, IUserMap } from '../interfaces/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public readonly commonDateTimeFormat = 'd/M/yy h:mm a';
  public readonly commonLongDateTimeFormat = 'MMM d, y, h:mm:ss a';
  public readonly commonDateFormat = 'M/d/y';
  public readonly commonLongDateFormat = 'MMM d, y';
  public readonly commonTimeFormat = 'h:mm:ss a';
  public readonly userDefaultPassword = '123456';

  public isAdmin = false;
  public isHOD = false;
  public departmentAdmin = false;
  public batchAdmin = false;
  public classAdmin = false;
  public currentUsermap: IUserMap = null;


  public currentCollege$: BehaviorSubject<ICollege | null> = new BehaviorSubject(null);

  constructor() { }
  setUserMap(userMap: IUserMap) {
    const user = userMap.user;
    const map = userMap;
    this.currentUsermap = map;
    this.isAdmin = ((map.source.college as ICollege).admins as string[]).includes((user as IUser)._id) ||
      (user as IUser).role === EUserRoles.admin;
    this.departmentAdmin = ((map.source.department as IDepartment)?.admins as string[])?.includes((user as IUser)._id);
    this.batchAdmin = ((map.source.batch as IBatch)?.admins as string[])?.includes((user as IUser)._id);
    this.classAdmin = ((map.source.class as IClass)?.admins as string[])?.includes((user as IUser)._id);
    this.isHOD = (user as IUser).customRoles.includes(ECustomUserRoles.hod);
  }
}
