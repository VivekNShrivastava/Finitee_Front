import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonResponse } from 'src/app/core/models/CommonResponse';
//import { Country } from '../models/places/Country';
import { CommonService } from './common.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { catchError } from 'rxjs';
import { APIService } from './api.service';
//import { State } from '../models/places/State';
//import { City } from '../models/places/City';
import * as lodash from 'lodash';
import { AppConstants } from '../models/config/AppConstants';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import CountryJson from 'src/assets/json/CountryData.json';
import StateJson from 'src/assets/json/StateData.json';
import CityJson from 'src/assets/json/CityData.json';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  defaultCountryId = 0;

  constructor(
    public commonService: CommonService,
    private apiService: APIService,
    private storageService: StorageService
  ) {
  }


  // public getCountries() {
  //   return this.countries;
  // }

  getDefaultCountryId() {
    if (this.defaultCountryId <= 0) {
      if (this.countries && this.countries.length > 0) {
        this.defaultCountryId = this.findCountryIdFromPhoneCode(AppConstants.DEFAULT_PHONE_CODE);
      }
    }
    return this.defaultCountryId;
  }

  /** Get All Countries List */
  public async getCountryList() {
    this.countries = [...CountryJson];

    return await this.countries;
    //console.log("country test: Start: 2")
    /*  this.apiService.getCountryList()
       .subscribe(response => {
         this.countries = response?.ResponseData || [];
         if (this.countries.length > 0) {
           this.storageService.storeCountries(this.countries);
         }
         console.log("country test: End: 2")
         let defaultId = this.getDefaultCountryId();
         this.getStateList(defaultId);//MANOJ REMOVE
       }); */
  }

  /** Get All State List for selected country */
  public async getStateList(countryId: number) {
    // console.log("state test: Start: 2")
    this.states = [...StateJson];
    this.states = await lodash.filter(this.states, { 'CountryId': countryId });
    return this.states;
    /*  this.apiService.getStateList(countryId)
       .subscribe(response => {
         this.states = response?.ResponseData || [];
         if (this.states.length > 0) {
           this.storageService.storeStates(this.states, countryId);
         }
         console.log("state test: End: 2")
         // this.getCityList(22); //Manoj REMOVE
       }); */
  }

  /** Get All State List for selected country */
  public async getCityList(stateId: number) {
    this.cities = [...CityJson];
    this.cities = await lodash.filter(this.cities, { 'StateId': stateId });
    return this.cities;
    //this.commonService.showLoader();
    /* this.apiService.getCityList(stateId)
      .subscribe(response => {
        this.commonService.hideLoader();
        this.cities = response?.ResponseData || [];
        if (this.cities.length > 0) {
          this.storageService.storeCities(this.cities, stateId);
        }
      }); */
  }

  public getPhoneCode(ctryId: number) {
    console.log(ctryId, "check for country code@@");
    let country = lodash.find(this.countries, { CountryId: ctryId });
    // let country = lodash.find(this.countries, { PhoneCode: ctryId }); this should be code here then country code will be fixed@@
    console.log(this.countries, "country code is@@");
    if (country) {
      return country.PhoneCode;
    }
    return AppConstants.DEFAULT_PHONE_CODE;
  }

  public findCountryIdFromPhoneCode(phoneCode: number) {
    if (!phoneCode) {
      phoneCode = AppConstants.DEFAULT_PHONE_CODE;
    }
    let country = lodash.find(this.countries, { PhoneCode: phoneCode });
    if (country) {
      return country.id;
    }
    return 0;
  }

  async getAllConutriesFromStorage() {
    return CountryJson;//await this.storageService.getCountries()?.data
  }

  // public findCountry(queryObj: any) {
  //   if (!this.countries || this.countries.length == 0) {
  //     this.countries = this.storageService.getCountries()?.data;
  //   }
  //   if (!this.countries || this.countries.length == 0) {
  //     // await this.getCountries();
  //   }
  //   let country = lodash.find(this.countries, queryObj);
  //   return country;
  // }

  public async findCountry(queryObj: any) {
    // console.log("findCountry: Start: ", queryObj);
    return new Promise<any>(async (resolve, reject) => {
      let country: any;
      this.countries = await this.getCountryList();
      if (queryObj.all) {
        resolve(this.countries);
      }
      else {
        country = lodash.find(this.countries, queryObj);
        resolve(country);
      }

      /*   if (!this.countries || this.countries.length == 0) {
          this.apiService.getCountryList()
            .subscribe(response => {
              this.countries = response?.ResponseData || [];
              if (this.countries.length > 0) {
                this.storageService.storeCountries(this.countries);
                console.log("findCountry: ", this.countries?.length);
                if (queryObj.all) {
                  resolve(this.countries);
                }
                else {
                  country = lodash.find(this.countries, queryObj);
                  resolve(country);
                }
              }
              else {
                console.log("findCountry: Countries NULL");
                resolve([]);
              }
  
            });
        }
        else {
          console.log("findCountry: ", this.countries?.length);
          if (queryObj.all) {
            resolve(this.countries);
          }
          else {
            country = lodash.find(this.countries, queryObj);
            resolve(country);
          }
  
        } */
    });
  }

  public async findState(countryId: number, queryObj: any) {
    return new Promise<any>(async (resolve, reject) => {
      let state: any;
      let states = await this.getStateList(countryId);//this.storageService.getStates(countryId)?.data;
      if (queryObj.all) {
        resolve(states);
      }
      else {
        state = await lodash.find(states, queryObj);
        resolve(state);
      }


      /*   if (!states || states.length == 0) {
        this.apiService.getStateList(countryId)
          .subscribe(response => {
            states = response?.ResponseData || [];
            if (states.length > 0) {
              this.storageService.storeStates(states, countryId);
              console.log("findState: ", states?.length);
              if (queryObj.all) {
                resolve(states);
              }
              else {
                state = lodash.find(states, queryObj);
                resolve(state);
              }
            }
            else {
              console.log("findState: States NULL");
              resolve([]);
            }

          });
      }
      else {
        console.log("findState: ", states?.length);
        if (queryObj.all) {
          resolve(states);
        }
        else {
          state = lodash.find(states, queryObj);
          resolve(state);
        }

      } */
    });

    // let states = this.storageService.getStates(countryId)?.data;
    // if (!states || states.length == 0) {
    //   // await this.getStateList();//TODO Manoj: Pending to search if state list is not loaded for country
    // }
    // console.log("findState: ", states?.length);
    // let state = lodash.find(states, queryObj);
    // return state;
  }

  public async findCity(stateId: number, queryObj: any) {
    return new Promise<any>(async (resolve, reject) => {
      let city: any;
      let cities = await this.getCityList(stateId);//this.storageService.getCities(stateId)?.data;
      if (queryObj.all) {
        resolve(cities);
      }
      else {
        city = await lodash.find(cities, queryObj);
        resolve(city);
      }

      /*   if (!cities || cities.length == 0) {
        this.apiService.getCityList(stateId)
          .subscribe(response => {
            cities = response?.ResponseData || [];
            if (cities.length > 0) {
              this.storageService.storeCities(cities, stateId);
              console.log("findCity: ", cities?.length);
              if (queryObj.all) {
                resolve(cities);
              }
              else {
                city = lodash.find(cities, queryObj);
                resolve(city);
              }

            }
            else {
              console.log("findCity: Cities NULL");
              resolve([]);
            }

          });
      }
      else {
        console.log("findCity: ", cities?.length);
        if (queryObj.all) {
          resolve(cities);
        }
        else {
          city = lodash.find(cities, queryObj);
          resolve(city);
        }
      } */
    });

    // let cities = this.storageService.getCities(stateId)?.data;
    // if (!cities || cities.length == 0) {
    //   // await this.getStateList();
    // }
    // console.log("findCity: ", cities?.length);
    // let city = lodash.find(cities, queryObj);
    // return city;
  }


  getFlagIconName(listEntry: any) {
    if (listEntry) {
      let name: string = listEntry.CountryName || listEntry;
      name = name.toLowerCase();
      let formmattedName = "";
      let nameA = name.split(" ");
      if (nameA && nameA.length) {
        nameA.forEach(element => {
          formmattedName = formmattedName + "-" + element
        });
        if (formmattedName.startsWith("-")) {
          formmattedName = formmattedName.substring(1);
        }
        return formmattedName;
      }
      // name = name.replace("^.* .*$", "-");//^.*Test.*$
      // name = name.replace("%20", "-");
      return name;
    }
    return "";
  }

  getFlagIconPath(listEntry: any) {
    if (!listEntry || listEntry['imgError']) {
      return "assets/dummy/avatar2.png"
    }
    else {
      let iconName = this.getFlagIconName(listEntry);
      return "assets/flags/" + iconName + ".png";
    }
  }

}
