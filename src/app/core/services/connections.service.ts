import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';
import { environment } from 'src/environments/environment';
import { AppConstants } from '../models/config/AppConstants';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private http: HttpClient, private commonService: CommonService) { }
  
  getUserConnections(userId?: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.GET_USER_CONN;
      if (userId)
        url = config.GET_USER_CONN + "/" + userId;
      var reqParams = {
        SearchKey: null
      }
      this.http.post<any>(url, reqParams).subscribe((response: any) => {
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

  sendConnectionRequest(userId: string, note: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var reqParams = {
        ToUserId: userId,
        RequestNote: note
      }
      this.http.post<any>(config.SEND_CONN_REQ, reqParams).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.CON_REQ_SENT);
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

  getConnectionRequest() {
    return new Promise<any>((resolve, reject) => {
      var url = config.GET_CONN_REQ;
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

  actionConnectionRequest(reqAcceptOrDecline: boolean, userId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var reqParams = {
        ToUserId: userId,
        AcceptOrReject: reqAcceptOrDecline
      }
      this.http.post<any>(config.ACC_DEC_CONN_REQ, reqParams).subscribe((response: any) => {
        this.commonService.hideLoader();
        if (reqAcceptOrDecline)
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_ACC);
        else
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_DEC);
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

  cancelConnectionRequest(reqAcceptOrDecline: boolean, userId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var reqParams = {
        ToUserId: userId,
        AcceptOrReject: reqAcceptOrDecline
      }
      this.http.post<any>(config.CANCEL_CONN_REQ + "/" + userId, "etc").subscribe((response: any) => {
        this.commonService.hideLoader();
        if (reqAcceptOrDecline)
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_ACC);
        else
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_DEC);
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

  getUserBlockList() {
    return new Promise<any>((resolve, reject) => {
      var url = config.GET_BLCK_USER;
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

  blockOrUnblockUser(action: any, userId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.GET_USER_CONN;
      var sMsg = ""
      if (action == "BLOCK") {
        url = config.BlCK_USER;
        sMsg = AppConstants.TOAST_MESSAGES.USER_BLOCKED;
      }
      else {
        url = config.UN_BlCK_USER;
        sMsg = AppConstants.TOAST_MESSAGES.USER_UNBLOCKED;
      }
      this.http.post<any>(url + "/" + userId, {}).subscribe((response: any) => {
        this.commonService.presentToast(sMsg);
        resolve(true);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  disconnectFromUser(userId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var reqParams = {
        ToUserId: userId,
      }
      this.http.post<any>(config.DISCONNECT_USER, reqParams).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.USER_DISCONNECT);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    })
  }

  referToConnections(userIds: string[], id: string, note: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      var reqParams = {
        InvitedUsers: userIds,
        referredUser: id,
        message: note
      }
      this.http.post<any>(config.referToConnections, reqParams).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.CON_REQ_SENT);
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
