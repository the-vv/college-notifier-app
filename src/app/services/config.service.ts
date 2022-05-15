import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICollege } from '../interfaces/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public readonly commonDateTimeFormat  = 'd/M/yy h:mm a';
  public readonly commonLongDateTimeFormat  = 'MMM d, y, h:mm:ss a';
  public readonly commonDateFormat = 'M/d/y';
  public readonly commonLongDateFormat =  'MMM d, y';
  public readonly commonTimeFormat = 'h:mm:ss a';
  public readonly userDefaultPassword = '123456';

  public isAdmin = false;
  public isHOD = false;
  public departmentAdmin = false;
  public batchAdmin = false;
  public classAdmin = false;

  public currentCollege$: BehaviorSubject<ICollege | null> = new BehaviorSubject(null);

  constructor() { }
}
