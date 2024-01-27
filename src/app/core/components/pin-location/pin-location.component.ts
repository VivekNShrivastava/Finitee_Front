import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { UserLocation } from 'src/app/pages/map/models/Location';
import { mapStyle } from 'src/app/pages/map/models/MapOptions';
import { AddressMap } from "../../models/places/Address";
import { CommonService } from '../../services/common.service';
import { LocationService } from '../../services/location.service';
const MAP_INIT_ZOOM = 15;
const ZOOM_MAX = 15;
@Component({
  standalone: true,
  selector: 'app-pin-location',
  templateUrl: './pin-location.component.html',
  styleUrls: ['./pin-location.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PinLocationComponent implements OnInit {

  @Input() inputLocation!: AddressMap;
  @Output() onPinLocationCancel = new EventEmitter<any>();
  @Output() onPinLocationSubmit = new EventEmitter<any>();
  @ViewChild('map_canvas') mapRef?: ElementRef<HTMLElement>;
  public map?: google.maps.Map = undefined;
  public location: UserLocation = new UserLocation();
  styles = mapStyle;
  locationEnabled = false;
  currentLocation!: any;

  constructor(private platform: Platform,
    private locationService: LocationService,
    private commonService: CommonService
    ) { }

  async ngOnInit() {
    await this.platform.ready();
    console.log("PinLocationComponent: onInit");
  }

  async ngAfterViewInit() {
    await this.platform.ready();
    this.loadMap();
    this.fetchCurrentLocation()
  }

  async loadMap() {
    if (!this.map) {
      if (this.mapRef && this.location?.lat && this.location?.lng) {
        this.map = new google.maps.Map(this.mapRef.nativeElement,
          {
            center: {
              lat: this.location.lat,
              lng: this.location.lng
            },
            styles: this.styles,
            zoom: MAP_INIT_ZOOM,
            zoomControl: false,
            keyboardShortcuts: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }
        );
      } else {
        const options: PositionOptions = <PositionOptions>{
          maximumAge: 0,
          timeout: 5000,
          enableHighAccuracy: true
        };
        window.navigator.geolocation.getCurrentPosition((position) => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.loadMap();
        }, function (error) {
          console.log(error);
        }, options);
        setTimeout(() => {
          this.loadMap();
        }, 5000);
        return;
      }

      // this.refreshMap();
      // this.mapService.hideLoader();
      // this.map.addListener("click", () => {
      //   if (this.mapWindow) {
      //     this.mapWindow.close();
      //   }
      // });
      // this.mapService.hideLoader();

      // if (this.location?.lat) {
      //   localStorage.setItem('location', JSON.stringify(this.location));
      // }
      // this.setCurrentLocationMarker();
    }
  }

  async onClickGetCurrentPosition() {
    console.log();
    if (!this.location.lat || !this.location.lng) {
      this.location = this.location;
    }

    this.map?.moveCamera({
      center: this.location,
      zoom: ZOOM_MAX,
    })
    // this.currentUserLocation(this.location);
    // this.updatelocation();
  }

  fetchCurrentLocation() {
    // console.log("StateId:" + this.addressForm.value.stateId);
    // console.log("CityId:" + this.addressForm.value.cityId);
    // console.log("ZipCode:" + this.addressForm.value.zipCode);
    // console.log("AddressLine1:" + this.addressForm.value.addressLine1);
    // console.log("AddressLine2:" + this.addressForm.value.addressLine2);
    this.commonService.showLoader();
    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address) => {
      console.log("observeReverseGeocodingResult: ", address);
      this.commonService.hideLoader();
      if (address) {
        // this.currentUserWCurrLoc = Object.assign({}, this.currentUser);
      }
    });

    let currentPosSubs = this.locationService.observeCurrentPosition().subscribe((position) => {
      this.currentLocation = this.locationService.getCurrentCoordinate();
      console.log("REG: fetchCurrentLocation: ", this.currentLocation);
      if (this.currentLocation) {
        this.location.lat = this.currentLocation.latitude;
        this.location.lng = this.currentLocation.longitude;
        this.locationService.getAddressFromLatLng({ lat: this.currentLocation.latitude, lng: this.currentLocation.longitude });
      }

      if (!this.currentLocation) {
        console.log("REG: fetchCurrentLocation: unsubscribe");
        // currentPosSubs.unsubscribe();//TODO
      }
    });
    this.locationService.requestPermissions();
    this.locationService.fetchCurrentCoordinate();

  }
}
