import { Injectable, NgZone } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { Geolocation, Position } from '@capacitor/geolocation';
import { Platform } from "@ionic/angular";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { UserLocation } from "src/app/pages/map/models/Location";
import { AddressMap, Area } from "../models/places/Address";
import { PlacesService } from "./places.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Currency } from "../models/places/Currency";
import { PaymentService } from "./payment.service";
// import { config } from '../models';
import { AppConstants } from "../models/config/AppConstants";
import { CommonService } from "./common.service";
import * as config from 'src/app/core/models/config/ApiMethods';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  currentCoordinate: any;
  addressCoordinate!: any;
  watchCoordinate: any;
  watchId: any;
  currentPos!: Position;
  currentArea!: Area;

  private _currentPosition = new BehaviorSubject<Position>(this.currentPos);
  private _geocodeResult = new Subject<any>();
  private _reverseGeocodeResult = new Subject<AddressMap>();

  private _currentPosition$ = this._currentPosition.asObservable();
  private _geocodeResult$ = this._geocodeResult.asObservable();
  private _reverseGeocodeResult$ = this._reverseGeocodeResult.asObservable();

  private geocoder: google.maps.Geocoder;

  private permResult: any;


  constructor(private zone: NgZone, private http: HttpClient, private commonService: CommonService, private paymentService: PaymentService, private platform: Platform, private placesService: PlacesService) {
    this.geocoder = new google.maps.Geocoder();

  }

  async requestPermissions() {
    if (this.platform.is("android") || this.platform.is("ios")) {
      //  console.log("LocationService: requestPermissions: android or ios")
      const perm_Result = await Geolocation.requestPermissions();
      console.log('Perm request result: ', perm_Result);
      this.permResult = perm_Result;
    }
    else {
      // console.log("LocationService: requestPermissions: desktop:" + this.platform.is("desktop") + " pwa:" +
      //   this.platform.is("pwa") + " hybrid:" + this.platform.is("hybrid"));
    }
  }

  setPermissionResult(result: any) {
    this.permResult = result;
  }

  getPermissionResult() {
    return this.permResult;
  }


  fetchCurrentCoordinate(loadArea?: boolean) {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.currentCoordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy
      };
      this.setCurrentPosition(data);
      // console.log('getCurrentCoordinate: ', this.currentCoordinate);
      if (loadArea) {
        this.currentArea = new Area();
        this.currentArea.Coordinate = {Latitude: this.currentCoordinate.latitude, Longitude: this.currentCoordinate.longitude };
        this.getAddressFromLatLng({ lat: this.currentCoordinate.latitude, lng: this.currentCoordinate.longitude }, true);
      }
    }).catch(err => {
      //  console.error(err);
    });
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          this.watchCoordinate = {
            latitude: position?.coords.latitude,
            longitude: position?.coords.longitude,
          };
        });
      });
    } catch (e) {
      //  console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  observeCurrentPosition(): Observable<Position> {
    return this._currentPosition$;
  }

  setCurrentPosition(pos: Position) {
    return this._currentPosition.next(pos);
  }

  observeGeocodingResult(): Observable<any> {
    return this._geocodeResult$;
  }

  setGeocodingResult(coord: any) {
    return this._geocodeResult.next(coord);
  }

  observeReverseGeocodingResult(): Observable<any> {
    return this._reverseGeocodeResult$;
  }

  setReverseGeocodingResult(address: AddressMap) {
    return this._reverseGeocodeResult.next(address);
  }

  getCurrentCoordinate() {
    return this.currentCoordinate;
  }

  getCurrentArea() {
    return this.currentArea;
  }

  updateLiveLocation(lat: Number, lng: Number) {
    const body = {
      Latitude: lat,
      Longitude: lng
    }
    return new Promise<any>((resolve, reject) => {
      var url = config.API.SEARCH.UPDATE_LIVE_LOCATION;
      return this.http.post<any>(url, body).subscribe((response: any) => {
        resolve(response);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    })
  }

  getLatLngFromAddress(address: any) {

    console.log("getLatLngFromAddress: address", address);
    var geocoder = new google.maps.Geocoder();
    let self = this;
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results && results.length > 0) {
          self.addressCoordinate = {
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
            accuracy: -1
          };
          self.setGeocodingResult(self.addressCoordinate);
        }
        else {
          self.setGeocodingResult(null);
        }

      } else {
        console.log("getLatLngFromAddress: Geocode was not successful for the following reason: " + status);
        self.setGeocodingResult(null);
      }
    });
  }

  getAddressFromLatLng(latLng: any, loadArea?: boolean) {
    // console.log("getAddressFromLatLng: latLng", latLng);
    var geocoder = new google.maps.Geocoder();
    let self = this;
    geocoder.geocode({ 'location': latLng }, async function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results && results.length > 0) {
          let address = results[0].formatted_address
          // console.log("getAddressFromLatLng: Formatted Address: ", address);
          // console.log("getAddressFromLatLng: Full Result: 0 : ", results[0]);
          // self.setUserEnteredCoord(self.addressCoordinate);
          // console.log("formated add", results, address);
          let fAddress = await self.mapAddressFromGoogleResults(results[0], latLng);
          if (loadArea) {
            self.currentArea = new Area();
            self.currentArea.Coordinate = {Latitude: latLng.lat, Longitude: latLng.lng};
            self.currentArea.City = fAddress.CityName;
            self.currentArea.Country = fAddress.CountryName;
            self.currentArea.CountryId = fAddress.CountryId;
            self.currentArea.Locality = fAddress.AddressLine1; // Or append AddressLine2 as well?
            self.currentArea.State = fAddress.StateName;
            self.currentArea.Zip = fAddress.ZipCode;
          }
          self.setReverseGeocodingResult(fAddress)
        }

      } else {
        //  console.log("getAddressFromLatLng: ReverseGeocode was not successful for the following reason: " + status);
      }
    });
  }

  async mapAddressFromGoogleResults(geocodeResult: google.maps.GeocoderResult, latLng: any): Promise<AddressMap> {
    let firstAddressLine1: google.maps.GeocoderAddressComponent | undefined;
    let firstAddressLine2: google.maps.GeocoderAddressComponent | undefined;
    let fAddress = new AddressMap();
    // fAddress.coordinate = new Coordinate();
    fAddress.Latitude = latLng.lat;
    fAddress.Longitude = latLng.lng;
    fAddress.FormattedAddress = geocodeResult.formatted_address;
    if (geocodeResult.address_components && geocodeResult.address_components.length > 0) {
      geocodeResult.address_components.forEach(component => {
        if (component.types.includes("sublocality")) {
          if (!fAddress.AddressLine2 || fAddress.AddressLine2.length == 0) {
            firstAddressLine2 = component;
          }
          fAddress.AddressLine2 = fAddress.AddressLine2 + (fAddress.AddressLine2.length > 0 ? ", " : "") + component.long_name;
          fAddress.AddressLine2 = this.trimAddress(fAddress.AddressLine2);
        }
        else if (component.types.includes("subpremise") || component.types.includes("premise")
          || component.types.includes("route") || component.types.includes("street_address")) {
          if (!fAddress.AddressLine1 || fAddress.AddressLine1.length == 0) {
            firstAddressLine1 = component;
          }
          fAddress.AddressLine1 = fAddress.AddressLine1 + (fAddress.AddressLine2.length > 0 ? ", " : "") + component.long_name;
          fAddress.AddressLine1 = this.trimAddress(fAddress.AddressLine1);
        }
        else if (component.types.includes("country")) {
          fAddress.CountryName = component.long_name;
          fAddress.CountryCode = component.short_name;
        }
        else if (component.types.includes("administrative_area_level_1")) {
          fAddress.StateName = component.long_name;
          fAddress.StateCode = component.short_name;
        }
        else if (component.types.includes("locality")) {
          fAddress.CityName = component.long_name;
        }
        else if (component.types.includes("postal_code")) {
          fAddress.ZipCode = component.long_name;
        }
      });

      let country = await this.placesService.findCountry({ CountryName: fAddress.CountryName });
      if (country) {
        fAddress.CountryId = country.id;
        let state: any = await this.placesService.findState(fAddress.CountryId, { StateName: fAddress.StateName });
        if (state) {
          fAddress.StateId = state['id'];
          let city: any = await this.placesService.findCity(fAddress.StateId, { CityName: fAddress.CityName });
          if (city) {
            fAddress.CityId = city['id'];
          }
        }
      }


      //Extra processing as not getting building name in addresscomponents array
      let resetAddressLine1 = true;
      if (firstAddressLine1) {
        if (fAddress.FormattedAddress.startsWith(firstAddressLine1.long_name) || fAddress.FormattedAddress.startsWith(firstAddressLine1.short_name)) {
          //Do nothing as addressLine1 is good
          resetAddressLine1 = false;
        }
      }
      if (resetAddressLine1) {
        let endIndex = -1;
        if (firstAddressLine2) {
          let longIndex = fAddress.FormattedAddress.lastIndexOf(firstAddressLine2.long_name);
          let shortIndex = fAddress.FormattedAddress.lastIndexOf(firstAddressLine2.short_name);
          endIndex = longIndex > -1 ? longIndex : (shortIndex > -1 ? shortIndex : -1);

        }
        if (endIndex < 0 && fAddress.CityName && fAddress.CityName.length > 0) {
          endIndex = fAddress.FormattedAddress.indexOf(fAddress.CityName);
        }
        if (endIndex > 0) {
          fAddress.AddressLine1 = this.trimAddress(fAddress.FormattedAddress.substring(0, endIndex));
        }
      }
    }
    // console.log("mapAddressFromGoogleResults: ", fAddress);
    return fAddress;
  }

  trimAddress(address: string): string {
    //  console.log("trimAddress: Start:", address);
    if (address && address.length > 0) {
      address = address.trim();
      if (address.startsWith(",")) {
        address = address.substring(1, address.length);
      }
      if (address.endsWith(",")) {
        address = address.substring(0, address.lastIndexOf(","));
      }
      address = address.trim();
    }
    // console.log("trimAddress: End:", address);
    return address;
  }

  // created by Ram
  getLatLngFromAddressType(addressType: string, address?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      switch (addressType) {
        case 'current':
          this.getCurrentLocationLatLng()
            .then((latLng) => resolve(latLng))
            .catch((error) => reject(error.message));
          break;
        case 'home':
          const address = 'FW88+3JQ, Corinthians Club Internal Rd, Nyati County, Undri, Pune, Maharashtra 411060';
          this._getLatLngFromAddress(address)
            .then((latLng) => resolve(latLng))
            .catch((error) => reject(error.message));
          break;
        default:
          reject('Unsupported locationType');
          break;
      }
    });
  }

  _getLatLngFromAddress(address: string): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ 'address': address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            const location = results[0].geometry.location;
            const latLng = {
              lat: location.lat(),
              lng: location.lng()
            };
            resolve(latLng);
          } else {
            reject(new Error('No results found for the provided address.'));
          }
        } else {
          reject(new Error('Geocoding failed with status: ' + status));
        }
      });
    });
  }

  getCurrentLocationLatLng(): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve({ lat, lng });
          },
          (error) => {
            reject(new Error("Error getting current location: " + error.message));
          }
        );
      } else {
        reject(new Error("Geolocation is not available in this browser."));
      }
    });
  }

  getCurrentLocationCountry(): Promise<string> {

    return new Promise((resolve, reject) => {
const geocoder = new google.maps.Geocoder();

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
             geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results) {
                  for (const result of results) {
                    for (const component of result.address_components) {
                      if (component.types.includes("country")) {
                        resolve(component.long_name);
                        return; // Stop processing results once country is found
                      }
                    }
                  }
                  reject(new Error("Country not found in geocoding results."));
                } else {
                  reject(new Error("No results found in geocoding."));
                }
              } else {
                reject(new Error("Geocoding failed with status: " + status));
              }
            });
          },
          (error) => {
            reject(new Error("Error getting current location: " + error.message));
          }
        );
      } else {
        reject(new Error("Geolocation is not available in this browser."));
      }
    });
  }

  getCountryFromLatLng(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results) {
            for (const result of results) {
              for (const component of result.address_components) {
                if (component.types.includes("country")) {
                  resolve(component.long_name);
                  return; // Stop processing results once country is found
                }
              }
            }
            reject(new Error("Country not found in geocoding results."));
          } else {
            reject(new Error("No results found in geocoding."));
          }
        } else {
          reject(new Error("Geocoding failed with status: " + status));
        }
      });
    });
  }

  async getCurrencyByCountry() {
    try {

      this.getCurrentLocationCountry()
        .then(async (country) => {
          let res = await this.commonService.getCurrencyByCountry(country);
          if (res) {
            this.commonService.currentCurrency = res;
            this.paymentService.payment.currencyCode = this.commonService.currentCurrency.CurrencyCode
          }
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    } catch (error) {
      console.log(error)
    }
  }


}
