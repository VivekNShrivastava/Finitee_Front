import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { MapService } from 'src/app/pages/map/services/map.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { UserLocation } from 'src/app/pages/map/models/Location';
import { SonarPage } from '../../sidemenu/settings-privacy/sonar/sonar.page';

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss'],
})
export class MapSearchComponent implements OnInit {
  tempOtherSearchTerm = false;
  searchMode: 'N' | 'P' | 'L' = 'N';
  searchTypeString = '';
  progressBar = false;
  searchType = [
    { label: 'All', isChecked: false, value: 'All' },
    { label: 'Users', isChecked: false, value: 'U' },
    { label: 'Donations', isChecked: false, value: 'D' },
    { label: 'Connections', isChecked: false, value: 'C' },
    { label: 'Service required', isChecked: false, value: 'SR' },
    { label: 'Businesses', isChecked: false, value: 'B' },
    { label: 'Service available', isChecked: false, value: 'SA' },
    { label: 'NonProfits', isChecked: false, value: 'N' },
    // { label: 'Promotions', isChecked: false, value: 'P' },
    { label: 'Totems', isChecked: false, value: 'TT' },
    // { label: 'Finitee specials', isChecked: false, value: 'FS' },
    { label: 'Buy', isChecked: false, value: 'S' },
    // { label: 'Connected Members', isChecked: false, value: 'C' },
    // { label: 'Individual Users', isChecked: false, value: 'F' },
    { label: 'Events', isChecked: false, value: 'E' },
    // { label: 'Sales', isChecked: false, value: 'SA' }

  ];
  pages: any;
  showLevel1 = null;
  radius = 2;
  duration = 60;
  durationLimit = {
    lower: 60,
    upper: 600
  };
  connType: any = 'All';
  keyinfo: any = null;
  ageMinMax = {
    lower: 18,
    upper: 80
  };
  frequencyLimit = {
    lower: 10,
    upper: 60
  };
  radiusLimit = {
    lower: 1,
    upper: 1500
  };
  showLevel2 = null;
  logInfo!: FiniteeUser;
  mapParams: any;
  setPingObj: any = {};
  pingDuration = 1;
  frequency = 10;
  googleAutocomplete: any;
  autocompleteItems: any[];
  constructor(
    public httpService: HttpClient,
    public alertController: AlertController,
    public navParams: NavParams,
    public modalController: ModalController,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public mapService: MapService
  ) {
    this.mapParams = this.navParams?.data?.['values'];
    this.googleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
  }

