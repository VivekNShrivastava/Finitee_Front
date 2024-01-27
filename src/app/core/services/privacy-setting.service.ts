import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPrivacySetting } from '../models/UserPrivacySetting';
import { AuthService } from './auth.service';
import { config } from '../models/index';
import { CommonResponse } from '../models/CommonResponse';
import { CommonService } from './common.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';



@Injectable({
  providedIn: 'root'
})
export class PrivacySettingService {
  public privacySettings: UserPrivacySetting = <UserPrivacySetting>{};
  constructor(
    private _authService: AuthService,
    private http: HttpClient,
    private commonService: CommonService
  ) {
    _authService.authState.subscribe(state => {
      if (state) {
        this.loadPrivacySettings();
      }
    })
  }

  private loadPrivacySettings(): void {
    this.http.get<CommonResponse<UserPrivacySetting>>(config.GET_PRIVACY_SETTING)
      .subscribe(settings => {
        this.privacySettings = <UserPrivacySetting>settings.ResponseData;
      });
  }

  updateUserPrivacySettings(traitOrProductId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var url = config.API.USER_PROFILE.PRIVACY_SETTING.UPDATE_USER_TYPE + "/" + traitOrProductId;
      return this.http.post<any>(url, traitOrProductId).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(response.ResponseData);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  updateBeamPrivacy(traitOrProductId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.PRIVACY_SETTING.UPDATE_BEAM + "/" + traitOrProductId;
      return this.http.post<any>(url, traitOrProductId).subscribe((response: any) => {
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

  chatRecievePrivacy(traitOrProductId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.PRIVACY_SETTING.RECEIVE_CHAT + "/" + traitOrProductId;
      return this.http.post<any>(url, traitOrProductId).subscribe((response: any) => {
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