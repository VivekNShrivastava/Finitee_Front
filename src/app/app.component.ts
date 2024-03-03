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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  locationUpdateInterval$: any;
  constructor(private authService: AuthService, private paymentService: PaymentService, private locationService: LocationService, private commonService: CommonService, private router: Router) {
    addIcons(finiteeIconMapper);
    this.initializeApp();
    // this.currentLocationUpdate();
    // this.setupLocationUpdates();

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

  setupLocationUpdates() {
    this.locationUpdateInterval$ = interval(600000); // 60 seconds interval

    this.locationUpdateInterval$.subscribe(() => {
      this.currentLocationUpdate();
    });
  }

  currentLocationUpdate() {
    this.locationService.observeCurrentPosition().subscribe((position) => {
      console.log("Current location", position.coords);
      if(position) this.locationService.updateLiveLocation(position.coords.latitude, position.coords.longitude);
    });
  }

  // currentLocationUpdate () {
  //   this.locationService.observeCurrentPosition().subscribe((position) => {
      
  //     console.log("current location", position);
  //   })
  // }
 
  setTextZoom() {
    var options: SetOptions = {
      value: parseFloat("1.0.0")
    }
    TextZoom.set(options);
  }
}
