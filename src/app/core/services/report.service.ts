import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from './common.service';
import { genricReport, userReport } from '../models/report';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient, private commonService: CommonService) { }

  genricReport(body: genricReport) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.GENERIC_REPORT, body).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REPORT);
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

  userReport(body: userReport) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.REPORT_USER, body).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REPORT);
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