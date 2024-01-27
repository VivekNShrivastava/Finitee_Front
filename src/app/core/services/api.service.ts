import { Injectable } from '@angular/core';
import { CommonResponse } from 'src/app/core/models/CommonResponse';
import { Country } from '../models/places/Country';
import { CommonService } from './common.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { catchError, Observable, of } from 'rxjs';
import { State } from '../models/places/State';
import { City } from '../models/places/City';
import { IndividualUser } from '../models/user/IndividualUser';
import { BusinessUser } from '../models/user/BusinessUser';
import { NonProfitUser } from '../models/user/NonProfitUser';
import { BasicUser } from '../models/user/BasicUser';
import { AppConstants } from '../models/config/AppConstants';


@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(
    public commonService: CommonService,
  ) {
  }

  /** Get All Countries List */
  public getCountryList() {
    return this.commonService.http.get<CommonResponse<Country[]>>(config.GET_ALL_COUNTRIES)
      .pipe(catchError(this.handleError<any>('getCountryList')));
  }

  /** Get All States for selected countryId */
  public getStateList(countryId: number) {
    return this.commonService.http.get<CommonResponse<State[]>>(config.GET_ALL_STATES + "/" + countryId)
      .pipe(catchError(this.handleError<any>('getStateList')));
  }

  /** Get All Cities for selected stateId */
  public getCityList(stateId: number) {
    return this.commonService.http.get<CommonResponse<City[]>>(config.GET_ALL_CITIES + "/" + stateId)
      .pipe(catchError(this.handleError<any>('getCityList')));
  }

  public registerUser(data: any) {

    return this.commonService.http.post<CommonResponse<any>>(config.REGISTER, data)
      .pipe(catchError(this.handleError<any>('registerUser')));

    // if (data.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
    //   return this.registerIndividualUser(data);
    // }
    // else if (data.UserTypeId == AppConstants.USER_TYPE.BN_USER) {
    //   return this.registerBusinessUser(data);
    // }
    // else if (data.UserTypeId == AppConstants.USER_TYPE.NF_USER) {
    //   return this.registerNonProfitUser(data);
    // }
    // else {
    //   return this.registerIndividualUser(data);//TODO Manoj change need to handle Admin user
    // }
  }

  public registerIndividualUser(data: IndividualUser) {
    return this.commonService.http.post<CommonResponse<any>>(config.FREEMEM_REG, data)
      .pipe(catchError(this.handleError<any>('registerIndividualUser')));
  }

  public registerBusinessUser(data: BusinessUser) {
    return this.commonService.http.post<CommonResponse<any>>(config.BUSMEM_REG, data)
      .pipe(catchError(this.handleError<any>('registerBusinessUser')));
  }

  public registerNonProfitUser(data: NonProfitUser) {
    return this.commonService.http.post<CommonResponse<any>>(config.NONPMEM_REG, data)
      .pipe(catchError(this.handleError<any>('registerNonProfitUser')));
  }

  public sendRegisterPhoneOTP(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.SEND_REG_OTP, data)
      .pipe(catchError(this.handleError<any>('sendRegisterPhoneOTP')));
  }

  public verifyRegisterPhoneOTP(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.VER_REG_OTP, data)
      .pipe(catchError(this.handleError<any>('verifyRegisterPhoneOTP')));
  }

  // public sendRegisterEmailOTP(data: any) {
  //   return this.commonService.http.post<CommonResponse<any>>(config.SEND_REG_EMAIL_OTP, data)
  //   .pipe(catchError(this.handleError<any>('sendRegisterEmailOTP')));
  // }

  // public verifyRegisterEmailOTP(data: any) {
  //   return this.commonService.http.post<CommonResponse<any>>(config.VER_REG_EMAIL_OTP, data)
  //   .pipe(catchError(this.handleError<any>('verifyRegisterEmailOTP')));
  // }

  public sendEmailVerification(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.SEND_EMAIL_VERIFY, data)
      .pipe(catchError(this.handleError<any>('sendEmailVerification')));
  }

  public checkEmailVerified(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.EMAIL_VERIFY_CHECK, data)
      .pipe(catchError(this.handleError<any>('checkEmailVerified')));
  }

  public checkUserNameExist(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.CHK_USR_NAME, data)
      .pipe(catchError(this.handleError<any>('checkUserNameExist')));
  }

  public checkUserDetailsExist(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.CHECK_USER_DETAILS, data)
      .pipe(catchError(this.handleError<any>('checkUserDetailsExist')));
  }

  public sendLoginPhoneOTP(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.LOGIN_SEND_PHONE_OTP, data)
      .pipe(catchError(this.handleError<any>('sendLoginPhoneOTP')));
  }

  public verifyLoginPhoneOTP(data: any) {
    return this.commonService.http.post<any>(config.LOGIN_VERIFY_PHONE_OTP, data)
      .pipe(catchError(this.handleError<any>('verifyLoginPhoneOTP')));
  }

  public sendOTPOnEmail(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.SEND_OTP_ON_EMAIL, data)
      .pipe(catchError(this.handleError<any>('sendOTPOnEmail')));
  }

  public verifyOTPSentOnMail(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.VERIFY_EMAIL_OTP, data)
      .pipe(catchError(this.handleError<any>('verifyOTPSentOnMail')));
  }

  public changePasswordViaEmailOTP(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.CHANGE_PASSWORD_EMAIL_OTP, data)
      .pipe(catchError(this.handleError<any>('changePasswordViaEmailOTP')));
  }

  public logoutUser(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.LOGOUT_API, data)
      .pipe(catchError(this.handleError<any>('Logout')));
  }

  public regularSearch(data: any) {
    return this.commonService.http.post<CommonResponse<any>>(config.API.SEARCH.SEARCH, data)
    .pipe(catchError(this.handleError<any>('regularSearch')));
  }

  public isAPISuccessfull(response: any) {
    if (response && response.ResponseStatus &&
      response.ResponseStatus.length > 0) {
      return response.ResponseStatus == "OK";
    }
    return false;
  }

  //https://www.positronx.io/create-ionic-angular-http-service/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return this.commonService.handleAPIError(error);
      // this.commonService.handleAPIError(error);
      // return of(error);
      // return of(result as T);
    };
  }
}