  toggleLevel1(idx: null) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  }

  toggleLevel2(idx: null) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  }
  isLevel1Shown(idx: null) {
    return this.showLevel1 === idx;
  }

  isLevel2Shown(idx: null) {
    return this.showLevel2 === idx;
  }
  async ngOnInit() {
    this.logInfo = this.authService.getUserInfo();
    for (let i = 0; i < this.searchType.length; i++) {
      if (this.searchType[i].value == 'All' && this.logInfo.UserTypeId == 1) {
        this.searchType[i].isChecked = true;
      }
      if (this.searchType[i].value == 'C' && this.logInfo.UserTypeId != 1) {
        this.searchType[i].isChecked = true;
      }
    }
    this.mapService.getAppSetting(Number(this.logInfo.UserId)).subscribe(
      (val) => this.radius = val.map.km
    );
    this.searchMode = 'N';
    this.setPingObj = {};
  }
  async ionViewDidEnter() {
    if (this.navParams.data['values'].searchCriteria) {
      const searchCriteria = this.navParams.data['values'].searchCriteria;
      this.clearExistingSearchCriteria();
      this.keyinfo = searchCriteria.key;
      if (searchCriteria.age) {
        this.ageMinMax = {
          lower: Number(searchCriteria.age.MinAge),
          upper: Number(searchCriteria.age.MaxAge)
        };
      }

      this.radius = searchCriteria.km;
      this.frequency = searchCriteria.frequency || this.frequencyLimit.lower;
      this.duration = searchCriteria.duration || this.durationLimit.lower;
      const tempS = searchCriteria.type.split(',');
      this.searchType.forEach((val, idx) => {
        this.searchType[idx].isChecked = tempS.indexOf(val.value) > -1;
      });
    } else {
      this.searchType[0].isChecked = true;
      this.searchTypeChanged('All');
    }
  }
  clearExistingSearchCriteria() {
    this.progressBar = false;
    this.searchType.forEach(val => val.isChecked = false);
  }
  getUserPingSearch() {
    const params = {
      id: this.mapParams.id,
      flag: this.searchMode == 'N' || null
      // flag: this.isSearchMode ? this.isSearchMode : null
    };

    const method = config.GET_USR_PING_SER;
    // console.log(method, params);
    this.httpService.post(method, params)
      .subscribe(async (result: any) => {
        if (result.ResponseData != null) {
          this.setPingObj = result.ResponseData;
          if (this.searchMode == 'P') {
            this.keyinfo = this.setPingObj.kyw;
            this.ageMinMax.lower = parseInt(this.setPingObj.age.split(',')[0], 0);
            this.ageMinMax.upper = parseInt(this.setPingObj.age.split(',')[1], 0);
            this.radius = this.setPingObj.km;
            this.connType = this.setPingObj.ustype;
          }
        } else {
          this.setPingObj = {};
        }
      });
  }

  applySetting() {
    const obj = {
      status: 'O'
    };
    try {
      this.modalController.dismiss(obj);
    } catch (e) {
      // click more than one time popover throws error, so ignore...
    }
  }

  setUsPing() {
    // this.setSearchOptions();
    // const currentHours = new Date().getHours();
    // const params = {
    //   id: this.mapParams.id,
    //   lat: this.mapParams.lat,
    //   lng: this.mapParams.lng,
    //   key: this.keyinfo == undefined ? null : this.keyinfo,
    //   age: {
    //     MinAge: +this.ageMinMax.lower,
    //     MaxAge: +this.ageMinMax.upper
    //   },
    //   km: this.radius,
    //   type: this.searchTypeString.length > 0 ? this.searchTypeString : 'All',
    //   buyorsell: null,
    //   dt: new Date(),
    //   ustypid: this.logInfo.UserTypeId,
    //   flag: 'P',
    //   pplr: null,
    //   isprt: 0,
    //   fdt: new Date(),
    //   tdt: new Date(),
    // };
    // let method: string;
    // let isNewPing = false;
    // if (Object.entries(this.setPingObj).length == 0) {
    //   method = config.INS_PING_SER;
    //   isNewPing = true;
    // } else {
    //   method = config.UPD_PING_SER;
    // }
    // // console.log(method, params);
    // this.httpService.post(method, params)
    //   .subscribe(async (result: any) => {
    //     const obj = {
    //       oneTimeSearch: false,
    //       key: this.keyinfo == undefined ? null : this.keyinfo,
    //       age: {
    //         MinAge: +this.ageMinMax.lower,
    //         MaxAge: +this.ageMinMax.upper
    //       },
    //       km: this.radius,
    //       type: this.searchTypeString ? this.searchTypeString : 'All',
    //       bysl: null,
    //       pplr: null,
    //       isprt: 0,
    //       status: null,
    //       frequency: this.frequency,
    //       duration: this.duration
    //     };
    //   });
  }

  closeModal() {
    this.modalController.dismiss().then(v => console.log('modalDismissed', v));
  }

  async isSearchPopup() {
    const alert = await this.alertController.create({
      header: 'Sonar',
      message: 'Search',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Search',
          role: 'search',
          handler: (blah) => {
            this.searchMode = 'N';
            this.setPingObj = {};
            this.getUserPingSearch();
          }
        }, {
          text: 'Ping',
          handler: () => {
            this.searchMode = 'P';
            this.getUserPingSearch();
          }
        }
      ]
    });
    await alert.present();
  }
  async presentAlertConfirm(existingPing = false) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: existingPing ? `Set as ping` : '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Activate',
          role: 'activated',
          cssClass: 'isactive',
          handler: (blah) => {
            // this.isActivatePing('1');
          }
        }, {
          text: 'Cancel',
          cssClass: 'isdeactive',
          handler: () => {
            // this.isActivatePing('0');
          }
        }
      ]
    });
    await alert.present();
  }

  // async isActivatePing(flag: '0' | '1') {

  //   const params = {
  //     id: this.mapParams.setting.pvid,
  //     usrid: this.logInfo.UserId,
  //     isactive: flag,
  //     lat: this.mapParams.lat,
  //     lng: this.mapParams.lng,
  //     dt: new Date(),
  //     radius: this.mapParams.radius,
  //     ustypid: this.logInfo.UserTypeId,
  //     flag: 'P'
  //   };
  //   const method = config.DEC_PING_SER;
  //   this.httpService.post(method, params)
  //     .subscribe(
  //       async (result: any) => {
  //         let obj = {
  //           oneTimeSearch: false,
  //           key: this.keyinfo == undefined ? null : this.keyinfo,
  //           age: {
  //             MinAge: +this.ageMinMax.lower,
  //             MaxAge: +this.ageMinMax.upper
  //           },
  //           km: this.radius,
  //           type: this.searchTypeString ? this.searchTypeString : 'All',
  //           bysl: null,
  //           pplr: null,
  //           isprt: 0,
  //           status: null,
  //           frequency: this.frequency,
  //           duration: this.duration
  //         };
  //         // console.log(method, result, status);
  //         if (flag == '1') {
  //           const endTime = Date.now() + (this.duration * 1000);
  //         }
  //       },
  //       error => {
  //         this.closeModal();
  //         // console.log('deactivate ping - error', error);
  //       }
  //     );
  // }

  async oneTimeSearch() {
    console.log("clicked map-search.components", this.searchType);
    this.setSearchOptions();
    this.progressBar = true;
    this.mapService.oneTimeSearch(
      // {
      //   age: {
      //     MinAge: +this.ageMinMax.lower,
      //     MaxAge: +this.ageMinMax.upper
      //   },
      //   bysl: null,
      //   isprt: 0,
      //   key: this.keyinfo == undefined ? null : this.keyinfo,
      //   km: this.radius,
      //   pplr: null,
      //   type: this.searchTypeString.length > 0 ? this.searchTypeString : 'All',
      // },
      // this.logInfo, 
      // <UserLocation>
      // {
      //   lat: this.mapParams.lat,
      //   lng: this.mapParams.lng
      // }, 
      {
        geolocation: { latitude: 19.2616678, longitude: 72.9630232 },
        searchKey: this.keyinfo || "",
        scope: this.radius,
        freeUser: this.searchType[1].isChecked,
        connections: this.searchType[3].isChecked,
        businessUser: this.searchType[5].isChecked,
        nonProfitUser: this.searchType[7].isChecked,
        events: this.searchType[10].isChecked,
        sales: this.searchType[9].isChecked,
        serviceReq: this.searchType[4].isChecked,
        serviceAvailable: this.searchType[6].isChecked,
      }
    ).subscribe(response => {
      this.progressBar = false;
      // const searchTerms = {
      //   oneTimeSearch: true,
      //   key: this.keyinfo == undefined ? null : this.keyinfo,
      //   age: {
      //     MinAge: +this.ageMinMax.lower,
      //     MaxAge: +this.ageMinMax.upper
      //   },
      //   km: this.radius,
      //   type: this.searchTypeString.length > 0 ? this.searchTypeString : 'All',
      //   bysl: null,
      //   pplr: null,
      //   isprt: 0,
      // };
      this.modalController.dismiss(response);
    });
  }
  searchTypeChanged(typeCode: string) {
    if (this.tempOtherSearchTerm) {
      this.tempOtherSearchTerm = false;
      return;
    }
    if (typeCode == 'All') {
      const allUserOption = this.searchType.filter(val => val.value == 'All')[0];
      for (const idx in this.searchType) {
        this.searchType[idx].isChecked = allUserOption.isChecked;
        if (['B', 'N', 'C'].indexOf(this.searchType[idx].value) > -1) {
          this.searchType[idx].isChecked = allUserOption.isChecked;
        }
      }
    } else {
      const thistype = this.searchType.filter(val => val.value == typeCode)[0].isChecked;
      if (!thistype) {
        this.searchType.forEach(val => {
          if (val.value == 'All') {
            val.isChecked = false;
            this.tempOtherSearchTerm = true;
          }
        });
      }
    }
  }
  setSearchOptions() {
    this.searchTypeString = '';
    for (let i = 0; i < this.searchType.length; i++) {
      const element = this.searchType[i];
      if (element.isChecked) {
        this.searchTypeString += this.searchTypeString != '' ? ', ' + element.value : element.value
      }
    }
    if (this.searchType.filter(val => val.value == 'All')[0].isChecked) {
      this.searchTypeString = 'All';
    }
  }

  async commonModal(type: 'existingPing' | 'newSearch') {
    let message = 'Are you sure?';
    if (type == 'existingPing') {
      message = 'A ping is already active. Deactivate and begin new ping?';
    }
    if (type == 'newSearch') {
      message = 'Search cannot be performed while a ping is active. Deactivate ping?';
    }
    const modal = await this.modalController.create({
      component: null,
      backdropDismiss: true,
      cssClass: 'global-common-modal',
      componentProps: {
        values: {
          title: 'Alert',
          message,
          buttons: [
            { value: 'YES', flag: 'y' },
            { class: 'red-btn', value: 'NO', flag: 'n' },
          ]
        }
      }
    });
    modal.onDidDismiss().then(res => {
      const result = res.data;
      // console.log('closed', res);
      if (result) {
        if (type == 'existingPing') {
          if (result.flag == 'y') {
            // this.isActivatePing('0');
          }
          if (result.flag == 'n') {
            this.closeModal();
          }
        }
        if (type == 'newSearch') {
          if (result.flag == 'y') {
            // this.isActivatePing('0');
          }
          if (result.flag == 'n') {
            this.closeModal();
          }
        }
      }
    });
    return await modal.present();
  }

  UpdateSearchResults(text: string) {
    if (text == '') {
      this.autocompleteItems = [];
      return;
    }
    this.googleAutocomplete.getPlacePredictions({ input: text }, (predictions: any, status: any) => {
      this.autocompleteItems = [];
      predictions.forEach((prediction: any) => {
        this.autocompleteItems.push(prediction);
      });
    });
  }

  SelectSearchResult(item: any) {
    this.getLatLngFromAddress(item.description)
  }

  getLatLngFromAddress(address: any) {

    var geocoder = new google.maps.Geocoder();
    let self = this;
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        self.modalController.dismiss({
          lat: results?.length ? results[0].geometry.location.lat() : 0,
          lng: results?.length ? results[0].geometry.location.lng() : 0,
          status: 'L'
        });
      } else {
        // console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  }
}
