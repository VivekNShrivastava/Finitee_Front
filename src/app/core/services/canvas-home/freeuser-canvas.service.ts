import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
import { resolve } from 'dns';
import { reject } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class FreeUserCanvasService {
  canvasData: Subject<any> = new Subject();

  isConnectToBusiness: boolean = false;
  ConnectionRequest: any = null;

  constructor(private http: HttpClient, private commonService: CommonService,) { }

  //save buisness user profile
  saveUserProfile(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.post<any>(config.API.USER_PROFILE.SAVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PROFILE_UPDATED);
        resolve(true);
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

  editPersonal(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.post<any>(config.API.USER_PROFILE.EDITPERSONAL, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PROFILE_UPDATED);
        resolve(true);
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

  saveUserImgAbt(UserProfileImgAbt: any){
    return  new Promise<any>( (resolve, reject) => {
      this.commonService.showLoader();
      this.http.post<any>(config.API.USER_PROFILE.SAVEIMGABT, UserProfileImgAbt).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PROFILE_UPDATED);
        resolve(true);
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
  }
