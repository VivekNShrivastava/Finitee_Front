import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from '../../models/config/AppConstants';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ECardService {

  constructor(private http: HttpClient,private commonService: CommonService,) { }

  
  getEcard(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.ECARD_ROLODEX.GETECARD + "/" + loggedInUserId;
      if (userId != loggedInUserId)
        url = config.API.ECARD_ROLODEX.GETECARD + "/" + userId;
      this.http.get<any>(url).subscribe((response: any) => {
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
