import { Injectable } from '@angular/core';
import {
  initBreakpoints,
  getBreakpointsBroadcast,
  getCurrentBreakpoint,
} from 'media-breakpoints-watcher';
import { BehaviorSubject } from 'rxjs';
import { EBreakPoints } from '../interfaces/commons-enum';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public breakPointChanges$: BehaviorSubject<EBreakPoints> = new BehaviorSubject<EBreakPoints>(getCurrentBreakpoint());

  constructor() {
    initBreakpoints({
      medium: '(min-width: 768px)',
      small: '(min-width: 0px)'
    });
    const breakpointsBroadcast = getBreakpointsBroadcast();
    breakpointsBroadcast.subscribe((val: EBreakPoints) => this.breakPointChanges$.next(val));
  }
}
