import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, map, switchMap, from, tap, of } from 'rxjs';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { SignalRService } from './signal-r.service';
import { PrivacySettingService } from './privacy-setting.service';
import { AppConstants } from '../models/config/AppConstants';
import { LOGINPHONE_API, LOGIN_API, LOGOUT_API } from '../models/config/ApiMethods';
import * as config from 'src/app/core/models/config/ApiMethods';
// import { HttpRequest } from '@microsoft/signalr';
import { HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonService } from './common.service';



const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // authenticatedIs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentAccessToken = " ";
  authState = new BehaviorSubject(false);
  showloader: boolean = false;
  loaderLoading: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform, 
    private storageService: StorageService,
    public nav: NavController,
    public loadingController: LoadingController,
    // private apiService: APIService,
    // private commonService: CommonService,
    private _signalRService: SignalRService) {
    this.platform.ready().then(() => {
      console.log("service checkin..", this.authState.getValue());
      this.ifLoggedIn();
    });
  }

  getNewAccessToken(request: HttpRequest<any>) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    // console.log("Getting new refresh token...for...", request, "refresh token...", refreshToken);

    return of(refreshToken).pipe(
      switchMap(token => {
        if (token) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            })
          }
          const url = config.REFRESH;
          return this.http.post(`${url}`, { refreshToken: refreshToken }, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );

    // if (refreshToken !== null) {

    //   const refreshData = {
    //     RefreshToken: refreshToken
    //   };

    //   const url = config.REFRESH;

    //   return this.http.post(`${url}`, refreshData).pipe(
    //     catchError((error) => {
    //       // Handle the error, e.g., log or return a default value
    //       console.error("Token refresh failed:", error);
    //       return of(null);
    //     })
    //   )
    // }else {
    //   // No stored refresh token
    //   return of(null);
    // }
    // getNewAccessToken() {
    //   const refreshToken = from(Storage.get({ key: REFRESH_TOKEN_KEY }));
    //   return refreshToken.pipe(
    //     switchMap(token => {
    //       if (token && token.value) {
    //         const httpOptions = {
    //           headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token.value}`
    //           })
    //         }
    //         return this.http.get(`${this.url}/auth/refresh`, httpOptions);
    //       } else {
    //         // No stored refresh token
    //         return of(null);
    //       }
    //     })
    //   );
    // }
  }

  storeAccessToken(accessToken: string) {
    console.log("store accedd token", this.storeAccessToken),
    this.currentAccessToken = accessToken;
    return localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  async loadToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      this.currentAccessToken = token;
      this.authState.next(true);
    } else {
      this.authState.next(false);
    }
  }

  ifLoggedIn() {
    console.log("checking if logged in");
    // let response = this.storageService.getToken()
    let response = localStorage.getItem(ACCESS_TOKEN_KEY)
    console.log("response", response);
    if (response === "undefined") {
      if (this.storageService.getUserData()) {
        response = this.storageService.getUserData().AccessToken;
        localStorage.setItem("ACCESS_TOKEN_KEY", this.storageService.getUserData().AccessToken);
      }
    }
    console.log("response re check", response);
    if (response) {
      this.authState.next(true);
      window.document.title = this.storageService.getUserData().DisplayName;
      //this._signalRService.initiateSignalrConnection(); //TODO REMOVE Manoj Commented signlr

    }
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

  login(data: any, loginViaPhone?: boolean) {
    // console.log("login service data from body", data);
    // this.showLoader();
    return this.http.post<any>((loginViaPhone ? LOGINPHONE_API : LOGIN_API), data).pipe(
      switchMap((response: { AccessToken: any, RefreshToken: any }) => {
        // console.log("login res", response);
        // this.hideLoader();

        try {
          if (response) {
            this.proceedWithLogin(response);
          }
        } catch (ex) {
          this.hideLoader();
          // this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          console.log("LoginError: ", ex);
        }

        // Token handling and storage
        this.currentAccessToken = response.AccessToken;
        const storeAccess = localStorage.setItem(ACCESS_TOKEN_KEY, response.AccessToken);
        const storeRefresh = localStorage.setItem(REFRESH_TOKEN_KEY, response.RefreshToken);

        // Update authentication state
        const updateAuthState = from(Promise.all([storeAccess, storeRefresh])).pipe(
          tap(_ => {
            this.authState.next(true);
          })
        );

        return updateAuthState;
      }),
      
    );
  }

  // login(data: any, loginViaPhone?: boolean) {
  //   return this.http.post<any>((loginViaPhone ? LOGINPHONE_API : LOGIN_API), data).pipe(map(response => {
  //     try {
  //       if (response) {
  //         this.proceedWithLogin(response);
  //       }
  //     } catch (ex) {
  //       console.log("LoginError: ", ex);
  //       return ex;
  //     }
  //     window.document.title = response.name;
  //     return response;
  //   }));
  // }
  
  getLocalObjects () {
    const RefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const accessToken_1 = localStorage.getItem(ACCESS_TOKEN_KEY);
    const accessToken = localStorage.getItem('userData');
    // const storedObject = JSON.parse(accessToken);
    var storedObject;
    if (accessToken !== null) {
      storedObject = JSON.parse(accessToken);

      // Now, 'storedObject' contains your JavaScript object
      if (accessToken_1 === "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, storedObject.AccessToken);
      }
    } else {
      console.log('userData not found in localStorage');
    }

    var refresh_token = {
      RefreshToken: RefreshToken
    }

    return {refresh_token, storedObject}
  }

  // current logout function
  logout(tokenExpired?: boolean) {

    console.log("logged out");
    this.authState.next(false);
    const res = this.getLocalObjects();

    localStorage.clear();
    this.router.navigate([''], {replaceUrl: true})

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust the content type as needed
      'Authorization': 'Bearer ' + res.storedObject.AccessToken // Assuming you want to include the refresh token as an authorization header
    });

    this.http.post<any>(LOGOUT_API, res.refresh_token, { headers: headers }).subscribe(response => {
      // this.showLoader();
      console.log('HTTP Response:', response);
      if(response.ResponseData === "Success"){
        // this.hideLoader();
        // this.router.navigate([''], { replaceUrl: true });
        // localStorage.clear();
        this.currentAccessToken = "";
      }else{
        // this.hideLoader();
        console.log("Error Occured", response.ResponseData);
      }
    });
    
    // if(tokenExpired){
    //   // this.showLoader();
    //   console.log("logging out bcoz of expired token");
    //   this.router.navigate([''], {replaceUrl: true});
    //   this.currentAccessToken = "";
    //   window.document.title = AppConstants.APP_NAME;
    //   localStorage.clear();
    //   this.authState.next(false)
    //   this.hideLoader();
    // }else{
    //   // this.router.navigate([''], { replaceUrl: true });
    //   this.showLoader();
    //   var url = LOGOUT_API;
      // const RefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      // const accessToken_1 = localStorage.getItem(ACCESS_TOKEN_KEY);
      // const accessToken = localStorage.getItem('userData');
      // // const storedObject = JSON.parse(accessToken);
      // var storedObject;
      // if (accessToken !== null) {
      //   storedObject = JSON.parse(accessToken);
  
      //   // Now, 'storedObject' contains your JavaScript object
      //   console.log(storedObject);
      //   if (accessToken_1 === "undefined") {
      //     localStorage.setItem(ACCESS_TOKEN_KEY, storedObject.AccessToken);
      //   }
      // } else {
      //   console.log('userData not found in localStorage');
      // }
  
      // var refresh_token = {
      //   RefreshToken: RefreshToken
      // }
  
      // const headers = new HttpHeaders({
      //   'Content-Type': 'application/json', // Adjust the content type as needed
      //   'Authorization': 'Bearer ' + storedObject.AccessToken // Assuming you want to include the refresh token as an authorization header
      // });
  
      // this.http.post<any>(url, refresh_token, { headers: headers }).subscribe(response => {
      //   console.log('HTTP Response:', response);
      //   if(response.ResponseData === "Success"){
      //     this.hideLoader();
      //     this.router.navigate([''], { replaceUrl: true });
      //     localStorage.clear();
      //     this.currentAccessToken = "";
      //   }else{
      //     this.hideLoader();
      //     console.log("Error Occured", response.ResponseData);
      //   }
      // });

    //   this.hideLoader();

  
  
      // this.http.post<any>(url, refresh_token, { headers: headers }).pipe(
      //   switchMap(Response => {
      //     if(Response === 'Success'){
      //       this.router.navigate([''], { replaceUrl: true });
      //       console.log("switchMap");
      //       this.currentAccessToken = " ";
      //       const deleteAccess = localStorage.removeItem(ACCESS_TOKEN_KEY);
      //       const deleteRefresh = localStorage.removeItem( REFRESH_TOKEN_KEY );
      //       localStorage.clear();
      //       return from(Promise.all([deleteAccess, deleteRefresh]));
      //     }else {
      //       return of(null);
      //     }
  
      //   }),
      //   tap(_ => {
      //     this.router.navigate([''], { replaceUrl: true });
      //     console.log("Tap");
      //     // this.router.navigate([''], { replaceUrl: true });
          // this.currentAccessToken = "";
          // window.document.title = AppConstants.APP_NAME;
          // localStorage.clear();
          // this.authState.next(false);
          
      //     window.location.reload();
      //   })
      // ).subscribe();
    // }
    
  }

  isAuthenticated() {
    return this.authState.value;
  }

  public getUserInfo(): any {
    return JSON.parse(<string>localStorage.getItem("userData"));
  }

  public getUserId(): any {
    return JSON.parse(<string>localStorage.getItem("userData"))?.UserId;
  }

  proceedWithLogin(response: any) {
    console.log("proceed w login", response)
    localStorage.setItem("token", response.AccessToken);
    // response.DisplayName = 'nisarg';
    // response.NewDevice = true;
    localStorage.setItem("userData", JSON.stringify(response));
    // this.router.navigateByUrl('tabs/map');
    // this.router.navigate(['tabs/map'], {replaceUrl: true});
    this.nav.navigateRoot("tabs/map");
    //this._signalRService.initiateSignalrConnection(); TODO REMOVE Manoj Commented signlr
  }
}
