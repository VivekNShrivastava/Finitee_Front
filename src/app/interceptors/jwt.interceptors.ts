// import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, EMPTY } from 'rxjs';
import * as config from 'src/app/core/models/config/ApiMethods';
import { environment } from 'src/environments/environment';
import { BasePage } from '../base.page';
import { CommonService } from '../core/services/common.service';
import { FiniteeUser } from '../core/models/user/FiniteeUser';
import { HttpClient } from '@angular/common/http';
import { LOGOUT_API } from 'src/app/core/models/config/ApiMethods';

import {
    catchError,
    finalize,
    switchMap,
    filter,
    take,
} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { NullLogger } from '@microsoft/signalr';

const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

@Injectable()
export class JwtInterceptor extends BasePage implements HttpInterceptor  {
    // Used for queued API calls while refreshing tokens
    tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    // of(tokenSubject(null));
    isRefreshingToken = false;

    private pendingRequests: HttpRequest<any>[] = [];

    constructor(
        private toastCtrl: ToastController,
        private authService: AuthService,
        private commonService: CommonService,
        private http: HttpClient,
    ) { 
        super(authService);
    }

    // Intercept every HTTP call
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // var loginInfo: FiniteeUser = this.authService.getUserInfo();
        // // Authentication by setting header with token value
        // if (loginInfo && loginInfo.AccessToken) {
        //     request = request.clone({
        //     setHeaders: {
        //     Authorization: 'bearer ' + loginInfo.AccessToken,
        //     },
        // });
        // }
        // if (
        // !request.headers.has('Content-Type') &&
        // request.url.indexOf('CommonUpload') == -1
        // ) {
        //     request = request.clone({
        //     setHeaders: {
        //     'content-type': 'application/json',
        //     },
        // });
    

        // Check if we need additional token logic or not
        if (this.isInBlockedList(request.url)) {
            return next.handle(request);
        } else {
            return next.handle(this.addToken(request)).pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {
                        switch (err.status) {
                            // case 400:
                            //     return this.handle400Error(err);
                            case 401:
                                return this.handle401Error(request, next);
                            default:
                                return throwError(err);
                        }
                    } else {
                        return throwError(err);
                    }
                })
            );
        }
    }

    // Filter out URLs where you don't want to add the token!
    private isInBlockedList(url: string): Boolean {
        // Example: Filter out our login and logout API call
        if (url == `${environment.baseUrl}/auth/login` ||
            url == `${environment.baseUrl}/auth/logout`) {
            return true;
        } else {
            return false;
        }
    }

    // Add our current access token from the service if present
    public addToken(req: HttpRequest<any>) {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        var loginInfo: FiniteeUser = this.authService.getUserInfo();
        if (loginInfo && loginInfo.AccessToken) {
            // console.log("calling api again", this.logInfo ? this.logInfo.AccessToken: token);
            return req.clone({
                headers: new HttpHeaders({
                    Authorization: `bearer ${token? token: this.logInfo.AccessToken}`
                })
            });
        } else {
            return req;
        }
    }

    public async handle400Error(err: any) {
        // Potentially check the exact error reason for the 400
        // then log out the user automatically
        // const toast = await this.toastCtrl.create({
        //   message: 'Logged out due to authentication mismatch',
        //   duration: 2000
        // });
        // toast.present();
        // this.authService.logout();
        return of(null);
    }

    public handle401Error(request: HttpRequest < any >, next: HttpHandler): Observable < any > {
        // Check if another call is already using the refresh logic
        // this.commonService.presentToast("getting new token");

        if(!this.isRefreshingToken) {
            
          // Set to null so other requests will wait
          // until we got a new token!
          this.tokenSubject.next(null);
          this.isRefreshingToken = true;
          this.authService.currentAccessToken = " ";
    
          // First, get a new access token
          return this.authService.getNewAccessToken(request).pipe(
            switchMap((token: any) => {
            // this.commonService.presentToast("getting new token");
              if (token) {
                // Store the new token
                // console.log("got the new token", token);
                let accessToken = "";
                if(token.Token === "Expired"){
                  console.log("Refresh Token Expired, Logging out")
                  // this.commonService.presentToast("Logging OUt Refresh Token Expired");
                  this.authService.logout(true);
                  return EMPTY;
                }else{
                  accessToken = token.Token;
                }
                return of( this.authService.storeAccessToken(accessToken))
                .pipe(
                  switchMap(_ => {
                    // Use the subject so other calls can continue with the new token
                    this.tokenSubject.next(accessToken);

                    // this.retryPendingRequests(next);
    
                    // Perform the initial request again with the new token
                    return next.handle(this.addToken(request));
                  })
                );
              } else {
                // No new token or other problem occurred
                console.log("Some error occured", token);
                return of(null);
              }
            }),
            finalize(() => {
              // Unblock the token reload logic when everything is done
              this.isRefreshingToken = false;
            })
          );
        } else {
          // "Queue" other calls while we load a new token
          return this.tokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              // Perform the request again now that we got a new token!
              return next.handle(this.addToken(request));
            })
          );
        }
    }

    private retryPendingRequests(next: HttpHandler): void {
        // Retry the pending requests with the new token
        while (this.pendingRequests.length > 0) {
          const pendingRequest = this.pendingRequests.shift();
          if (pendingRequest) {
            // Pass 'next' as null since we are not actually handling the retry within this function
            this.handle401Error(pendingRequest, next).subscribe();
          }
        }
    }
    
}


