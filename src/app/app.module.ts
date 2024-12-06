import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { HttpConfigInterceptor } from './core/interceptor/httpConfig.interceptor';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { PrivacySettingService } from './core/services/privacy-setting.service';
import { RecaptchaSettings, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { CustomFilterPipe } from './core/pipes/filter';
import { JwtInterceptor } from './interceptors/jwt.interceptors';


@NgModule({
  declarations: [AppComponent],
  imports: [
  
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    /* ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }), */
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpConfigInterceptor,
    //   multi: true,
    // },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.captchaSiteKey,//V3
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.captchaSiteKey } as RecaptchaSettings,//V2 Captcha
    },
    
    AuthService,
    PrivacySettingService,
    File,
    SocialSharing,
    Diagnostic,
    Camera,
    MediaCapture,
    DatePipe,
    CallNumber,
    CustomFilterPipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
