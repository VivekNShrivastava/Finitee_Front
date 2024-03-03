import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { EventItem } from '../../models/event/event';
import { APIService } from '../api.service';
import { User } from '../../models/user/UserProfile';
import { CommonResponse } from '../../models/CommonResponse';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegularSearchService {


  constructor(private http: HttpClient,
    public apiService: APIService,
    public commonService: CommonService) { }


  //get all events
  regularSearch(title:any, keyWord: string) {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.API.SEARCH.SEARCH_UPDATE + "/" + title  + "/" + keyWord, {}).subscribe((response: any) => {
        resolve(response);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //userSearch
  RegSearchUsers(title:any, keyWord: string, UserTypeId: Number){
    const body = {
      searchKey: keyWord,
      searchUserType: UserTypeId
    }

    return new Promise<any>((resolve, reject) => {
      return this.http.post<any>(config.API.SEARCH.SEARCH_UPDATE + "/" + title, body).subscribe((response: any) => {
        console.log(response.ResponseData);
        resolve(response);
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
