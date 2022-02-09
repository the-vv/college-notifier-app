import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
  ){}

  postAsync(body: any, endpoint: string): Observable<any> {
    return this.http.post<any>([this.baseUrl, endpoint].join('/'), body, {
      withCredentials: true
    });
  }

  putAsync(body, endpoint: string): Observable<any> {
    return this.http.put<any>([this.baseUrl, endpoint].join('/'), body, {
      withCredentials: true
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
