import { Injectable } from '@angular/core';
import {
  initBreakpoints,
  getBreakpointsBroadcast,
  getCurrentBreakpoint,
} from 'media-breakpoints-watcher';
import { BehaviorSubject } from 'rxjs';
import { EBreakPoints } from '../interfaces/common.enum';
import { EStrings } from '../interfaces/strings.enum';
import { HttpService } from './http.service';
import { LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public breakPointChanges$: BehaviorSubject<EBreakPoints> = new BehaviorSubject<EBreakPoints>(null);
  public successMessageTitle: string = EStrings.success;
  public successMessageDescription: string = EStrings.done;
  private commonApiEndPoint = 'api/common';

  constructor(
    private http: HttpService,
    public loadingController: LoadingController,
    private router: Router
  ) {
    initBreakpoints({
      medium: '(min-width: 768px)',
      small: '(min-width: 0px)'
    });
    const breakpointsBroadcast = getBreakpointsBroadcast();
    breakpointsBroadcast.subscribe((val: EBreakPoints) => this.breakPointChanges$.next(val));
    this.breakPointChanges$.next(getCurrentBreakpoint());
  }

  showSuccessPage(title: string, description: string, showContinueButton: boolean = false) {
    this.successMessageTitle = title;
    this.successMessageDescription = description;
    this.router.navigate(['/success'], {replaceUrl: true});
  }

  async showLoading(message: string = `${EStrings.loading}, ${EStrings.pleaseWait}`) {
    const loader = await this.loadingController.create({
      message: message,
      spinner: 'dots'
    });
    loader.present();
    return loader;
  }

  showToast(message: string) {
    Toast.show({
      text: message,
      duration: 'long',
    });
  }

  uploadFiles(files: any) {
    return this.http.postAsync(files, [this.commonApiEndPoint, 'upload-files'].join('/'));
  }

  deleteFiles(urls: string[]) {
    return this.http.postAsync({ urls }, [this.commonApiEndPoint, 'delete-files'].join('/'));
  }
}

