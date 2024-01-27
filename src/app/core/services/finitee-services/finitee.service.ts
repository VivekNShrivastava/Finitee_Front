import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { SalesItem } from '../../models/sales-item/sales-item';
import {  FiniteeService, ServiceAlertWord } from '../../models/finitee-services/finitee.services';
import { ShoppingListWord } from '../../models/sales-item/shopping-list-word';

@Injectable({
  providedIn: 'root'
})
export class FiniteeServicesService {
  serviceList: Array<FiniteeService> = [];
  ServiceAlertWords: Array<ServiceAlertWord> = [];

  constructor(private http: HttpClient, private commonService: CommonService
     ) { }

  // SERVICE REQUIRED

  // Add 'service required' by user.
  AddServiceRequired(body: Object) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.CREATE_SERVICE_REQUIRED, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_REQUIRED_CREATED);
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

  // Get user's 'service required' with specific properties.
  getServiceRequiredByUserForList() {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(config.GET_SERVICE_REQ_BY_USER_FOR_LIST).subscribe((response: any) => {
        this.serviceList = response.ResponseData;
        resolve(true);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  // Get 'service required' by id.
  getServiceRequiredById(id: number) {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(`${config.GET_SERVICE_REQUIRED_BYID}/${id}`).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  // Update 'service required'.
  updateServiceRequired(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPDATE_SERVICE_REQUIRED, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_REQUIRED_UPDATED);
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

  // Delete 'service required' by id.
  deleteServiceRequiredById(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.delete<any>(`${config.DEL_SERVICE_REQUIRED_BYID}/${id}`).subscribe(
        (response: any) => {
          this.commonService.hideLoader();
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_REQUIRED_DELETED);
          resolve(true);
        },
        (error) => {
          this.commonService.hideLoader();
          console.log("Error:", error);
          const errorMessage = error.error?.text || AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG;
          this.commonService.presentToast(errorMessage);
          reject(false);
        }
      );
    });
  }

  // SERVICE AVAILABLE

  // Add 'service available' by user.
  AddServiceAvailable(body: Object) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.CREATE_SERVICE_AVAILABLE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_AVAILABLE_CREATED);
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

  // Get user's 'service available' with specific properties.
  getServiceAvailableByUserForList() {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(config.GET_SERVICE_AVA_BY_USER_FOR_LIST).subscribe((response: any) => {
        this.serviceList = response.ResponseData;
        resolve(true);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  // Get 'service available' by id.
  getServiceAvailableById(id: number) {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(`${config.GET_SERVICE_AVAILABLE_BYID}/${id}`).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  // Update 'service available'.
  updateServiceAvailable(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPDATE_SERVICE_AVAILABLE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_AVAILABLE_UPDATED);
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

  // Delete 'service available' by id.
  deleteServiceAvailableById(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.delete<any>(`${config.DEL_SERVICE_AVAILABLE_BYID}/${id}`).subscribe(
        (response: any) => {
          this.commonService.hideLoader();
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_AVAILABLE_DELETED);
          resolve(true);
        },
        (error) => {
          this.commonService.hideLoader();
          console.log("Error:", error);
          const errorMessage = error.error?.text || AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG;
          this.commonService.presentToast(errorMessage);
          reject(false);
        }
      );
    });
  }

  // SERVICE ALERT
  // Get user's 'service alert'.
  getServiceAlertByUser() {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(config.GET_SERVICE_ALERT_BY_USER).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  // Update 'service alert'.
  updateServiceAlertWords(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPDATE_SERVICE_ALERT, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_ALERT_UPDATED);
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
  
// delete service alert
  deleteServiceAlertById(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.delete<any>(`${config.DELE_SERVICE_ALERT}/${id}`).subscribe(
        (response: any) => {
          this.commonService.hideLoader();
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SERVICE_ALERT_DELETED);
          resolve(true);
        },
        (error) => {
          this.commonService.hideLoader();
          console.log("Error:", error);
          const errorMessage = error.error?.text || AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG;
          this.commonService.presentToast(errorMessage);
          reject(false);
        }
      );
    });
  }

  // Get Matched services.
  getServiceAlertMatched() {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(config.GET_SERVICE_MATCHED).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }
  // END


 


  // old code

  //get all service List By user id
  getAllSRorSLByUser() {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(config.GET_ALL_SR_OR_SA_BY_USR).subscribe((response: any) => {
        this.serviceList = response.ResponseData;
        resolve(true);
      },
        (error) => {
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  //update sr or sa
  updateSRorSA(body: any) {
    return new Promise<any>((resolve, reject) => {
      if (body.SalesItemImages.length == 0) {
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.NO_MEDIA_SELECTED);
        return reject(false);
      }
      else {
        this.commonService.showLoader();
        return this.http.post<any>(config.UPD_SR_OR_SA, body).subscribe((response: any) => {
          this.commonService.hideLoader();
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SL_UPDATED);
          resolve(true);
        },
          (error) => {
            this.commonService.hideLoader();
            console.log("abc error", error.error.text);
            this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
            reject(false);
          }
        );
      }
    });
  }

  //get event by eventid
  getSRorSLBySlId(Id: number) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.get<any>(config.GET_SR_OR_SA_BY_ID + "/" + Id).subscribe((response: any) => {
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

 

}
