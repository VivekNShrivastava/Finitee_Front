import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { finiteeIconMapper } from './core/models/config/FiniteeIconMapping';
import { AuthService } from './core/services/auth.service';
//import { PlacesService } from './core/services/places.service';
import { TextZoom, SetOptions } from '@capacitor/text-zoom';
import { Capacitor } from '@capacitor/core';
import { CommonService } from './core/services/common.service';
import { LocationService } from './core/services/location.service';
import { PaymentService } from './core/services/payment.service';
import { interval } from 'rxjs';
import { Location } from '@angular/common';
import { UserPrivacyService } from './core/services/user-privacy/user-privacy.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { platform } from 'os';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  locationUpdateInterval$: any;
  constructor(private authService: AuthService, private paymentService: PaymentService, private locationService: LocationService, private commonService: CommonService, private router: Router, public location: Location, public _userPrivacyServivce: UserPrivacyService,
    private platform: Platform
  ) {
    addIcons(finiteeIconMapper);
    this.initializeApp();
  }

  //old
  // initializeApp() {
  //   if (Capacitor.isNativePlatform())
  //     this.setTextZoom();
  //   //this.placesService.getCountryList();
  //   this.authService.authState.subscribe((state) => { 
  //     console.log("Initialzing app", state);
  //     if (state) {
  //       this.router.navigate(['tabs/map']); 
  //       // this.locationService.getCurrencyByCountry();
  //     } else if (!state) {
  //       this.router.navigate(['']);
  //     }
  //   });

  // }

  //new
  async initializeApp() {
    await SplashScreen.show({ autoHide: false });
  
    const res = this.getPlatformName();
    console.log(res);
  
    if (Capacitor.isNativePlatform()) {
      this.setTextZoom();
    }
  
    const temp = localStorage.getItem('firstLaunch');
    if (localStorage.getItem('firstLaunch') === null) {
      localStorage.clear();
      localStorage.setItem('firstLaunch', 'true');
      this.router.navigate([''], { replaceUrl: true });
    } else {
      this.authService.authState.subscribe(async (state) => {
        if (state) {
          this.router.navigate(['tabs/map'], { replaceUrl: true });
        } else {
          this.router.navigate([''], { replaceUrl: true });
        }
        if (Capacitor.isNativePlatform()) {
          await SplashScreen.hide(); // Hide splash screen once initialization is complete
        }
      });
    }
  }
  

  getPlatformName(): string {
    if (this.platform.is('cordova')) {
      return 'Cordova';
    } else if (this.platform.is('capacitor')) {
      return 'Capacitor';
    } else if (this.platform.is('android')) {
      return 'Android';
    } else if (this.platform.is('ios')) {
      return 'iOS';
    } else if (this.platform.is('desktop')) {
      return 'Desktop';
    } else if (this.platform.is('mobileweb')) {
      return 'Mobile Web';
    } else if (this.platform.is('pwa')) {
      return 'PWA';
    } else {
      return 'Unknown';
    }
  }
  
 
  setTextZoom() {
    var options: SetOptions = {
      value: parseFloat("1.0.0")
    }
    TextZoom.set(options);
  }
}
