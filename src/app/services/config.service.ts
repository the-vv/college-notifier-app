import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public readonly commonDateTimeFormat  = 'd/M/yy h:mm a';
  public readonly commonLongDateTimeFormat  = 'MMM d, y, h:mm:ss a';
  public readonly commonDateFormat = 'M/d/y';
  public readonly commonTimeFormat = 'h:mm:ss a';
  public readonly userDefaultPassword = '123456';

  constructor() { }
}
