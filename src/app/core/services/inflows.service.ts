import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InflowsService {

  constructor(private http: HttpClient) { }
  getInflows(data: any) {
    return this.http.post<any>(environment.baseUrl + 'finitee/GetPostListInInflows', data)
  }
}
