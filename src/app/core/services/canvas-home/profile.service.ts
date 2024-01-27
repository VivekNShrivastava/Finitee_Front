import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  canvasData: Subject<any> = new Subject();

  isConnectToBusiness: boolean = false;
  ConnectionRequest: any = null;

  constructor(private http: HttpClient, private commonService: CommonService,) { }

  //get free user profile
  getUserProfile(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.GET + "/" + loggedInUserId;
      if (userId != loggedInUserId)
        url = config.API.USER_PROFILE.GET + "/" + userId;
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

  getUserDetailsAsPrivacy(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.GETUSERDETAILSASPRIVACY + "/" + loggedInUserId;
      if (userId != loggedInUserId)
        url = config.API.USER_PROFILE.GETUSERDETAILSASPRIVACY + "/" + userId;
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

  getUserCanvas(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.GETUSERCANVAS + "/" + loggedInUserId;
      if (userId != loggedInUserId)
        url = config.API.USER_PROFILE.GETUSERCANVAS + "/" + userId;
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

  saveEducationProfile(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();

      var url: any;
      if (body.Id == undefined) {
        url = config.API.USER_PROFILE.EDUCATION.SAVE
      } else {
        url = config.API.USER_PROFILE.EDUCATION.UPDATE
      }
      this.http.post<any>(url, body).subscribe((response: any) => {
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

  AddUserWork(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();

      var url: any;
      if (body.Id == undefined) {
        url = config.API.USER_PROFILE.WORK.SAVE
      } else {
        url = config.API.USER_PROFILE.WORK.UPDATE
      }
      this.http.post<any>(url, body).subscribe((response: any) => {
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
  AddUserContact(body: any) {
    return new Promise<any>((resolve, reject) => {
      console.log("body", body);
      this.commonService.showLoader();
      var url;
      if (body?.Id) {
        url = config.API.USER_PROFILE.CONTACT.UPDATE
      } else {
        url = config.API.USER_PROFILE.CONTACT.SAVE
      }
      this.http.post<any>(url, body).subscribe((response: any) => {
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

  DeleteUserWork(workExperienceId: string) {

    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(config.API.USER_PROFILE.WORK.DELETE + "/" + workExperienceId).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.WORK_DELETED);
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

  DeleteUserEducation(educationId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(config.API.USER_PROFILE.EDUCATION.DELETE + "/" + educationId).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.EDUCATION_DELETED);
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


  updateUserStats(userId: any) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.USER_PROFILE.STATS.UPDATE + "/" + userId;
      this.http.post<any>(url, {}).subscribe((response: any) => {
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
