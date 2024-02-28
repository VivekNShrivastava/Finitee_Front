import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AnimationController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Greeting } from 'src/app/pages/map/models/UserOnMap';
import { environment } from 'src/environments/environment';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { CommonResponse } from 'src/app/core/models/CommonResponse';
import { NotificationPayload } from 'src/app/core/models/notification/NotificationPayload';
import { AuthService } from './auth.service';
import { SignalRService } from './signal-r.service';
import { throwError } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { AppConstants } from '../models/config/AppConstants';
import * as _ from 'lodash';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { ContactDetail } from '../models/user/WorkExperience';
import { config } from '../models';
import { UserPushNotToken } from '../models/user/UserPushNotToken';
import { Currency } from '../models/places/Currency';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  eventTraitError: boolean = false;
  isWorkListOnly: boolean = false;
  isEducationListOnly: boolean = false;
  showloader: boolean = false;
  loaderLoading: boolean = false;
  versioncheck: boolean = false;
  public viewingUsers: FiniteeUserOnMap[] = <FiniteeUserOnMap[]>[];
  public greetings: Greeting[] = <Greeting[]>[];
  public greetingWithDetails: FiniteeUserOnMap[] = <FiniteeUserOnMap[]>[];
  public activeGreetings: Greeting[] = <Greeting[]>[];
  public savedSonarLocations: any[] = <any[]>[];

  currentCurrency: Currency = new Currency();
  ;
  // ms
  public contactDetails = new ContactDetail();

  constructor(
    public toastController: ToastController, private callNumber: CallNumber,
    public loadingController: LoadingController,
    public _signalRService: SignalRService,
    public http: HttpClient,
    private authService: AuthService,
    private animationCtrl: AnimationController,
    private navCtrl: NavController

  ) {
    // this._signalRService.onClearViewingObs.subscribe(
    //   this.onClearViewing.bind(this)
    // );
    // this._signalRService.onViewedOnSonarObs.subscribe(
    //   this.onViewedOnMap.bind(this)
    // );
    // this._signalRService._onGreetingEventOb.subscribe(
    //   this.onGreetingUpdated.bind(this)
    // );
  }

  enterAnimationRToL = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0.9', transform: 'translateX(50%)' },
        { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(AppConstants.MODAL_ANIMATION_DURATION)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimationRToL = (baseEl: HTMLElement) => {
    return this.enterAnimationRToL(baseEl).direction('reverse');
  };

  enterAnimationLToR = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0.8', transform: 'translateX(-100%)' },
        { offset: 1, opacity: '1', transform: 'translateX(0%)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(AppConstants.MODAL_ANIMATION_DURATION)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimationLToR = (baseEl: HTMLElement) => {
    return this.enterAnimationLToR(baseEl).direction('reverse');
  };

  async presentToast(data: any, colorData?: any) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      color: colorData,
    });
    toast.present();
  }

  showLoader(functionName?: string) {
    // console.log('showLoader: Start: ', functionName);
    this.loaderLoading = false;
    this.loadingController
      ?.create({
        message: 'Loading...',
      })
      .then((response) => {
        response.present();
        this.loaderLoading = true;
        // console.log('showLoader: End');
      });
  }

  hideLoader(functionName?: string) {
    // console.log('hideLoader: Start', functionName);
    let self = this;
    if (!this.loaderLoading) {
      setTimeout(() => {
        self.dismissLoader('DELAY: ' + functionName);
      }, 600);
    }
    else {
      this.dismissLoader(functionName);
    }

  }

  dismissLoader(functionName?: string) {
    // if (this.loaderLoading) {
    // console.log('dismissLoader: Start', functionName);
    this.loadingController
      ?.dismiss()
      .then((response) => {
        // console.log('dismissLoader closed!', response);
        this.loaderLoading = false;
      })
      .catch((err) => {
        // console.log('dismissLoader Error occured : ', err);
        this.loaderLoading = false;///?
      });
    // }
  }

  public onClearViewing(fromUserId: number): void {
    this.viewingUsers = this.viewingUsers.filter((v) => v.UserId != fromUserId);
  }

  public onViewedOnMap(params: NotificationPayload<FiniteeUserOnMap>): void {
    if (!this.viewingUsers.find((v) => v.UserId == params?.data?.UserId)) {
      this.viewingUsers.push(<FiniteeUserOnMap>params.data);
    }
  }

  public loadUserGreetings(): void {
    this.http
      .get<CommonResponse<Greeting[]>>(
        environment.baseUrl + 'finitee/GreetingStatus'
      )
      .subscribe((response) => {
        this.greetings = response?.ResponseData || [];
        this.setActiveGreetings();
      });
  }

  public setActiveGreetings(): void {
    this.activeGreetings = this.greetings.filter(
      (x) => x.ToId == this.authService.getUserInfo().UserId && x.Status == 'S'
    );
  }

  public greetingStatusWithDetails(): void {
    this.http
      .get<CommonResponse<FiniteeUserOnMap[]>>(
        environment.baseUrl + 'finitee/GreetingStatusWithDetails'
      )
      .subscribe((response) => {
        this.greetingWithDetails = response?.ResponseData || [];
      });
  }

  public onGreetingUpdated(greeting: Greeting): void {
    this.loadUserGreetings();
  }

  public handleAPIError(error: HttpErrorResponse) {
    // this.loadingController.dismiss();
    // console.log("handleAPIError: Start", this);
    // this.hideLoader();//TODO Manoj Test
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    let errorMsg = 'Some error occurred, please try again later.';
    if (error.error && error.error.Error && error.error.Error.length > 0) {
      errorMsg = error.error.Error;
    }
    return throwError(() => new Error(errorMsg));
  }

  public handleAPIErrorTest(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('TEST An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `TEST Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('TEST œSomething bad happened; please try again later.')
    );
  }

  public createCompareValidator(
    controlOne: AbstractControl,
    controlTwo: AbstractControl
  ) {
    return () => {
      if (controlOne && controlTwo && controlOne.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };
  }

  getPrivacyFullValue(privacyFirstChar: string) {
    var selectedPrivacy = _.filter(AppConstants.GeneralPivacy, { 'key': privacyFirstChar });
    if (selectedPrivacy.length > 0) return selectedPrivacy[0].value;
    else return privacyFirstChar;
  }

  getLocationShowAt(privacyFirstChar: string) {
    var selectedPrivacy = _.filter(AppConstants.GeneralLocationShowAt, { 'key': privacyFirstChar });
    if (selectedPrivacy.length > 0)
      return selectedPrivacy[0].value;
    else
      return privacyFirstChar;
  }

  getFullPrivacyForNone(privacyFirstChar: string) {
    var selectedPrivacy = _.filter(AppConstants.GeneralPivacy, { 'key': privacyFirstChar });
    if (selectedPrivacy.length > 0)
      return selectedPrivacy[0].value;
    else
      return privacyFirstChar;
  }

  navigatePage(page: any) {
    this.navCtrl.navigateForward(page);
  }

  // capitalizeAllFields(obj: any) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       const value = obj[key];
  //       if (value !== null && typeof value === 'object') {
  //         this.capitalizeAllFields(value);
  //       } else if (typeof value === 'string' && value.length > 0) {
  //         obj[key] = value.charAt(0).toUpperCase() + value.slice(1);
  //       }
  //     }
  //   }
  // }



  callNumberFn(number: any) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

  }

  updatePushNotificationToken(token: any) {
    return new Promise<any>((resolve, reject) => {
      var userPushNotToken: any = new UserPushNotToken();
      userPushNotToken.Token = token;

      this.http.post<any>(config.API.USER_PROFILE.PUSH_NOTIFICATION.TOKEN_UPDATE, userPushNotToken).subscribe((response: any) => {
        resolve(true);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;

  }

  // get currency & amount for payment.
  getCurrencyByCountry(country: string) {
    return new Promise<any>((resolve) => {
      return this.http.get<any>(`${config.GET_CURRENCY_BY_COUNTRY}/${country}`).subscribe((response: any) => {
        resolve(response);
      },
        (error) => {
          console.log("abc error", error);
          this.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }


}
