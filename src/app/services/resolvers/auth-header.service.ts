import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { EStorageKeys } from 'src/app/interfaces/commons-enum';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHeaderService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getToken(req).pipe(mergeMap(newReq => next.handle(newReq)));
  }

  getToken(req) {
    return new Observable<HttpRequest<any>>((observer) => {
      Storage.get({ key: EStorageKeys.token })
        .then((token) => {
          const cloneReq = req.clone({
            headers: new HttpHeaders({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: `Bearer ${token.value}`
            })
          });
          observer.next(cloneReq);
        });
    });
  }
}
