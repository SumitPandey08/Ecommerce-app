import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }


  getData<T>(endpoint: string , params?: HttpParams | { [params:string]:string | string[]}):Observable<T> {

  if (params instanceof HttpParams) {
    return this.http.get<T>(endpoint, { params });
  } else {
    return this.http.get<T>(endpoint, { params: new HttpParams({ fromObject: params }) });
  }
}

postData<T>(endpoint: string, body: any): Observable<T> {
  return this.http.post<T>(endpoint, body);
}

}
