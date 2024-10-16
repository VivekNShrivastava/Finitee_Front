import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { IonModal, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import * as config from '../../core/models/config/ApiMethods';
import * as icons from '../../core/models/config/FiniteeIcon';
import { NotificationEvents } from '../../core/models/notification/NotificationEvents';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { SignalRService } from '../../core/services/signal-r.service';
import { MapSearchComponent } from './map-search/map-search.component';
import { MarkerInfoComponent } from './marker-info/marker-info.component';
import { MarkerDetailComponent } from './marker-detail/marker-detail.component';
import { FiniteeService } from "./models/FiniteeService";
import { UserLocation } from './models/Location';
import { mapStyle } from './models/MapOptions';
import { TotemSearchResult, FiniteeUserOnMap } from './models/MapSearchResult';
import { MarkerInfo, MarkerType } from './models/MarkerInfo';
import { UserOnMap } from './models/UserOnMap';
import { MapService } from './services/map.service';
import { ViewingUsersComponent } from './viewing-users/viewing-users.component';
import { App } from '@capacitor/app';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { MapResultComponent } from './map-result/map-result.component';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { LocationService } from 'src/app/core/services/location.service';
import { AddressMap, Area } from 'src/app/core/models/places/Address';

import { FirestoreService } from 'src/app/core/services/firestore.service';

const LOCATION_UPDATE_TIME = 20;
const ZOOM_MAX = 15;
const MAP_INIT_ZOOM = 13;
export enum MapFlag {
  Ping = 'P',
  ShoppingList = 'S'
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnDestroy {
  @ViewChild('map_canvas') mapRef?: ElementRef<HTMLElement>;
  @ViewChild('sonarSettingModal') sonarSettingModal?: IonModal;
  @ViewChild('markerDetailModal') markerDetailModal?: IonModal;
  // @ViewChild(IonModal) sonarSettingModal?: IonModal;

  public mapWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  public map?: google.maps.Map = undefined;
  public location: UserLocation = new UserLocation();
  currentPageHref!: any;

  currentLocationMarker: any;
  businessLocationMarker: any;
  resultCount = 0;
  user: any;
  public intervalTimer = interval(LOCATION_UPDATE_TIME);
  state: any;
  enabled?: boolean;
  cmmflag?: MapFlag;
  isMoving?: boolean;
  stopOnTerminate = true;
  commData: any = [];
  markers: google.maps.Marker[] = <google.maps.Marker[]>[];
  totemMarkers: any = [];
  userMarkers: any[] = [];
  viewingMeList: UserOnMap[] = <UserOnMap[]>[];
  totusr_markers: any = [];
  searchMarkers: any = [];
  ser_usr_mark: any = [];
  markerCluster?: MarkerClusterer;
  radius = 5;
  // UI State
  isZoomOut = false;
  scheduleTime: any;
  userInfo = [];
  totemData: any = [];
  islocationEnabled = true;
  GRequestLst: any;
  isBackEnabled = true;
  // storage: any;
  privacySett: any = {};
  compRef?: ComponentRef<MarkerInfoComponent>;
  mainResultFromSearch = [];
  searchCriteria = null;
  isPingActive = false;
  pingResults = [];
  isPlatformReady = false;
  workingMapPage = false;
  sonarListmarkers: any = [];
  chat: any;
  styles = mapStyle;
  totemList: any = [];
  userList = [];
  customMarker = [];
  circle: any;
  circleInterval: any;
  totemMarkersOnSerach = [];
  mapSearchResult: any;
  limit = 10;

  viewList: any = [];
  viewListNumber: number = 0;
  eventListen: any;

  //https://arminzia.com/blog/working-with-google-maps-in-angular/
  mapCenter!: google.maps.LatLng;
  markerCurrentIndex = -1;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  private firestoreSubscription: Subscription | null = null;

  currentArea: Area = {
    Coordinate: {
      Latitude: 0.0,
      Longitude: 0.0,
    },
    Locality: "",
    City: "",
    Zip: "",
    State: "",
    Country: "",
    CountryId: -1
  };

  newLat: any;
  newLng: any;

  constructor(
    private platform: Platform,
    private mapService: MapService,
    private http: HttpClient,
    private authService: AuthService,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private menu: MenuController,
    private _ngZone: NgZone,
    public navController: NavController,
    public router: Router,
    public modalController: ModalController,
    // private _signalRService: SignalRService,
    public _commonService: CommonService,
    public _chatsService: ChatsService,
    public swipeService: SwipeService,
    private locationService: LocationService,
    private firestoreService: FirestoreService
  ) {
    this.user = this.authService.getUserInfo();

    // this.firestoreService.viewList$.subscribe(updatedData => {
    //   console.log("map updated data", updatedData);
    //   this.viewList = updatedData
    //   this.viewListNumber = this.viewList?.names?.length
    //   console.log("res -", this.viewListNumber);
    // })

    this.firestoreSubscription = this.firestoreService.viewList$.subscribe(updatedData => {
      console.log("map updated data", updatedData);
      this.viewList = updatedData;
      this.viewListNumber = this.viewList?.names?.length;
      console.log("res -", this.viewListNumber);
    });
  }



  async ngOnInit() {
    this.currentPageHref = window.location.pathname;
    console.log("Map: Init: window: ", window.history);
    await this.platform.ready();
    await this.mapService.getAppSetting(this.user.UserId).subscribe(
      (s: any) => {
        this.radius = s.map.km;
      }
    );
    await this.mapService.getUserSetting('ivsbl').subscribe(
      (s: any) => {
        this.isBackEnabled = s;
      }
    );
    this._commonService.loadUserGreetings();
    let privacyList = localStorage.getItem('privacyList') ? JSON.parse(localStorage.getItem('privacyList') ?? '') : null;
    if (privacyList?.length) {
      this.privacySett = privacyList;
      if (this.privacySett.mst == null) {
        this.deleteSearch();
      }
      if (!!this.location) {
        this.updatelocation();
      }
    }
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter - maps");
    this.firestoreSubscription = this.firestoreService.viewList$.subscribe(updatedData => {
      // console.log("map updated data", updatedData);
      this.viewList = updatedData;
      this.viewListNumber = this.viewList?.names?.length;
      // console.log("res -", this.viewListNumber);
    });

  }

  ionViewWillLeave() {
    // this.authService.stopFirebase();
    console.log("ionViewWillLeave...");
    console.log(this.user);
    this.firestoreService.deleteFieldFromDocuments(this.user.UserId)


    if (this.firestoreSubscription) {
      this.firestoreSubscription.unsubscribe();
    }
    this.commData = [];
    this.totemData = [];
    if (!!this.mapWindow) {
      this.mapWindow.close();
    }
    if (!!this.compRef) {
      this.compRef.destroy();
    }
    if (this.subscription && !this.isPingActive) {
      this.subscription.unsubscribe();
      this.subscription.remove(this.subscription);
    }
    this.deleteSearch();
    this.intervalTimer = interval(60000);
  }

  async ngAfterViewInit() {
    await this.platform.ready();
    this.loadMap();
    this.fetchCurrentArea();
  }

  ionTabsWillChange() {
    console.log("ionTabsWillChange");
  }

  ngOnDestroy() {
    console.log('destroy tab5');
    // if (this.firestoreSubscription) {
    //   this.firestoreSubscription.unsubscribe();
    // }
    // this.events.unsubscribe('active:user');
    // this.events.unsubscribe('greeting:tab5');
    // this.events.unsubscribe('sonar:tab5');
    // this.authService.stopFirebase();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription.remove(this.subscription);
    }
  }

  fetchCurrentArea() {

    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      console.log("MAP fetchCurrentArea observeReverseGeocodingResult: ", address);
      
    });
    this.currentArea = this.locationService.getCurrentArea();
      console.log("MAP fetchCurrentArea Area: ", this.currentArea);

    this.locationService.requestPermissions();
    this.locationService.fetchCurrentCoordinate(true);
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
          //  console.log(error);
        }, options);
        setTimeout(() => {
          this.loadMap();
        }, 5000);
        return;
      }

      this.refreshMap();
      this.mapService.hideLoader();
      this.map.addListener("click", () => {
        if (this.mapWindow) {
          this.mapWindow.close();
        }
      });
      this.mapService.hideLoader();

      if (this.location?.lat) {
        localStorage.setItem('location', JSON.stringify(this.location));
      }
      this.setCurrentLocationMarker();
    }
  }


  async setCurrentLocationMarker() {
    if (this.user?.UserTypeId != '2') {
      if (this.location && this.location.lat) {
        if (this.currentLocationMarker) this.currentLocationMarker.setMap(null);
        this.currentLocationMarker = new google.maps.Marker({
          position: this.location,
          map: this.map,
          title: "You are here",
          // draggable: true,
          icon: !this.isBackEnabled ? 'assets/markers/curr-invisible.svg' : 'assets/markers/curr.svg',
        });

        // this.currentLocationMarker.addListener('dragend', (event: any) => {
        //   const newPosition = this.currentLocationMarker.getPosition();
        //   this.newLat = newPosition.lat();
        //   this.newLng = newPosition.lng();

        //   // Do something with the new coordinates (newLat, newLng)
        //   console.log('New Marker Position:', this.newLat, this.newLng );
        //   const latln = {lat : this.newLat, lng: this.newLng}
        //   const add = this.locationService.getAddressFromLatLng(latln);
        //   console.log("new add", add);
        // });
      }
    } else {
      if (this.location && this.location.lat) {
        if (this.businessLocationMarker) this.businessLocationMarker.setMap(null);
        this.businessLocationMarker = new google.maps.Marker({
          position: this.location,
          map: this.map,
          title: "business",
          icon: !this.isBackEnabled ? 'assets/markers/business-icon-invisible.svg' : 'assets/markers/business-icon.svg',
        });
      }
    }
  }

  private refreshMap(): void {
    this.clearMap();
    let Latitude = this.location?.lat;
    let Longitude = this.location?.lng;
    let RangeInKm = 2
    this.getTotemByUserId(Latitude, Longitude, RangeInKm);
    this.loadSavedLocation();
  }

  async loadSavedLocation() {
    await this.http.get(config.Get_Saved_Location).subscribe(async (res: any) => {
      this._commonService.savedSonarLocations = [];
      if (res.ResponseStatus == "OK" && res.ResponseData.length > 0) {
        this._commonService.savedSonarLocations = res.ResponseData;
        await this.sonarListmarkers.forEach((marker: google.maps.Marker) => {
          marker.setMap(null);
        })
        this.sonarListmarkers = [];
        let indexS = 0;
        this._commonService.savedSonarLocations.forEach(async (eachLocation: any) => {
          let markerOption: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
            position: { lat: eachLocation.Latitude, lng: eachLocation.Longitude },
            icon: eachLocation.Flag == 'N' ? icons.ADD_TO_SONAR_NONPROFIT : icons.ADD_TO_SONAR_BUSINESS,
            title: eachLocation.Title
          };

          const marker: any = await this.addMarkerToMap(markerOption, 'Sonar');
          marker.markerData = <MarkerInfo<FiniteeService>>{
            data: eachLocation,
            MarkerType: MarkerType.SavedLocation,
            itemIndex: indexS
          };
          marker.addListener("click", (markerdetail: any) => {
            this.onMarkerClick(marker);
          });
          this.sonarListmarkers.push(marker);
          indexS++;
        })
      }
    });
  }

  private clearMap(): void {
    this.resultCount = 0;
    this.totemMarkers = [];
    this.userMarkers = [];
    this.totusr_markers = [];
    this.isZoomOut = false;
    this.currentLocationMarker = null;
    this.totemMarkersOnSerach = [];
  }

  async getTotemByUserId(lat: number, lng: number, rangeInKm: number) {
    this.mapService.showLoader();
    const localStorageLocation: any = await localStorage.getItem('location');
    const params = {
      Latitude: lat ?? localStorageLocation?.Latitude,
      Longitude: lng ?? localStorageLocation?.Longitude,
      RangeInKm: rangeInKm,
    };
    this.mapService.get(config.GET_ALL_USER_TOTEM_V1).subscribe((s: any) => {
      this.mapService.hideLoader();
      if (s?.ResponseData?.length) {
        const sd = s.ResponseData;
        if (sd.length) {
          this.addTotemToMap(sd, 0);//TODO Manoj Index check
        }
      }
    });
  }

  async addMarkerToMap(obj: google.maps.MarkerOptions, caller?: string) {
    let marker = new google.maps.Marker({
      position: obj.position,
      map: this.map,
      title: obj.title,
      icon: obj.icon,
    });
    if (caller != 'Sonar') {
      this.markers.push(marker);
    }
    marker.setMap(this.map ?? null);
    this.setClusters(this.markers);
    return marker
  }

  removeCluster() {
    this.markerCluster?.clearMarkers();
  }

  setCircle = (data: any) => {
    if (this.circle) this.circle.setMap(null);
    if (this.circleInterval) clearInterval(this.circleInterval)
    var populationOptions: google.maps.CircleOptions = {
      strokeColor: '#03a9f5',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#03a9f5',
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: this.location.lat, lng: this.location.lng },
      radius: +(data.km) * 100
    };
    this.circle = new google.maps.Circle(populationOptions);
    setTimeout(() => {
      this.removeCircle();
    }, data.duration * 1000);
    /* Creating a circle on the map and then animating it. */
    var _radius = populationOptions.radius ?? 0;
    var rMin = _radius * 4 / 5;
    var rMax = _radius;
    var direction = 1;
    const self = this;
    this.circleInterval = setInterval(function () {
      var radius = self.circle.getRadius();
      if ((radius > rMax) || (radius < rMin)) {
        direction *= -1;
      }
      var _par = (radius / _radius) - 0.7;
      populationOptions.radius = radius + direction * 10;
      populationOptions.fillOpacity = 0.6 * _par;
      self.circle.setOptions(populationOptions);
    }, 80);
  }

  removeCircle() {
    if (!this.circle) return
    if (this.circleInterval) clearInterval(this.circleInterval)
    this.circle?.setMap(null);
  }

  removeSearchResultFromMap() {
    const forLoop = async (i: any) => {
      if (i < this.markers.length) {
        this.markers[i].setMap(null);
        forLoop(i + 1)
      } else {
        this.markers = [];
      }
    }
    forLoop(0);
  }

  async refreshMarker() {
    this.removeSearchResultFromMap();
    await this.loadSavedLocation();
    let result = this.mapSearchResult
    if (result?.data) {
      if (result.data?.status == 'L') {

        let Latitude = result.data?.lat;
        let Longitude = result.data?.lng;
        let RangeInKm = 2;

        this.getTotemByUserId(Latitude, Longitude, RangeInKm);
      } else {
        this.searchCriteria = result.data;
        if (result.data?.status == 'P') {
          this.setCircle(result.data)
        }
        if (result.data.oneTimeSearch) {
          result.data[`location`] = this.location;
          this.markers = [];
          this.searchResultUpdate();
        } else {
          this.clearMap();
          if (result.data != undefined && result.data != null) {
            this.cmmflag = result.data.status;
            this.updatelocation();
          }
        }
      }
    } else {
      this.cmmflag = this.getFlag();
      this.updatelocation();
      // this.removeCircle();
    }
  }

  //Search Result
  async searchResultUpdate() {
    this.clearMap();
    let results = this.mapService.mainList;
    this.resultCount = results.length;
    if (results.length > 0) {
      this.mainResultFromSearch = results;
      this._commonService.savedSonarLocations.forEach((val: any) => {
        results = results.filter((x: any) => val.FlagId != x.UserId)
      })
      const users = results.filter((val: any) => val.entity == 'U');
      const totems = results.filter((val: any) => val.entity == 'T');
      const serviceAvailable = results.filter((val: any) => val.entity == 'SA');
      const serviceRequired = results.filter((val: any) => val.entity == 'SR');
      let indexResultItem = 0;
      if (users.length > 0) { indexResultItem = this.addUserToMap(users, indexResultItem); }
      if (totems.length > 0) { indexResultItem = this.addTotemToMap(totems, indexResultItem); }
      if (serviceAvailable.length > 0) { indexResultItem = this.addServiceToMap(serviceAvailable, 'SA', indexResultItem); }
      if (serviceRequired.length > 0) { indexResultItem = this.addServiceToMap(serviceRequired, 'SR', indexResultItem); }
      this.totemMarkersOnSerach = results;
      this.clearAddCurrentLocationMarker();
      this.mapBoundsToFitMarker(this.markers);
    } else {
      this.mainResultFromSearch = [];
      this.removeSearchResultFromMap();
      console.log('No Results Found');
      this.clearAddCurrentLocationMarker();
    }
  }

  addUserToMap(users: FiniteeUserOnMap[], startIndexInResult: number, isViewing: boolean = false) {
    users.forEach(async (res: FiniteeUserOnMap) => {
      // remove user if existing
      let isExist = false;
      this.userMarkers.forEach((oldmarker: any) => {
        let oldMarkerData: MarkerInfo<FiniteeUserOnMap> = oldmarker;
        if (oldMarkerData?.data?.UserId == res.UserId) {
          isExist = true;
          oldmarker.setMap(null);
        }
      });

      // add user with new details
      let userData = this.setUserData(res);
      let icon: string = "";
      let templateView: string = "";

      const { UserTypeId, IsConnected } = res;
      switch (UserTypeId) {
        case 1:
          icon = IsConnected ? icons.CONNECTED_USER : icons.UNCONNECTED_USER;
          templateView = MarkerType.FreeUser;
          break;
        case 2:
          icon = IsConnected ? icons.CONNECTED_BUSINESS : icons.UNCONNECTED_BUSINESS;
          templateView = MarkerType.BusinessNonProfitUser;
          break;
        case 3:
          icon = IsConnected ? icons.CONNECTED_NONPROFIT : icons.UNCONNECTED_NONPROFIT;
          templateView = MarkerType.BusinessNonProfitUser;
          break;
        default:
          break;
      }

      if (isViewing) {
        switch (UserTypeId) {
          case 1:
            icon = IsConnected ? icons.CONNECTED_USER_VIEWING : icons.UNCONNECTED_USER_VIEWING;
            break;
          case 2:
            icon = IsConnected ? icons.CONNECTED_BUSINESS_VIEWING : icons.UNCONNECTED_BUSINESS_VIEWING;
            break;
          case 3:
            icon = IsConnected ? icons.CONNECTED_NONPROFIT_VIEWING : icons.UNCONNECTED_NONPROFIT_VIEWING;
            break;
          default:
            break;
        }
      }

      let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
        position: { lat: userData.Latitude, lng: userData.Longitude },
        icon: icon,
        title: userData.UserName
      };

      let marker = await this.addMarkerToMap(markerOptions);
      marker.set('markerData', <MarkerInfo<FiniteeService>>{
        data: userData,
        MarkerType: templateView,
        itemIndex: startIndexInResult
      });
      marker.addListener("click", (markerdetail: any) => {
        this.onMarkerClick(marker);
      });
      if (!isExist) {
        this.userMarkers.push(userData);
        // startIndexInResult++;//??
      }
      startIndexInResult++;//??
    });
    return startIndexInResult;
  }

  displayChangedLocation = (data: any) => {
    if (data?.coords) {
      this.location.lat = data.coords.latitude;
      this.location.lng = data.coords.longitude;
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setPosition(this.location);
        this.updateCurrentLocation(this.user.UserId);
      }
    }
  }

  async updateCurrentLocation(user_id: number) {
    const method = config.UPD_LOC_V1;
    const params = {
      UserId: user_id,
      Latitude: this.location.lat,
      Longitude: this.location.lng,
    };
    await this.http.post(method, params).subscribe(result => { });
  }

  userMarkerCluster: any;
  stopPing() {
    this.searchCriteria = null;
    this.pingResults = [];
  }

  private addServiceToMap(services: FiniteeService[], serviceType: string, startIndexInResult: number) {
    services.forEach(async each => {
      // remove user if existing
      this.markers.forEach(oldmarker => {
        if (oldmarker.get('ServiceId') == each.ServiceId) {
          oldmarker.setMap(null);
        }
      });

      let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
        position: { lat: each.Latitude, lng: each.Longitude },
        icon: each.ServiceType == "A" ? icons.SERVICE_AVAILABLE : icons.SERVICE_REQUIRED,
        title: each.Title
      };

      let marker = await this.addMarkerToMap(markerOptions);
      marker.set('markerData', <MarkerInfo<FiniteeService>>{
        data: each,
        MarkerType: MarkerType.FiniteeService,
        itemIndex: startIndexInResult
      });
      startIndexInResult++;
      marker.addListener("click", () => {
        this.onMarkerClick(marker);
      });
    });
    return startIndexInResult;
  }

  addTotemToMap(totems: TotemSearchResult[], startIndexInResult: number) {
    totems.map(async (eachTotem) => {
      if (!this.totusr_markers.some((cres: any) => cres.TotemId == eachTotem.TotemId)) {

        let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
          position: { lat: eachTotem.Latitude, lng: eachTotem.Longitude },
          icon: icons.TOTEM,
          title: eachTotem.TotemTitle
        };

        this.totusr_markers.push(eachTotem);
        const marker: google.maps.Marker = await this.addMarkerToMap(markerOptions);
        marker.set("markerData", <MarkerInfo<FiniteeService>>{
          data: eachTotem,
          MarkerType: MarkerType.Totem,
          itemIndex: startIndexInResult
        });
        this.totemMarkers.push(marker);
        startIndexInResult++;
        marker.addListener("click", (markerdetail: any) => {
          this.onMarkerClick(marker);
        });
      }
    });
    return startIndexInResult;
  }

  async addToSonarList(businessList: any[], isNew = false) {
    const existingSonars = this.sonarListmarkers.map((val: any) => val.bnu_id);
    const newListIds = businessList.map(val => val.flagid);
  }

  // free-business-nonprofit-saleslisting ==> u-user, s-saleslisting
  async groupMultiReturnSingle(data: any, type: 'u' | 's'): Promise<any[]> {
    data = data || [];
    const acccuracy = { 1: 5, 10: 4, 100: 3, 1000: 2 };
    const groupedItems: any = {};
    const userTypeCode: any = { 1: 'f', 2: 'b', 3: 'n', s: 's' };
    const fixedPos = (lat: number, lng: number, positions: any, ustypid: any) => {
      return String(userTypeCode[ustypid] + ',' + lat.toFixed(positions)) + ',' + String(lng.toFixed(positions));
    };
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const fp = fixedPos(item.Latitude, item.Longitude, acccuracy[1000], type == 's' ? 's' : item.UserTypeId);
      if (groupedItems[fp]) {
        groupedItems[fp].push(item);
      } else {
        groupedItems[fp] = [item];
      }
    }
    const singles: any = [];
    for (const key in groupedItems) {
      if (Object.prototype.hasOwnProperty.call(groupedItems, key)) {
        const group = groupedItems[key];
        if (group.length == 1) {
          singles.push(group[0]);
        } else {
          this.addMultipleToMap(type, group, key);
        }
      }
    }
    return new Promise(resolve => resolve(singles));
  }

  addMultipleToMap(type: 'u' | 's', items: any, typePosition: any) {
    const [userTypeCode, lat, lng] = typePosition.split(',');
    const iconsObj = {
      f: icons.MULTIPLE_FREEUSER,
      b: icons.MULTIPLE_BUSINESS,
      n: icons.MULTIPLE_NONPROFIT,
      s: icons.BUYSELL,
    };
    if (type == 'u') {
      items = items.map((user: any) => this.setUserData(user));
    }
  }

  setBuySellData(slobj: any) {
    const temp = {
      spids: slobj.spids.split(','),
      others: slobj.titl.split('&*'),
    };
    const formattedItems = [];
    for (let i = 0; i < temp.spids.length; i++) {
      // old mouse**100**Like new**Feb_2021/202102011612157152884_79.jpeg**
      const [title, price, condition, image] = temp.others[i].split('**');
      formattedItems.push({
        spid: temp.spids[i],
        titl: title,
        price,
        condition,
        image
      });
    }
    return formattedItems;
  }

  subscription?: Subscription;
  startSubsription() {
    this.subscription = this.intervalTimer.subscribe(() => {
      if (this.islocationEnabled) {
        this.updatelocation();
      }
    });
  }

  search(myArray: any, markers: any, user_markers: any) {
    if (markers.length > 0) {
      const index = markers.findIndex((o1: any) => {
        // filter out (!) items in result2
        return !myArray.some((o2: any) => {
          return o1.get('id') === o2.id;          // assumes unique id
        });
      });
      if (index > 0) {
        // markers[index].setMap(null);
        if (user_markers.length > 0) {
          user_markers.splice(index, 1);
        }
        markers.splice(index, 1);
      }
    }
  }
  removeIfNotInMarkerList(newList: any): Promise<boolean> {
    const newIds = newList.map((val: any) => val.id);
    this.markers.forEach(existingMarker => {
      if (newIds.indexOf(existingMarker.get('id')) == -1 && existingMarker.get('fflag') == 'L') {
        existingMarker.setMap(null);
      }
    });
    return new Promise(resolve => resolve(true));
  }

  checkGPSPermission() {
    this.islocationEnabled = true;
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  deleteSearch() {
    const params = {
      usrid: this.user.UserId,
    };
    const method = config.DEL_PING_SER;
    this.http.post(method, params)
      .subscribe((result) => {
        this.cmmflag = this.getFlag();
      });
  }
  getFlag() {
    if (this.privacySett.psenbl) { return MapFlag.Ping; }
    if (this.privacySett.mst) { return this.privacySett.mst; }
  }
  applySetting() {
    this.stopOnTerminate = this.isBackEnabled == false ? false : true;
    this.isBackEnabled = !this.isBackEnabled;
    if (this.isBackEnabled == true) {
      this.updateVisibleMode(1);
      this.setCurrentLocationMarker();
    } else {
      this.updateVisibleMode(0);
      this.currentLocationMarker = new google.maps.Marker({
        position: this.location,
        map: this.map,
        title: "You are here",
        icon: this.user?.UserTypeId == '2' ? 'assets/markers/business-icon-invisible.svg' : 'assets/markers/curr-invisible.svg',
      });
    }
    if (this.stopOnTerminate == true) {
      // this.mapService.stopBackground();
    }
  }

  async updateVisibleMode(status: 1 | 0) {
    const params = {
      id: this.user.UserId,
      isvisibe: status,
      lat: this.location.lat,
      lng: this.location.lng,
      radius: this.radius,
      dt: moment().format('YYYY-MM-DD HH:mm:ss'),
      ustypid: this.user.UserTypeId,
      flag: null
    };
    await this.mapService.getUserSetting('mst').subscribe(
      (s: any) => {
        params.flag = s;
      },
      (e: any) => {
        console.log('userSettingfromService-error', e);
      }
    );
    const method = config.UPD_USR_MAP;
    this.http.post(method, params)
      .subscribe((result) => {
        if (status == 0) {
          this.updatelocation();
        }
      });
  }

  async updateMarkers() {
    if (this.map != null) {
      await this.clearMap();
    }
  }

  async updateTotemMarkers() {
    if (this.map != null) {
      await this.clearMap();
    }
  }

  loadlocation() {
    this.cmmflag = this.getFlag();
    const obj = {
      location: this.location,
      flag: this.cmmflag,
      logInfo: this.user,
      setting: this.privacySett
    };
  }
  async updatelocation() {
    if (!this.isPlatformReady || !this.map) {
      return;
    }
    // console.log('updatelocation called from', caller);
    if (this.cmmflag == null) {
      this.searchMarkers.map((res: any) => {
        res.setMap(null);
      });
      this.searchMarkers = [];
      this.ser_usr_mark = [];
    }
    if (this.map) {
      const loc = this.location;
      if (loc && JSON.stringify(this.location) != JSON.stringify(loc)) {
        this.location = loc;
        localStorage.setItem('location', JSON.stringify(this.location));
        this.setCurrentLocationMarker();
      }
      if (this.location && this.location.lat) {
        this.currentUserLocation(this.location);
      }
    }

  }

  blinkMarker(marker: google.maps.Marker) {
    if (marker) {
      setInterval(function () {
        marker.setIcon("assets/markers/vuu.svg");
        if (marker.getVisible()) {
          marker.setVisible(false);
        } else {
          marker.setVisible(true);
        }
      }, 500);
    }
  }



  async onMultiMarkerClick(params: any[]) {
    const marker: any = params.pop();
    if (this.mapWindow) {
      this.mapWindow.close();
    }
    const compFactory = this.resolver.resolveComponentFactory(MarkerInfoComponent);
    const compRef: ComponentRef<MarkerInfoComponent> = compFactory.create(this.injector);

    this.appRef.attachView(compRef.hostView);
    let div: any = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);
    div = div.getElementsByClassName('multiple')[0];
    this.mapWindow.setOptions({ content: div });
  }

  /** User taps marker
   * @param  marker: Marker selected */
  async onMarkerClickV2(marker: google.maps.Marker) {
    //console.log("onMarkerClick: ", marker);
    const markerData: MarkerInfo<any> = (marker as any)?.markerData;
    console.log("onMarkerClickV2: markerData: ", markerData);
    this.markerCurrentIndex = markerData.itemIndex;
    await this.openMarkerDetails();
  }

  async onMarkerClick(params: google.maps.Marker) {//Obsolete function to open MapInfoWindow
    this.onMarkerClickV2(params);//TODO: Manoj remove calling from here replace function call
    const markerData: MarkerInfo<any> = (params as any)?.markerData;

    if (this.mapWindow) {
      this.mapWindow.close();
    }
    // Create a component
    const compFactory = this.resolver.resolveComponentFactory(MarkerInfoComponent);
    const compRef: ComponentRef<MarkerInfoComponent> = compFactory.create(this.injector);

    compRef.instance.htmlInfoWindow = this.mapWindow;
    compRef.instance.compRef = compRef;
    compRef.instance.currentUserLocation = this.location;


    this.appRef.attachView(compRef.hostView);

    let div: HTMLDivElement = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);

    compRef.instance.markerType = markerData.MarkerType;
    switch (markerData.MarkerType) {
      case MarkerType.FiniteeService: {
        compRef.instance.finiteeService = markerData.data;
      }
        break;
      case MarkerType.Sales: {
        compRef.instance.sales = markerData.data;
      }
        break;
      case MarkerType.Totem: {
        compRef.instance.totem = markerData.data;
      }
        break;
      case MarkerType.FreeUser: {
        compRef.instance.freeUser = markerData.data;
      }
        break;
      case MarkerType.BusinessNonProfitUser: {
        compRef.instance.businessAndNonProfitUser = markerData.data;
      }
        break;
      case MarkerType.SavedLocation: {
        compRef.instance.savedLocation = markerData.data;
      }
        break;
    }

    let refrence = div.getElementsByClassName(`refrence-${markerData.MarkerType}`)[0];
    this.mapWindow.setOptions({ content: refrence });

    if (markerData.MarkerType == MarkerType.FreeUser || markerData.MarkerType == MarkerType.BusinessNonProfitUser) {
      let toUserId: number = markerData.data.UserId;
      let toUserName: number = markerData.data.UserName;
      let fromUserName: number = this.user.name;
      let fromUserId: number = this.user.UserId;
      // this._signalRService.sendMessage(NotificationEvents.ViewedOnSonar, JSON.stringify({
      //   "FromUserId": fromUserId,
      //   "FromUserName": fromUserName,
      //   "ToUserId": toUserId,
      //   "ToUserName": toUserName,
      // }));
    }

    // Dynamic rendering
    this._ngZone.run(() => {
      this.mapWindow.open(this.map, params);
    });
  }

  backbtn() {
    this.router.navigateByUrl('/tabs/tab1');
  }

  public async onViewingClick(): Promise<void> {
    const modal = await this.modalController.create({
      component: ViewingUsersComponent
    });
    modal.onDidDismiss().then(result => {
      if (result) {
        this.addUserToMap([result.data as FiniteeUserOnMap], 0);
      }
    });
    return await modal.present();
  }

  public async onMapResultsClick(): Promise<void> {


    let results = this.mapService.mainList;
    // this.resultCount = results.length;
    // if (results.length > 0) {
    //   this.mainResultFromSearch = results;
    //   this.snrlst.forEach((val: any) => {
    //     results = results.filter((x: any) => val.FlagId != x.UserId)
    //   })
    //   const users = results.filter((val: any) => val.entity == 'U');
    //   const totems = results.filter((val: any) => val.entity == 'T');
    //   const serviceAvailable = results.filter((val: any) => val.entity == 'SA');
    //   const serviceRequired = results.filter((val: any) => val.entity == 'SR');

    //   if (users.length > 0) { this.addUserToMap(users); }
    //   if (totems.length > 0) { this.addTotemToMap(totems); }
    //   if (serviceAvailable.length > 0) { this.addServiceToMap(serviceAvailable, 'SA'); }
    //   if (serviceRequired.length > 0) { this.addServiceToMap(serviceRequired, 'SR'); }
    //   this.totemMarkersOnSerach = results;
    //   this.clearAddCurrentLocationMarker();
    // } else {
    //   this.mainResultFromSearch = [];
    //   this.removeSearchResultFromMap();
    //   console.log('No Results Found');
    //   this.clearAddCurrentLocationMarker();
    // }

    const modal = await this.modalController.create({
      component: MapResultComponent,
      componentProps: {
        results: results
      }
    });
    modal.onDidDismiss().then(result => {
      console.log("onMapResults Dismiss result:", result);
      if (result && result.data) {
        if (result.data.action == "VIEW_MAP") {
          if (result.data.data.Latitude && result.data.data.Longitude) {
            this.mapPanToLocation(result.data.data.Latitude, result.data.data.Longitude);
          }
        }
        else if (result.data.action == "VIEW_BUSINESS") {
          this.viewBusiness(result.data.data);
        }
        else if (result.data.action == "CHAT") {
          this._chatsService.openChat(result.data.data);
        }
        else if (result.data.action == "VIEW_CONNECTION") {
          this.openUser(result.data.data);
        }
      }
    });
    return await modal.present();
  }


  mapPanToLocation(latitude: any, longitude: any) {
    const point: google.maps.LatLngLiteral = {
      lat: latitude,
      lng: longitude,
    };
    this.mapCenter = new google.maps.LatLng(point);
    this.map?.panTo(point);
  }

  mapBoundsToFitMarker(markers: any) {
    console.log("mapBoundsToFitMarker: ", markers);
    var bounds = new google.maps.LatLngBounds();
    for (var i in markers) {// your marker list here
      // console.log("mapBoundsToFitMarker: position: ", markers);
      bounds.extend(markers[i].position) // your marker position, must be a LatLng instance
    }
    this.map?.fitBounds(bounds); // map should be your map class
  }

  viewBusiness(dataItem: any) {
    console.log("dataItem", dataItem);
    const navigationExtras1s: NavigationExtras = {
      state: {
        data: dataItem
      }
    };
    this.router.navigate(['business-user-canvas-other'], navigationExtras1s);
  }

  openUser(user: FiniteeUserOnMap) {
    console.log("openUser: ", user);

    const navigationExtras1s: NavigationExtras = {
      state: {
        data: user
      }
    };
    if (user.UserTypeId == AppConstants.USER_TYPE.BN_USER)
      this.router.navigateByUrl('business-user-canvas-other', navigationExtras1s);
    else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.router.navigateByUrl('free-user-canvas', navigationExtras1s);
  }

  async searchMap() {
    const obj = {
      lat: this.location.lat,
      lng: this.location.lng,
      id: this.user.UserId,
      setting: this.privacySett,
      radius: this.radius,
      searchCriteria: this.searchCriteria,
    };
   
    const modal = await this.modalController.create({
      component: MapSearchComponent,
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.8,
      handle:false,
      componentProps: { values: obj }
    });
    modal.onDidDismiss().then(result => {
      this.markers.splice(0, this.markers.length);
      // this.clearResults();
      this.mapSearchResult = result;
      this.removeSearchResultFromMap();
      if (result.data) {
        if (result.data?.status == 'L') {

          let Latitude = result.data?.lat;
          let Longitude = result.data?.lng;
          let RangeInKm = 2;

          this.getTotemByUserId(Latitude, Longitude, RangeInKm);
        } else {
          this.searchCriteria = result.data;
          if (result.data?.status == 'P') {
            this.setCircle(result.data)
          }
          if (result.data.oneTimeSearch) {
            result.data[`location`] = this.location;
            this.searchResultUpdate();
          } else {
            this.clearMap();
            if (result.data != undefined && result.data != null) {
              this.cmmflag = result.data.status;
              this.updatelocation();
            }
          }
        }
      } else {
        this.cmmflag = this.getFlag();
        this.updatelocation();
        // this.removeCircle();
      }
    });
    return await modal.present();
  }

  async updateMapSearch(params: any) {
    this.radius = params.km;
    const method: any = config.GET_SER_USR_MAP_V1;
    await this.http.post(method, params)
      .subscribe(async (result: any) => {
        console.log(config.GET_SER_USR_MAP_V1, result);
      });
  }

  gotobotset() {
    this.router.navigate(['botset']);
  }
  gotocreatetotem() {
    const obj = {
      location: this.location,
      flag: this.user.code,
      status: 'N'
    };
    const params: NavigationExtras = {
      state: {
        data: obj
      }
    };
    this.router.navigate(['tabs', 'map', 'create-totem'], params);
  }

  setTotemData(tres: any) {
    return {
      icon: icons.TOTEM,
      username: this.user.name,
      UserId: this.user.UserId,
      userCode: this.user.code,
      flat: 'totem',
      markid: tres.TotemId,
      id: tres.TotemId,
      totid: tres.TotemId,
      desc: tres.desc,
      inftype: 'T',
      fflag: 'L',
      dt: tres.CreatedOn,
      img: config.VIEW_URL + tres.UserId + '/' + tres.TotemImage,
      vd: config.VIEW_URL + tres.UserId + '/' + tres.TotemVideo,
      position: { lat: parseFloat(tres.Latitude), lng: parseFloat(tres.Longitude) },
      myTitle: tres.TotemTitle ?? 'Totem',
      toUserId: tres.UserId,
    };
  }
  setUserData(res: any, isViewing = false) {
    let obj: any = {};
    obj.username = res.FullName;
    obj.title = res.FullName;
    obj.UserId = this.user.UserId;
    obj.userCode = this.user.code;
    obj.tuserCode = res.UserTypeId == 1 ? 'FR' : (res.UserTypeId == 2 ? 'BS' : (res.UserTypeId == 3 ? 'NP' : 'FR'));
    obj.toUserId = res.UserId;
    obj.markid = res.UserId;
    obj.id = res.UserId;
    obj.radius = res.RangeInKm;
    obj.position = { lat: parseFloat(res.Latitude), lng: parseFloat(res.Longitude) };
    obj.flagy = res.UserTypeId;
    obj.UserTypeId = res.UserTypeId;
    obj.dbj = res.LocationUpdatedOn;
    obj.Flg = res.flg;
    obj.fflag = 'S';
    obj.usrimg = config.VIEW_URL + res.UserId + '/' + res.ProfilePhoto;
    obj.inftype = 'U';
    obj.isvbl = res.isvbl;
    obj.connid = res.connid;
    obj.myTitle = res.DisplayName ?? res.FullName ?? '';
    obj.isConnected = res.IsConnected;
    obj.GreetingStatus = res?.Greeting?.ActivityStatus;
    obj.Greeting = res?.Greeting;
    obj.greetingShow = res.greetingShow;
    if (obj.GreetingStatus) {
      obj.Gflag = 'GR' + obj.GreetingStatus;
    } else {
      obj.Gflag = null;
    }
    if (res.UserTypeId == 1 && res.connid) {
      obj.icon = icons.CONNECTED_USER;
    } else if (res.UserTypeId == 1 && !res.connid) {
      obj.icon = icons.UNCONNECTED_USER;
    }
    if (res.UserTypeId == 2 && res.connid) {
      obj.icon = icons.CONNECTED_BUSINESS;
    } else if (res.UserTypeId == 2 && !res.connid) {
      obj.icon = icons.UNCONNECTED_BUSINESS;
    }
    if (res.UserTypeId == 3 && res.connid) {
      obj.icon = icons.CONNECTED_NONPROFIT;
    } else if (res.UserTypeId == 3 && !res.connid) {
      obj.icon = icons.UNCONNECTED_NONPROFIT;
    }
    if (res.isbuy == 'S') {
      obj.isbuy = 'S';
      obj.buysell = this.setBuySellData(res.slobj);
    }

    return res;
  }
  gotomaplist() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: {
          firebaseView: this.mainResultFromSearch.length == 0,
          totemList: this.totemList,
          userList: this.userList,
          mainResultFromSearch: this.mainResultFromSearch,
          mapFlag: this.getFlag()
        }
      }
    };
    this.navController.navigateForward(['mapresult'], navigationExtras);
  }

  async onClickGetCurrentPosition() {
    if (!this.location.lat || !this.location.lng) {
      this.location = this.location;
    }

    this.map?.moveCamera({
      center: this.location,
      zoom: ZOOM_MAX,
    })
    this.currentUserLocation(this.location);
    this.updatelocation();
  }

  public flameActive: boolean = false;
  public makeFlameActive(): void {
    this.flameActive = true;
  }

  public makeFlameInActive(): void {
    this.flameActive = false;
  }

  removeFireBaseResultsFromMap() {
    this.markers.forEach((marker: any) => {
      if (marker.get('fflag') == 'L') {
        marker.setMap(null);
      }
    });
    this.clearAddCurrentLocationMarker();
  }

  zoomToLocation(position: any) {
    this.isZoomOut = true;
    this.map?.panTo({
      lat: position.lat,
      lng: position.lng,
    });
  }
  /* Clearing the results of the previous search. */
  clearResults() {
    //this._signalRService.onMapSearchClear(this.user_markers.filter(marker => marker.UserTypeId == 1).map(x => x.id));
    this.mainResultFromSearch = [];
    this.clearMap();
    this.removeSearchResultFromMap();
    if (this.getFlag() != 'P') {
      this.removeCircle();
    }
    this.searchCriteria = null;
    this.removeCluster();
    this.refreshMap()
  }
  calcBoundsForCenter(bounds: any[], center: any): any[] {
    let result: any = [];
    return result;
  }
  currentUserLocation(position: any) {
    const icon: any = {
      size: {
        width: 25,
        height: 25
      },
      url: icons.CURRENT_LOCATION
    };
  }

  clearAddCurrentLocationMarker() {
    let markid = null;
    if (this.currentLocationMarker) {
      markid = this.currentLocationMarker.getId();
      this.currentLocationMarker.setMap(null);
      this.currentLocationMarker = null;
    }
    this.currentUserLocation(this.location);
  }
  setupDummyMarkers() {
    const results = [];
    const freeuser = {

    }
  }

  openMenu() {
    this.menu.open();
  }

  setClusters = (setclusters: any) => {
    const svg = window.btoa(`
      <svg fill="#03A9F4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity=".6" r="50" />
        <circle cx="120" cy="120" opacity=".3" r="70" />
        <circle cx="120" cy="120" opacity=".2" r="90" />
        <circle cx="120" cy="120" opacity=".1" r="110" />
      </svg>`);
    const renderer = {
      render: (data: any) =>
        new google.maps.Marker({
          label: { text: String(data.count), color: "white", fontSize: "15px" },
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new google.maps.Size(45, 45),
          },
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + data.count,
        }),
    };
    // console.log('this.markerCluster',this.markerCluster)
    if (this.markerCluster) this.markerCluster.clearMarkers();
    this.markerCluster = new MarkerClusterer({
      map: this.map,
      markers: setclusters,
      // renderer: renderer
    });
  }

  getAllConn(flag: any) {
    const params = {
      id: this.user.UserId,
      uscode: null,
      limit: this.limit,
      count: 0
    };
    // this.progressBar = true;
    const method = config.GET_ALL_CONN;
    this.http.post(method, params).subscribe(
      (result: any) => {
        console.log()
      })
  }

  public async openSonarSetting(): Promise<void> {
    this.sonarSettingModal?.present().then(() => {

    });
  }

  public async viewGreetingDetails(): Promise<void> {
    this._commonService.greetingStatusWithDetails();
    const modal = await this.modalController.create({
      component: ViewingUsersComponent,
      componentProps: {
        viewTemplate: "Greeting"
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) {
        this.addUserToMap([result.data as FiniteeUserOnMap], 0);
      }
    });
    return await modal.present();
  }

  public closeSetting(): void {
    this.sonarSettingModal?.dismiss();
  }

  public closeMarkerDetails(): void {
    this.markerDetailModal?.dismiss();
  }

  public onShowPreviousMarker(): void {
    //move to selected marker
  }

  public onShowNextMarker(): void {
    //move to selected marker
  }

  public async openMarkerDetails(): Promise<void> {
    this.markerDetailModal?.present().then(() => {

    });
  }

  //Handle swipe event on send msg to subscribers
  swipe(e: TouchEvent, when: string): void {
    // console.log("swipe: " + when, e);
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }
    else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord![0], coord[1] - this.swipeCoord![1]];
      const duration = time - this.swipeTime!;
      if (duration < 1000
        && Math.abs(direction[0]) > 30
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        if (direction[0] < 0) {
          //next
          this.swipeService.swipeNext();
        } else {
          //previous
          this.swipeService.swipePrevious();
        }
      }
    }
  }


}
