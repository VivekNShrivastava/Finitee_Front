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
  
  addOrUpdateEcard(eCardData: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.ECARD_ROLODEX.ADD_OR_UPDATE_ECARD,eCardData).subscribe(
        (response: any) => {
          this.commonService.hideLoader();
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.ECARD_UPDATED);
          resolve(response.ResponseData); // Adjust based on your API response structure
        },
        (error) => {
          this.commonService.hideLoader();
          console.log("Error:", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

}
