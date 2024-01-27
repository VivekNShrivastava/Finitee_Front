//httpConfig.interceptor.ts
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FiniteeUser } from '../models/user/FiniteeUser';
import { error } from 'console';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';

import {
  catchError,
  finalize,
  switchMap,
  filter,
  take,
} from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(" ");
  isRefreshingToken = false;

  loaderToShow: any;
  isShowingLoader = false;
  isLoading: boolean = false;
  interval: any;
  timerinterval: any;
  private requests: HttpRequest<any>[] = [];
  // private requests_401: HttpRequest<any>[] = [];
  constructor(
    public loadingController: LoadingController,
    public commonService: CommonService,
    public toastCtrl: ToastController,
    private authService: AuthService,
  ) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    if (this.requests.length == 0) {
      if (this.commonService.showloader) {
        this.hideLoader();
      }
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var loginInfo: FiniteeUser = this.authService.getUserInfo();
    // Authentication by setting header with token value
    if (loginInfo && loginInfo.AccessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: 'bearer ' + loginInfo.AccessToken,
        },
      });
    }
    if (
      !req.headers.has('Content-Type') &&
      req.url.indexOf('CommonUpload') == -1
    ) {
      req = req.clone({
        setHeaders: {
          'content-type': 'application/json',
        },
      });
    }
    this.requests.push(req);
    // console.log("uest..", req);
    if (this.commonService.showloader) {
      this.showLoader();
    }
    return new Observable((observer: any) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          //if (event instanceof HttpResponse) {
            // this.removeRequest(req);
            observer.next(event);
          //}
        },
        (err) => {
          // if (err instanceof HttpErrorResponse && err.status === 401) {
          //   // Handle 401 Unauthorized
          //   this.handle401Error(req, observer);
          // } else {
          //   this.removeRequest(req);
          //   observer.error(err.status);
          //   this.hideLoader();
          // }
          
          this.removeRequest(req);
          observer.error(err.status);
          this.hideLoader();
        },
        () => {
          // this.removeRequest(req);
          observer.complete();
        }
      );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }

  private handle401Error(request: HttpRequest < any >, next: HttpHandler): Observable < any > {
    // Check if another call is already using the refresh logic
    this.commonService.presentToast("getting new token");

    if(!this.isRefreshingToken) {
        
      // Set to null so other requests will wait
      // until we got a new token!
      this.tokenSubject.next(" ");
      this.isRefreshingToken = true;
      this.authService.currentAccessToken = " ";

      // First, get a new access token
      return this.authService.getNewAccessToken(request).pipe(
        switchMap((token: any) => {
        this.commonService.presentToast("getting new token");
          if (token) {
            // Store the new token
            console.log("got the new token", token);
            console.log("api is", request);
            const accessToken = token.Token;
            return of( this.authService.storeAccessToken(accessToken))
            .pipe(
              switchMap(_ => {
                // Use the subject so other calls can continue with the new token
                this.tokenSubject.next(accessToken);

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
          console.log("no refres token")
          return next.handle(this.addToken(request));
        })
      );
    }
  }

  public addToken(req: HttpRequest<any>) {
    if (this.authService.currentAccessToken) {
        console.log("calling api again", req);
        return req.clone({
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.currentAccessToken}`
            })
        });
    } else {
        return req;
    }
  }

  async showLoader() {
    if (!this.isShowingLoader) {
      // this.starttimer();
      this.isShowingLoader = true;
      this.loaderToShow = this.loadingController
        .create({
          message: 'Loading...',
        })
        .then((res) => {
          res.present();
          this.isLoading = true;
          this.commonService.loaderLoading = true;
          res.onDidDismiss().then((dis) => {
            console.log('Loading dismissed!');
          });
        });
    }
  }

  counter: any = 0;
  starttimer() {
    if (this.timerinterval) {
      clearInterval(this.timerinterval);
    }
    this.counter = 0;
    this.timerinterval = setInterval(() => {
      this.counter++;
      if (this.counter == 60) {
        this.counter == 0;
        clearInterval(this.timerinterval);
        if (this.isLoading) {
          this.loadingController.dismiss();
          this.isLoading = false;
          this.loaderToShow = null;
          this.commonService.loaderLoading = false;
          this.isShowingLoader = false;
          this.presentToast('something went wrong...');
        }
      }
    }, 1000);
  }

  async presentToast(msg: string) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  async hideLoader() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.isLoading) {
        this.loadingController.dismiss();
        this.isLoading = false;
        this.loaderToShow = null;
        this.commonService.loaderLoading = false;
        this.isShowingLoader = false;
        this.endTimer();
      } else {
        this.endTimer();
      }
    }, 100);
  }

  endTimer() {
    clearInterval(this.interval);
  }
}
