import { Injectable } from '@angular/core';
import { KEY_CITIES, KEY_COUNTRIES, KEY_STATES, KEY_TEMP_USER } from '../models/config/KeyNames';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  data_noti: any = [];

  constructor() { }
  getToken() {
    let data: any = localStorage.getItem("token");
    return data;
  }
  getUserData() {
    let data: any = localStorage.getItem('userData');
    return JSON.parse(data)
  }

  /*  storeCountries(countries: any) {
     let dataSet = { timestamp: new Date(), data: countries }
     localStorage.setItem(KEY_COUNTRIES, JSON.stringify(dataSet));
   }
 
   getCountries() {
     let data: any = localStorage.getItem(KEY_COUNTRIES);
     return data ? JSON.parse(data) : data;
   }
 
   storeStates(states: any, countryId: number) {
     let dataSet = { timestamp: new Date(), data: states }
     localStorage.setItem(KEY_STATES + "_" + countryId, JSON.stringify(dataSet));
   }
 
   getStates(countryId: number) {
     let data: any = localStorage.getItem(KEY_STATES + "_" + countryId);
     return data ? JSON.parse(data) : data;
   }
 
   storeCities(cities: any, stateId: number) {
     let dataSet = { timestamp: new Date(), data: cities }
     localStorage.setItem(KEY_CITIES + "_" + stateId, JSON.stringify(dataSet));
   }
 
   getCities(stateId: number) {
     let data: any = localStorage.getItem(KEY_CITIES + "_" + stateId);
     return data ? JSON.parse(data) : data;
   } */

  // storeTempUser(user: any, step: number) {
  //   let dataSet = { timestamp: new Date(), data: user, step: step }
  //   localStorage.setItem(KEY_TEMP_USER, JSON.stringify(dataSet));
  // }

  // getTempUser() {
  //   let data: any = localStorage.getItem(KEY_TEMP_USER);
  //   return data ? JSON.parse(data) : data;
  // }

  // clearTempUser() {
  //   localStorage.removeItem(KEY_TEMP_USER);
  // }


  saveNotification(notificationData: any, date: string) {
    var key = "NOTIFICATION_" + date;

    let data_1: any = localStorage.getItem(key);
    console.log("data", data_1);
    console.log("data false or true", !data_1);
    if (!data_1){
      this.data_noti = [];
    }
    this.data_noti.push(notificationData);
    
    
    console.log("notification", notificationData)
    console.log("data array", this.data_noti);
    localStorage.setItem(key, JSON.stringify(this.data_noti));
  }

  ReadNotification(date: string) {
    var key = "NOTIFICATION_" + date;
    let data: any = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

}
