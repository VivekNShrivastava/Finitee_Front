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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private paymentService: PaymentService, private locationService: LocationService, private commonService: CommonService, private router: Router) {
    addIcons(finiteeIconMapper);
    this.initializeApp();
  }

  initializeApp() {
    if (Capacitor.isNativePlatform())
      this.setTextZoom();
    //this.placesService.getCountryList();
    this.authService.authState.subscribe((state) => { 
      console.log("Initialzing app", state);
      if (state) {
        this.router.navigate(['tabs/map']); 
        this.locationService.getCurrencyByCountry();
      } else if (!state) {
        this.router.navigate(['']);
      }
    });

  }
 
  setTextZoom() {
    var options: SetOptions = {
      value: parseFloat("1.0.0")
    }
    TextZoom.set(options);
  }
}
