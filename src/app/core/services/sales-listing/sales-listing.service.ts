import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { SalesItem } from '../../models/sales-item/sales-item';
import { ShoppingListWord } from '../../models/sales-item/shopping-list-word';
@Injectable({
  providedIn: 'root'
})
export class SalesListingService {
  salesItemList: Array<SalesItem> = [];
  shoppingListWords: Array<ShoppingListWord> = [];
  shoppingWordsMatchesList: Array<SalesItem> = [];

  id: any = '';
  checkoutURL: any = "https://checkout.razorpay.com/v1/checkout.js";
  razorPay_key_id: any = "rzp_test_3ke9v1gPtBvvNY";
  razorPay_secret_Key: any = "fJJmQWNX3rHyfD2bsryPh0hJ";

  constructor(private http: HttpClient, private commonService: CommonService) { }

  //create event
  createSLItem(body: any) {
    return new Promise<any>((resolve, reject) => {
      // if (body.SalesItemImages.length > 5) {
      //   this.commonService.presentToast('Select maximum 5 picture/videos.');
      //   return reject(false);
      // }
      // else {
      this.commonService.showLoader();
      return this.http.post<any>(config.CREATE_SL, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SL_CREATED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
      // }
    });
  }

  //update event
  updateSLItem(body: any) {
    return new Promise<any>((resolve, reject) => {
      // if (body.SalesItemImages.length == 0) {
      //   this.commonService.presentToast(AppConstants.TOAST_MESSAGES.NO_MEDIA_SELECTED);
      //   return reject(false);
      // }
      // else {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPD_SL, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SALE_UPDATED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
      // }
    });
  }

  //update event
  deleteSLItem(Id: number) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(config.DEL_SL + "/" + Id).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SALE_DELETED);
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

  //get all sales Item
  getAllSalesItemByUser() {
    return new Promise<any>((resolve) => {
      //this.commonService.showLoader();

      return this.http.get<any>(config.GET_ALL_SL_BY_USR).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.salesItemList = response.ResponseData;
        resolve(true);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  //get event by eventid
  getSalesItemBySlId(Id: number) {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.GET_SL_BY_ID + "/" + Id).subscribe((response: any) => {
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


  razorPayOrderId(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>('https://api.razorpay.com/v1/orders', body).subscribe((response: any) => {
        console.log("response=-------------------->", response);
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

  // shopping list

  // get shopping list words
  getShoppingListWords() {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.GET_SHOPPING_LIST_WORDS).subscribe((response: any) => {
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

  // update shopping list words
  updateShoppingListWords(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPDATE_SHOPPING_LIST_WORDS, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SHOPPING_LIST_UPDATED);
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
  // get matching shopping list
  getMatchedShoppingList() {
    return new Promise<any>((resolve) => {
      this.commonService.showLoader();
      return this.http.get<any>(config.GET_MATCHING_SHOPPING_LIST).subscribe((response: any) => {
        this.commonService.hideLoader();
        
        resolve(response.ResponseData);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

}
