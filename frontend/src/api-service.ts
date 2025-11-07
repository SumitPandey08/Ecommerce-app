import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }


  getData<T>(endpoint: string , params?: HttpParams | { [params:string]:string | string[]}):Observable<T> {

  if (params instanceof HttpParams) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  } else {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: new HttpParams({ fromObject: params }) });
  }
}

postData<T>(endpoint: string, body: any): Observable<T> {
  return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
}

verifyOtp<T>(data: any): Observable<T> {
    return this.postData<T>('users/verify', data);
}

resendOtp<T>(data: any): Observable<T> {
    return this.postData<T>('users/resend-otp', data);
}

}
