import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Product } from 'src/app/core/models/product/product';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import * as config from 'src/app/core/models/config/ApiMethods';
import * as _ from 'lodash';
import { CommonService } from '../common.service';
import { Announcement } from '../../models/announcement/announcement';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BusinessCanvasService {

  businessData: Subject<any> = new Subject();


  constructor(private http: HttpClient, private commonService: CommonService) { }


  //save buisness user profile
  saveBusinessUserProfile(body: any) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      this.http.post<any>(config.API.USER_PROFILE.SAVE, body).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PROFILE_UPDATED);
        resolve(true);
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

  //product
  getProductList(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.BUSINESS.PRODUCT.GET_ALL;
      if (userId != loggedInUserId)
        url = config.API.BUSINESS.PRODUCT.GET_ALL + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
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

  //get product by productid
  getProductByProductId(productId: number) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.get<any>(config.API.BUSINESS.PRODUCT.GET + "/" + productId).subscribe((response: any) => {
        //this.commonService.hideLoader();
        resolve(response.ResponseData);
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

  saveProduct(product: Product) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.BUSINESS.PRODUCT.SAVE, product).subscribe((response: any) => {
        this.commonService.hideLoader();
        if (product.Id == "")
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PRODUCT_CREATED);
        else
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PRODUCT_UPDATED);
        resolve(response.ResponseData.ProductId);
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

  deleteProduct(productId: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.delete<any>(config.API.BUSINESS.PRODUCT.DELETE + "/" + productId).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.PRODUCT_DELETED);
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

  //save menulist

  getMenuItemList(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.BUSINESS.MENU_IETM.GET;
      if (userId != loggedInUserId)
        url = config.API.BUSINESS.MENU_IETM.GET + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
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

  saveMenuItem(body: any) {
    return new Promise<any>((resolve) => {
      this.commonService.showLoader();
      this.http.post<any>(config.API.BUSINESS.MENU_IETM.SAVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  deleteMenuItem(menuItemId: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      this.http.delete<any>(config.API.BUSINESS.MENU_IETM.DELETE + "/" + menuItemId).subscribe((response: any) => {
        this.commonService.hideLoader();
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


  //announcement
  getAnnouncement(userId: string, loggedInUserId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.BUSINESS.ANNOUNCEMENT.GET;
      if (userId != loggedInUserId)
        url = config.API.BUSINESS.ANNOUNCEMENT.GET + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
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
  //save announcement
  saveAnnouncement(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.BUSINESS.ANNOUNCEMENT.SAVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.ANNOUNCEMENT_UPDATED);
        resolve(response.ResponseData.Id);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          //this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  enableDisableAnnouncement(announcementId: any, status: any) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.put<any>(config.API.BUSINESS.ANNOUNCEMENT.STATUS + "/" + announcementId + "/" + status, {}).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.ANNOUNCEMENT_DISABLE);
        resolve(true);
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

  //endorsement
  endorsementAction(businessUserId: string) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.BUSINESS.ENDORSE_BUISNESS + "/" + businessUserId, {}).subscribe((response: any) => {
        //this.commonService.hideLoader();
        resolve(true);
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
