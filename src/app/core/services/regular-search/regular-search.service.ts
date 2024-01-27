import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { EventItem } from '../../models/event/event';
import { APIService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class RegularSearchService {


  constructor(private http: HttpClient,
    public apiService: APIService,
    public commonService: CommonService) { }


  //get all events
  regularSearch() {
    return new Promise<any>((resolve, reject) => {
      return this.http.post<any>(config.API.SEARCH.REGULAR_SEARCH, {}).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

}
