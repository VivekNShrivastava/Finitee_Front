import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from '../common.service';
import { EventItem } from '../../models/event/event';
import { FiniteeUser } from '../../models/user/FiniteeUser';

@Injectable({
  providedIn: 'root'
})
export class InflowsService {


  constructor(private http: HttpClient, private commonService: CommonService) { }


  startStopRecivingInflows(userOrProductId: any, startOrStop: any) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.put<any>(config.API.INFLOWS.START_STOP_INFLOWS + "/" + userOrProductId + "/" + startOrStop, {}).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(response.ResponseData['Message']);
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

  getInflows(InflowsType: any, userTypeId: Number) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.get<any>(config.API.INFLOWS.GET_INFLOWS + "/" + InflowsType + "/" + userTypeId).subscribe((response: any) => {
        //this.commonService.hideLoader();

        resolve(response.ResponseData.postList);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve([]);
        }
      );
    });
  }

}
