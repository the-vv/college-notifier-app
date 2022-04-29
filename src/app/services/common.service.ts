import { Injectable } from '@angular/core';
import {
  initBreakpoints,
  getBreakpointsBroadcast,
  getCurrentBreakpoint,
} from 'media-breakpoints-watcher';
import { BehaviorSubject } from 'rxjs';
import { EBreakPoints, EUserRoles } from '../interfaces/common.enum';
import { EStrings } from '../interfaces/strings.enum';
import { HttpService } from './http.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as XLSX from 'xlsx';
import { NgPluralizeService } from 'ng-pluralize';

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
    private router: Router,
    private authServce: AuthService,
    private alertCtrl: AlertController,
    private pluralize: NgPluralizeService
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
    this.router.navigate(['/success'], { replaceUrl: true });
  }

  async showLoading(message: string = `${EStrings.loading}, ${EStrings.pleaseWait}`) {
    const loader = await this.loadingController.create({
      message,
      spinner: 'dots'
    });
    loader.present();
    return loader;
  }

  goToDashboard() {
    if (this.authServce.currentUser$.value.role === EUserRoles.superAdmin) {
      this.router.navigate(['/admin'], { replaceUrl: true });
    } else {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }

  showToast(message: string) {
    Toast.show({
      text: message,
      duration: 'long',
    });
  }

  showAlert(title: string, message: string, buttons: any[] = [{ text: EStrings.ok }]) {
    this.alertCtrl.create({
      header: title,
      message,
      buttons
    }).then(alert => alert.present());
  }

  showOkCancelAlert(title: string, message: string, okText: string = EStrings.ok, cancelText: string = EStrings.cancel) {
    return new Promise<boolean>((resolve, reject) => {
      this.alertCtrl.create({
        header: title,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: okText,
            handler: () => {
              resolve(true);
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }

  uploadFiles(files: any) {
    return this.http.postAsync(files, [this.commonApiEndPoint, 'upload-files'].join('/'));
  }

  deleteFiles(urls: string[]) {
    return this.http.postAsync({ urls }, [this.commonApiEndPoint, 'delete-files'].join('/'));
  }

  readExcelFile(file: any) {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  toLocaleIsoDateString(date: Date) {
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num: any) => ((num < 10 ? '0' : '') + num);
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
  }

  getPluralWord(word: string) {
    if (!word) { return ''; }
    return this.pluralize.pluralize(word);
  }

  getSingularWord(word: string) {
    if (!word) { return ''; }
    return this.pluralize.singularize(word);
  }

  getPluralWordWithCount(word: string, count: number) {
    if (!word) { return count + ''; }
    return this.pluralize.fromCount(word, count, true);
  }


}

