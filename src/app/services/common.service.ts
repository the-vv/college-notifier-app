import { Injectable } from '@angular/core';
import {
  initBreakpoints,
  getBreakpointsBroadcast,
  getCurrentBreakpoint,
} from 'media-breakpoints-watcher';
import { BehaviorSubject } from 'rxjs';
import { EBreakPoints } from '../interfaces/commons-enum';
import { EStrings } from '../interfaces/strings';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public breakPointChanges$: BehaviorSubject<EBreakPoints> = new BehaviorSubject<EBreakPoints>(getCurrentBreakpoint());
  successMessageTitle: string = EStrings.success;
  successMessageDescription: string = EStrings.done;

  constructor() {
    initBreakpoints({
      medium: '(min-width: 768px)',
      small: '(min-width: 0px)'
    });
    const breakpointsBroadcast = getBreakpointsBroadcast();
    breakpointsBroadcast.subscribe((val: EBreakPoints) => this.breakPointChanges$.next(val));
  }

  showSuccessPage(title: string, description: string, showContinueButton: boolean = false) {
    this.successMessageTitle = title;
    this.successMessageDescription = description;
  }
}
