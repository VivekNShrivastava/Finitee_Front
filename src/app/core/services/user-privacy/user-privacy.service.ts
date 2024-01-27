import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { AppConstants } from '../../models/config/AppConstants';
import { UserPrivacySetting } from '../../models/user-privacy/UserPrivacyDTO';
@Injectable({
  providedIn: 'root'
})
export class UserPrivacyService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getUserPrivacySetting() {
    return new Promise<UserPrivacySetting>((resolve, reject) => {
      return this.http.get<any>(config.API.USER_PROFILE.PRIVACY_SETTING.GET).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {

          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  saveUserPrivacySetting(body: UserPrivacySetting) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.USER_PROFILE.PRIVACY_SETTING.SAVE, body).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PS_SAVED);
        resolve(response.ResponseData.PostId);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }


}
