import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  postAsync(body: any, endpoint: string): Observable<any> {
    return this.http.post<any>([this.baseUrl, endpoint].join('/'), body, {
      withCredentials: true
    });
  }

  putAsync(body: any, endpoint: string): Observable<any> {
    return this.http.put<any>([this.baseUrl, endpoint].join('/'), body, {
      withCredentials: true
    });
  }

  putByIdAsync(endpoint: string, id: string, body: any): Observable<any> {
    return this.http.put<any>([this.baseUrl, endpoint, id].join('/'), body, {
      withCredentials: true
    });
  }

  getAsync(endpoint: string, queryParams?: any): Observable<any> {
    return this.http.get<any>([this.baseUrl, endpoint].join('/'), {
      withCredentials: true,
      params: queryParams
    });
  }

  deleteByIdAsync(endpoint: string, id: string): Observable<any> {
    return this.http.delete<any>([this.baseUrl, endpoint, id].join('/'), {
      withCredentials: true
    });
  }

  getByIdAsync(endpoint: string, id: string): Observable<any> {
    return this.http.get<any>([this.baseUrl, endpoint, id].join('/'), {
      withCredentials: true
    });
  }



}
