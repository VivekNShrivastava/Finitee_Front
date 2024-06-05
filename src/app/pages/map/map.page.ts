import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, Inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { IonModal, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import * as config from '../../core/models/config/ApiMethods';
import * as icons from '../../core/models/config/FiniteeIcon';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { MapSearchComponent } from './map-search/map-search.component';
import { MarkerInfoComponent } from './marker-info/marker-info.component';
import { FiniteeService, SonarServiceAvailableSearchRespond, SonarServiceRequiredSearchRespond } from "./models/FiniteeService";
import { UserLocation } from './models/Location';
import { mapStyle } from './models/MapOptions';
import { TotemSearchResult, FiniteeUserOnMap, SonarEventSearchRespond, SonarFreeUserSearchRespond, SonarSalesListingSearchRespond } from './models/MapSearchResult';
import { MarkerInfo, MarkerType, MultipleMarkerInfo } from './models/MarkerInfo';
import { UserOnMap } from './models/UserOnMap';
import { MapService } from './services/map.service';
import { ViewingUsersComponent } from './viewing-users/viewing-users.component';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { MapResultComponent } from './map-result/map-result.component';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { LocationService } from 'src/app/core/services/location.service';
import { AddressMap, Area } from 'src/app/core/models/places/Address';
import { AllSonarSearchRequest } from 'src/app/core/models/mapSonarSearch';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';
import { NetworkPlugin } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { BasePage } from 'src/app/base.page';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';

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
export class MapPage extends BasePage implements OnDestroy {
  @ViewChild('map_canvas') mapRef?: ElementRef<HTMLElement>;
  @ViewChild('sonarSettingModal') sonarSettingModal?: IonModal;
  @ViewChild('markerDetailModal') markerDetailModal?: IonModal;
  // @ViewChild(IonModal) sonarSettingModal?: IonModal;

  public mapWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  public map?: google.maps.Map = undefined;
  public location: UserLocation = new UserLocation();
  public homeLocation: UserLocation = new UserLocation();

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
  advanceMarkers: google.maps.marker.AdvancedMarkerElement[] = <google.maps.marker.AdvancedMarkerElement[]>[];
  // advanceMarkers: any = [];
  totemMarkers: any = [];
  userMarkers: any[] = [];
  viewingMeList: UserOnMap[] = <UserOnMap[]>[];
  totusr_markers: any = [];
  event_markers: any = [];
  salesListing_markers: any = [];
  serviceRequired_markers: any = [];
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
  isLocationTurnedOn = true;
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

  greetList: any = [];
  greetListNumber: number = 0;

  eventListen: any;
  userConnectionActive: boolean = false;
  isUserLocationEnabled: boolean = false;
  private locationUpdateSubscription: Subscription = new Subscription();

  isLiveLocationActive: boolean = false;

  mixedArray: any = [];
  changedArray: any = [];

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
  locationUpdateInterval$: any;
  prevLiveLocation: UserLocation = new UserLocation();
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
    public _commonService: CommonService,
    public _chatsService: ChatsService,
    public swipeService: SwipeService,
    private locationService: LocationService,
    private firestoreService: FirestoreService,
    private _userPrivacyServivce: UserPrivacyService,
    private privacySetting : PrivacySettingService,
    @Inject('NetworkPlugin') public network: NetworkPlugin
  ) {
    super(authService);
    console.log("constructor");
    const checkUserConnection = this.logCurrentNetworkStatus();
    this.user = this.authService.getUserInfo();

    this.authService.authState.subscribe((authState: boolean) => {
      console.log("authState", authState)
      if (authState == true) {

        //removed viewing functionality

        // this.firestoreSubscription = this.firestoreService.viewList$.subscribe(updatedData => {
        //   this.viewList = updatedData;
        //   this.viewListNumber = this.viewList?.names?.length;
        // });

        this.firestoreSubscription = this.firestoreService.greetingList$.subscribe(updatedData => {
          this.greetList = updatedData;
          console.log(this.greetList);
          this.greetListNumber = this.greetList?.length;
          console.log("res -", this.greetListNumber);
        });

        this.getUserSonarPrivacySettings();

        // this.currentLocationUpdate();
      }
    });


    this.network.addListener('networkStatusChange', status => {
      if (status.connected === false) {
        this._commonService.presentToast("User Offline");
        this.userConnectionActive = true;
      } else {
        if (status.connected === true && this.userConnectionActive === true) {
          this._commonService.presentToast("Back Online");
          this.userConnectionActive = false;
        }
      }
      console.log('Network status changed', status);
    });
  }

  printCurrentPosition = async () => {

    try {
      console.log("running check permissions...");
      const perm = await Geolocation.checkPermissions();
      console.log('Current position:', perm);

      if (perm.location) {
        const loc = await Geolocation.getCurrentPosition();
        console.log("loc", loc.coords)
        // this.location.lat = loc.coords.latitude;
        // this.location.lng = loc.coords.longitude;
        // this.prevLiveLocation.lat = loc.coords.latitude;
        // this.prevLiveLocation.lng = loc.coords.longitude;
      }

      if (perm.location != "granted") {
        console.log("res from requestPerm");

        this.isLocationTurnedOn = false;

        // const res = await Geolocation.requestPermissions();
      } else if (perm.location === "granted" && this.isLocationTurnedOn === false) {
        this.isLocationTurnedOn = true;
      }
    } catch (error) {
      console.error(error);
      console.log("catched error", error);
      console.log(error);
      // if(error === "Error: Location services are not enabled"){
      //   console.log("upar wala");
      //   NativeSettings.openAndroid({
      //     option: AndroidSettings.Location,
      //   });
      // }else if(error === "Location services are not enabled"){
      //   console.log("niche wala");
      //   NativeSettings.openAndroid({
      //     option: AndroidSettings.Location,
      //   });
      // }
      // NativeSettings.openAndroid({
      //   option: AndroidSettings.Location,
      // });
    }

  };

  async logCurrentNetworkStatus() {
    const status = await this.network.getStatus();
    if (status.connected === false) {
      console.log("User is Offline");
      this.userConnectionActive = true;
      this._commonService.presentToast("User Offline");
      this.loadMap();
    } else this.userConnectionActive = false;
    console.log('Network status:', status);
    return status.connected;
  };

  async ngOnInit() {
    console.log("OnInit");
    await this.platform.ready();
    this.currentPageHref = window.location.pathname;

    // await this.mapService.getAppSetting(this.user.UserId).subscribe(
    //   (s: any) => {
    //     this.radius = s.map.km;
    //   }
    // );
    // await this.mapService.getUserSetting('ivsbl').subscribe(
    //   (s: any) => {
    //     this.isBackEnabled = s;
    //   }
    // );
    // this._commonService.loadUserGreetings();
    // let privacyList = localStorage.getItem('privacyList') ? JSON.parse(localStorage.getItem('privacyList') ?? '') : null;
    // if (privacyList?.length) {
    //   this.privacySett = privacyList;
    //   if (this.privacySett.mst == null) {
    //     this.deleteSearch();
    //   }
    //   if (!!this.location) {
    //     this.updatelocation();
    //   }
    // }
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    // await this.printCurrentPosition();

    //removed viewing functionality

    // this.firestoreSubscription = this.firestoreService.viewList$.subscribe(updatedData => {
    //   this.viewList = updatedData;
    //   this.viewListNumber = this.viewList?.names?.length;
    // });

  }

  ionViewWillLeave() {

    //removed viewing functionality

    // this.firestoreService.deleteFieldFromDocuments(this.user.UserId)

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
    if (this.userConnectionActive) await this.printCurrentPosition();
    this.loadMap();
    this.fetchCurrentArea();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription.remove(this.subscription);
    }
  }

  makeUserInvisible (activeOrNot: boolean){
    let data = {
      LocationVisibleTo : 'N'
    }
    if(activeOrNot){
      data.LocationVisibleTo = 'A';
      this.privacySetting.updateSonarPrivacySetting(data);
      console.log("User invisible");
    } else {
      data.LocationVisibleTo = 'N';
      this.privacySetting.updateSonarPrivacySetting(data);
      console.log("user visible");
    }
  }

  async getUserSonarPrivacySettings() {
    let res = null;
    if (!this.isLiveLocationActive) res = await this._userPrivacyServivce.getUserPrivacySetting();

    if (res?.LocationShowAt === 'L' || this.isLiveLocationActive) {
      this.isLiveLocationActive = true;
      this.setupLocationUpdates();
    } else {
      this.isLiveLocationActive = false;
      // console.log("error while getting sonar privacy settings");
      this.locationUpdateSubscription.unsubscribe();
    }
  }

  setupLocationUpdates() {
    // this.locationUpdateInterval$ = interval(60000); // 60 seconds interval
    this.locationUpdateInterval$ = interval(10000); // 10 seconds interval
    this.locationUpdateSubscription = this.locationUpdateInterval$.subscribe(() => {
      this.currentLocationUpdate();
    });
  }

  latLng_maha = [
    { "latitude": 18.5204, "longitude": 73.8567, "city": "Pune" },
    { "latitude": 19.0760, "longitude": 72.8777, "city": "Mumbai" },
    { "latitude": 20.2961, "longitude": 85.8245, "city": "Nagpur" },
    { "latitude": 19.9975, "longitude": 73.7898, "city": "Nashik" },
    { "latitude": 16.8494, "longitude": 74.4758, "city": "Kolhapur" },
    { "latitude": 20.3910, "longitude": 78.1306, "city": "Akola" },
    { "latitude": 20.8565, "longitude": 77.7769, "city": "Jalgaon" },
    { "latitude": 21.1458, "longitude": 79.0882, "city": "Amravati" },
    { "latitude": 17.6868, "longitude": 74.0325, "city": "Sangli" },
    { "latitude": 17.6599, "longitude": 75.9064, "city": "Solapur" }
  ]


  async currentLocationUpdate() {
    // this.locationService.observeCurrentPosition().subscribe(async (position) => {

    const position = await Geolocation.getCurrentPosition();
    if (position) {
      //check if previous corrdinates and current corrdinates are same or different, if corrdinates have changed, then call the api.

      // console.log(position.coords.latitude, position.coords.longitude)
      // if(this.prevLiveLocation.lat != position.coords.latitude || this.prevLiveLocation.lng != position.coords.longitude){
      //   this.prevLiveLocation.lat = position.coords.latitude;
      //   this.prevLiveLocation.lng = position.coords.longitude;

      //   console.log(position);
      //   const res = await this.locationService.updateLiveLocation(position.coords.latitude, position.coords.longitude);
      //   if(res){
      //     this.location.lat = position.coords.latitude;
      //     this.location.lng = position.coords.longitude;
      //     this.setCurrentLocationMarker();
      //     this.map?.setCenter(this.location)
      //     this._commonService.presentToast("Location Updated");
      //   }
      // } else this._commonService.presentToast("Same Location");

      // testing
      const res = await this.locationService.updateLiveLocation(position.coords.latitude, position.coords.longitude);
      if (res) {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        // this.setCurrentLocationMarker();
        // this.currentLocationMarker.position = this.location;
        this.map?.setCenter(this.location)
        // this._commonService.presentToast( `LU - ${position.coords.longitude, position.coords.latitude}`);
      }


      //test addresses

      // for (const coord of this.latLng_maha) {
      //   // Call the API with each coordinate
      //   const res = await this.locationService.updateLiveLocation(coord.latitude, coord.longitude);

      //   if (res) {
      //     // Update the location properties
      //     this.location.lat = coord.latitude;
      //     this.location.lng = coord.longitude;

      //     // Update the marker and map center
      //     this.setCurrentLocationMarker();
      //     // this.map?.setCenter(this.location);

      //     // Log the city name
      //     console.log(`Updated location for ${coord.city}`);
      //   } else {
      //     console.log(`Failed to update location for ${coord.city}`);
      //   }
      //   await new Promise(resolve => setTimeout(resolve, 10000));
      // }


    }
    // });
  }

  fetchCurrentArea() {

    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      // console.log("MAP fetchCurrentArea observeReverseGeocodingResult: ", address);

    });
    this.currentArea = this.locationService.getCurrentArea();
    // console.log("MAP fetchCurrentArea Area: ", this.currentArea);

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
            // styles: this.styles,
            zoom: MAP_INIT_ZOOM,
            zoomControl: false,
            keyboardShortcuts: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            mapId: "11514565b652be7e",
            styles: [{
              "featureType": "poi",
              "stylers": [{
                "visibility": "off"
              }]
            }]
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
        // this.homeLocation.lat = this.location.lat + 0.0000002;
        // this.homeLocation.lng = this.location.lng + 0.0000002;
        // this.currentLocationMarker = new google.maps.Marker({
        //   position: this.homeLocation,
        //   map: this.map,
        //   title: "You are here man",
        //   // draggable: true,
        //   icon: !this.isBackEnabled ? 'assets/markers/curr-invisible.svg' : 'assets/markers/curr.svg',
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
    // this.getTotemByUserId(Latitude, Longitude, RangeInKm);
    // this.loadSavedLocation();
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
    this.event_markers = [];
    this.mixedArray = [];
    this.changedArray = [];
    // this.advanceMarkers = [];
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

  generateRandomZIndex(): number {
    // Assuming you want zIndex within a specific range, for example, 1 to 1000
    const min = 1;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async addAdvanceMarkerToMap(obj: any, caller?: string) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    let marker = new AdvancedMarkerElement({
      position: obj.position,
      map: this.map,
      title: obj.title,
      content: obj?.content,
      gmpDraggable: false,
      collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
      // zIndex: this.generateRandomZIndex(),

    });
    this.advanceMarkers.push(marker);
    this.setClusters(this.advanceMarkers);

    // console.log(marker.map)

    return marker;
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

  removeAdvanceMarkerFromMap() {
    const forLoop = async (i: any) => {
      if (i < this.advanceMarkers.length) {
        this.advanceMarkers[i].map = null;
        forLoop(i + 1)
      } else {
        this.advanceMarkers = [];
      }
    }
    forLoop(0);
  }

  async refreshMarker() {
    // this.removeSearchResultFromMap();
    this.removeAdvanceMarkerFromMap();
    // await this.loadSavedLocation();
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
          // this.setCircle(result.data)
        }
        if (result.data) {
          result.data[`location`] = this.location;
          this.markers = [];
          // this.mapBoundsToFitMarker(this.advanceMarkers)
          this.advanceMarkers = [];
          this.markersMap.clear();
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
    this.markersMap.clear();
    this.clusterMap.clear();
    let sonarResults = this.mapService.mainList;
    const userId = this.logInfo.UserId
    let results = sonarResults.filter((x: any) => x.Id !== userId)
    this.resultCount = results.length;
    if (results.length > 0) {
      this.mainResultFromSearch = results;
      this._commonService.savedSonarLocations.forEach((val: any) => {
        results = results.filter((x: any) => val.FlagId != x.UserId)
      })
      // const res = await this.filterResults(results);
      const users = results.filter((val: any) => val.entity == 'U');
      const totems = results.filter((val: any) => val.entity == 'T');
      const serviceAvailable = results.filter((val: any) => val.entity == 'SA');
      const serviceRequired = results.filter((val: any) => val.entity == 'SR');
      const events = results.filter((val: any) => val.entity == 'E');
      const saleslisting = results.filter((val: any) => val.entity == 'SL');
      let indexResultItem = 0;
      if (users.length > 0) { indexResultItem = this.addUserToMap(users, indexResultItem); }
      if (totems.length > 0) { indexResultItem = this.addTotemToMap(totems, indexResultItem); }
      if (serviceAvailable.length > 0) { indexResultItem = this.addServiceAvailableToMap(serviceAvailable, 'SA', indexResultItem); }
      if (serviceRequired.length > 0) { indexResultItem = this.addServiceRequiredToMap(serviceRequired, 'SR', indexResultItem); }
      if (events.length > 0) { indexResultItem = this.addEventToMap(events, indexResultItem); }
      if (saleslisting.length > 0) { indexResultItem = this.addSalesListingToMap(saleslisting, indexResultItem); }

      this.totemMarkersOnSerach = results;
      this.clearAddCurrentLocationMarker();
      this.addSameLatLngUserMarkersToMap(this.markersMap, 0);
      this.clusteringFunction();
      console.log(this.clusterMap)
      // this.addClusterElementsToMap(this.clusterMap, 0);
      this.addSameLatLongMarkersToMap(this.clusterMap, 0);


      if (this.markersMap.size + this.clusterMap.size === 1) {
        let latLng;
        for (const [key, value] of this.markersMap) {
          console.log(value); // Output: value1
          latLng = value[0]?.latLng || value[0];
          break;
        }
        for (const [key, value] of this.clusterMap) {
          console.log(value); // Output: value1
          latLng = value[0]?.latLng || value[0];
          break;
        }
        if (latLng) {
          const lat = latLng && latLng.LatLong ? latLng.LatLong.Latitude : latLng.Latitude;
          const lng = latLng && latLng.LatLong ? latLng.LatLong.Longitude : latLng.Longitude

          this.map?.panTo({ lat, lng });
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 0));
        this.mapBoundsToFitMarker(this.advanceMarkers);
      }

    } else {
      this.mainResultFromSearch = [];
      this.removeSearchResultFromMap();
      this.removeAdvanceMarkerFromMap();
      console.log('No Results Found');
      this.clearAddCurrentLocationMarker();
    }
  }

  clusterMap: Map<any[], any[]> = new Map();

  clusteringFunction() {
    this.mixedArray.forEach((el: any, index: any) => {
      if (!this.changedArray.includes(el?.Id)) {
        this.clusterMap.set(el, [el]);
        this.mixedArray.slice(index + 1).forEach((element: any) => {
          const key = el;

          let latDiff = el.Latitude - element.Latitude;
          let lngDiff = el.Longitude - element.Longitude;

          if (latDiff < 0) latDiff = latDiff * -1;
          if (lngDiff < 0) lngDiff = lngDiff * -1;

          if (latDiff <= 0.0027 && lngDiff <= 0.0027) {
            element.Latitude = el.Latitude;
            element.Longitude = el.Longitude;
            this.changedArray.push(element.Id);

            if (this.clusterMap.has(key)) {
              // If the key exists, push the marker to the existing array
              this.clusterMap.get(key)?.push(element);
            } else {
              // If the key doesn't exist, create a new array with the marker
              this.clusterMap.set(key, [element]);
            }
          }
        });
      }
    });
  }

  markersMap: Map<any, any[]> = new Map();

  addMultipleUserToMap(marker: any) {
    const lat = marker && marker.LatLong ? marker.LatLong.Latitude : marker && marker.Latitude;
    const lng = marker && marker.LatLong ? marker.LatLong.Longitude : marker && marker.Longitude;
    const key = `${lat},${lng}`;
    if (this.markersMap.has(key)) {
      // If the key exists, push the marker to the existing array
      this.markersMap.get(key)?.push(marker);
    } else {
      // If the key doesn't exist, create a new array with the marker
      this.markersMap.set(key, [marker]);
    }
  }

  addSingleMarker() {

  }

  // addClusterElementsToMap(clusterMap: Map<any[], any[]>, startIndexInResult: number) {
  //   clusterMap.forEach(async(value: any, key: any) => {
  //     console.log('key', key);
  //     const beachFlagImg = document.createElement('div');
  //     const imgCont = document.createElement('img');
  //     const para = document.createElement('span');
  //     imgCont.src = icons.MULTIPLE_FREEUSER;

  //     para.innerHTML = value.length;
  //     para.style.position = "absolute";
  //     para.style.left = "50%";
  //     para.style.bottom = "40%";
  //     para.style.color = "black";
  //     para.style.fontSize = "20px";
  //     para.style.fontWeight = "bold";
  //     beachFlagImg.appendChild(imgCont)
  //     beachFlagImg.appendChild(para);

  //     const lat = value[0] && value[0].LatLong ? value[0].LatLong.Latitude : value[0] && value[0].Latitude;
  //     const lng = value[0] && value[0].LatLong ? value[0].LatLong.Longitude : value[0] && value[0].Longitude;


  //     let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
  //       position: { lat: lat, lng: lng },
  //       title: 'Multiple Icon',
  //       content: beachFlagImg,
  //     };



  //     const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

  //     const markerData: MultipleMarkerInfo<SonarEventSearchRespond> = {
  //       data: value,
  //       MarkerType: MarkerType.Multiple,
  //       itemIndex: startIndexInResult
  //     };

  //     startIndexInResult++;

  //     marker.addListener("click", () => {
  //       this.onAdvanceMarkerClick(marker, markerData);
  //       console.log("clicked", value);
  //     });
  //   })
  // }

  addSameLatLngUserMarkersToMap(clusterMap: Map<any, any[]>, startIndexInResult: number) {
    this.markersMap.forEach(async(value: any, key:any) => {
      //for single user 
      if (value.length < 2) {
        
        const beachFlagImgSingleUser = document.createElement('div');
        const imageTag = document.createElement('img');
        const paraSingleUser = document.createElement('span');
        imageTag.src = icons.NEW_MULTIPLE_FREEUSER_WNE;

        imageTag.style.height = '130px';
        imageTag.style.width = '130px';

        paraSingleUser.innerHTML = value.length;
        paraSingleUser.style.position = "absolute";
        paraSingleUser.style.left = "61%";
        paraSingleUser.style.bottom = "59%";
        paraSingleUser.style.color = "black";
        paraSingleUser.style.fontSize = "11px";
        paraSingleUser.style.fontWeight = "bold";

        beachFlagImgSingleUser.appendChild(imageTag)
        beachFlagImgSingleUser.appendChild(paraSingleUser);

        const lat = value[0] && value[0].LatLong ? value[0].LatLong.Latitude : value[0] && value[0].Latitude;
        const lng = value[0] && value[0].LatLong ? value[0].LatLong.Longitude : value[0] && value[0].Longitude;

        let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
          position: { lat: lat, lng: lng },
          title: value[0].title,
          content: beachFlagImgSingleUser
        };

        if(lat != undefined && lng != undefined){
          const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

          const markerData: MarkerInfo<any> = {
            data: value,
            MarkerType: MarkerType.Multiple,
            itemIndex: startIndexInResult
          };
  
          startIndexInResult++;
  
          marker.addListener("click", () => {
            this.onAdvanceMarkerClick(marker, markerData);
            console.log("clicked", value);
          });
        } 
        
      } else {
        //for multiple users at same location
        const beachFlagImg = document.createElement('div');
        const imgCont = document.createElement('img');
        const para = document.createElement('span');
        imgCont.src = icons.NEW_MULTIPLE_FREEUSER_WNE;

        imgCont.style.height = '130px';
        imgCont.style.width = '130px';

        para.innerHTML = value.length;
        para.style.position = "absolute";
        para.style.left = "61%";
        para.style.bottom = "59%";
        para.style.color = "black";
        para.style.fontSize = "11px";
        para.style.fontWeight = "bold";
        beachFlagImg.appendChild(imgCont)
        beachFlagImg.appendChild(para);

        const lat = value[0] && value[0].LatLong ? value[0].LatLong.Latitude : value[0] && value[0].Latitude;
        const lng = value[0] && value[0].LatLong ? value[0].LatLong.Longitude : value[0] && value[0].Longitude;


        let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
          position: { lat: lat, lng: lng },
          title: 'Multiple Icon',
          content: beachFlagImg,
        };

        let nearElementsData: any[] = [];
        nearElementsData.push(...value);
        // nearElementsData.push(key)

        if(lat && lng){
          const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

          const markerData: MultipleMarkerInfo<SonarEventSearchRespond> = {
            data: nearElementsData,
            MarkerType: MarkerType.Multiple,
            itemIndex: startIndexInResult
          };
  
          startIndexInResult++;
  
          marker.addListener("click", () => {
            this.onAdvanceMarkerClick(marker, markerData);
            console.log("clicked", nearElementsData);
          });
        }
       
      }
    })
  }

  addSameLatLongMarkersToMap(clusterMap: Map<any[], any[]>, startIndexInResult: number) {
    clusterMap.forEach(async (value: any, key: any) => {
      console.log(clusterMap);
      console.log(value);
      console.log(key);
      //for a single event, sales listing, service requirement, service available
      if (value.length < 2) {
        let markerIcon = "";
        let markerType: MarkerType;
        switch (key.entity) {
          case 'SR':
            markerIcon = icons.SERVICE_REQUIRED;
            markerType = MarkerType.FiniteeService
            break;
          case 'SA':
            markerIcon = icons.SERVICE_AVAILABLE;
            markerType = MarkerType.FiniteeService;
            break;
          case 'SL':
            markerIcon = icons.BUYSELL;
            markerType = MarkerType.Sales;
            break;
          case 'E':
            markerIcon = icons.Eventnotconnectionicon;
            markerType = MarkerType.Event;
            break;
        }

        const imageTag = document.createElement('img');
        if (key.entity === 'U') {

          // imageTag.src = (key[0].ProfileImage ? markerIcon : (key[0].IsConnected ? icons.CONNECTED_USER : icons.UNCONNECTED_USER)); // Set the actual path to your image
          imageTag.src = markerIcon
          // if (key[0].ProfileImage) {
          //   imageTag.className = 'custom-marker-image'; 
          //   imageTag.style.borderRadius = "50%";
          //   imageTag.style.height = "50px";
          //   imageTag.style.width = "50px";
          // }

          // if (key[0].IsConnected && key[0].ProfileImage) imageTag.style.border = "2px solid green";
          // else if (!key[0].IsConnected && key[0].ProfileImage) imageTag.style.border = "2px solid black";
        } else {
          imageTag.src = markerIcon;
        }

        const lat = key && key.LatLong ? key.LatLong.Latitude : key && key.Latitude;
        const lng = key && key.LatLong ? key.LatLong.Longitude : key && key.Longitude;

        let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
          position: { lat: lat, lng: lng },
          title: key.title,
          content: imageTag
        };

        const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

        const markerData: MarkerInfo<any> = {
          data: key,
          MarkerType: MarkerType.Sales,
          itemIndex: startIndexInResult
        };

        startIndexInResult++;

        marker.addListener("click", () => {
          this.onAdvanceMarkerClick(marker, markerData);
          console.log("clicked", key);
        });
      } else {
        //for multiple events, sales listings, etc at near location
        const beachFlagImg = document.createElement('div');
        const imgCont = document.createElement('img');
        const para = document.createElement('span');
        imgCont.src = icons.NEW_MULTIPLE_ICON;
        // beachFlagImg.style.backgroundImage =  icons.MULTIPLE_FREEUSER;
        // beachFlagImg.style.height = "52px";
        // beachFlagImg.style.width = "52px";
        imgCont.style.height = '80px';
        imgCont.style.width = '80px';

        para.innerHTML = value.length;
        para.style.position = "absolute";
        para.style.left = "48%";
        para.style.bottom = "35%";
        para.style.color = "white";
        para.style.fontSize = "20px";
        para.style.fontWeight = "bold";
        beachFlagImg.appendChild(imgCont)
        beachFlagImg.appendChild(para);

        const lat = value[0] && value[0].LatLong ? value[0].LatLong.Latitude : value[0] && value[0].Latitude;
        const lng = value[0] && value[0].LatLong ? value[0].LatLong.Longitude : value[0] && value[0].Longitude;


        let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
          position: { lat: lat, lng: lng },
          title: 'Multiple Icon',
          content: beachFlagImg,
        };

        let nearElementsData: any[] = [];
        nearElementsData.push(...value);
        // nearElementsData.push(key)

        const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

        const markerData: MultipleMarkerInfo<SonarEventSearchRespond> = {
          data: nearElementsData,
          MarkerType: MarkerType.Multiple,
          itemIndex: startIndexInResult
        };

        startIndexInResult++;

        marker.addListener("click", () => {
          this.onAdvanceMarkerClick(marker, markerData);
          console.log("clicked", nearElementsData);
        });
      }
    })

  }

  addUserToMap(users: SonarFreeUserSearchRespond[], startIndexInResult: number, isViewing: boolean = false) {

    users.forEach(user => this.addMultipleUserToMap(user));

    let keysWithSingleValue: any = [];

    Array.from(this.markersMap.entries()).forEach(([key, markers]) => {
      if (markers.length === 1) {
        if (markers[0].entity === 'U') keysWithSingleValue.push(markers[0]);
      }
    });

    // keysWithSingleValue.forEach((key: any) => {
    //   this.markersMap.delete(key.LatLong.Latitude+','+key.LatLong.Longitude);
    // })


    // keysWithSingleValue.forEach(async (res: SonarFreeUserSearchRespond) => {
    //   let isExist = false;
    //   this.userMarkers.forEach((oldmarker: any) => {
    //     let oldMarkerData: MarkerInfo<SonarFreeUserSearchRespond> = oldmarker;
    //     if (oldMarkerData?.data?.Id == res.Id) {
    //       isExist = true;
    //       oldmarker.setMap(null);
    //     }
    //   });

    //   // add user with new details
    //   let userData = this.setUserData(res);
    //   // let icon: string = "";

    //   let userImg: string = "";
    //   if(res.ProfileImage) userImg = AppConstants.mediaPrefix + res.ProfileImage;

    //   const { IsConnected } = res;

    //   // icon = {
    //   //   url: userImg || (IsConnected ? icons.CONNECTED_USER : icons.UNCONNECTED_USER),
    //   //   scaledSize: new google.maps.Size(68, 68), // scaled size
    //   //   className: 'map-marker-icon'
    //   // } 
    //   // templateView = MarkerType.FreeUser;

    //   // let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //   //   position: { lat: userData.LatLong.Latitude, lng: userData.LatLong.Longitude },
    //   //   icon: icon,
    //   //   title: userData.UserName,
    //   //   optimized: false,
    //   // };

    //   // const marker: google.maps.Marker = await this.addMarkerToMap(markerOptions);

    //   // marker.set('markerData', <MarkerInfo<SonarFreeUserSearchRespond>>{
    //   //   data: userData,
    //   //   MarkerType: templateView,
    //   //   itemIndex: startIndexInResult
    //   // });


    //   // MIGRATING TO ADVANCE MARKER

    //   const imageTag = document.createElement('img');
    //   imageTag.src = userImg || (IsConnected ? icons.CONNECTED_USER : icons.UNCONNECTED_USER); // Set the actual path to your image
    //   imageTag.className = 'custom-marker-image'; // You can define a CSS class for styling if needed
    //   imageTag.style.borderRadius = "50%";
    //   imageTag.style.height = "50px";
    //   imageTag.style.width = "50px";

    //   if(IsConnected && userImg) imageTag.style.border = "2px solid green";
    //   else if(!IsConnected && userImg) imageTag.style.border = "2px solid black";

    //   let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //     position: { lat: userData.LatLong.Latitude, lng: userData.LatLong.Longitude },
    //     title: userData.UserName,
    //     content: imageTag,
    //     optimized: false,
    //   };

    //   const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

    //   // marker.map?.set("markerData", <MarkerInfo<SonarFreeUserSearchRespond>>{
    //   //   data: userData,
    //   //   MarkerType: MarkerType.FreeUser,
    //   //   itemIndex: startIndexInResult
    //   // });

    //   const markerData: MarkerInfo<SonarFreeUserSearchRespond> = {
    //     data: userData, 
    //     MarkerType: MarkerType.FiniteeService,
    //     itemIndex: startIndexInResult
    //   };

    //   marker.addListener("click", () => {
    //     this.onAdvanceMarkerClick(marker, markerData);
    //   });

    //   if (!isExist) {
    //     this.userMarkers.push(userData);
    //   }
    //   startIndexInResult++;//??
    // });
    return startIndexInResult;
  }

  // displayChangedLocation = (data: any) => {
  //   if (data?.coords) {
  //     this.location.lat = data.coords.latitude;
  //     this.location.lng = data.coords.longitude;
  //     if (this.currentLocationMarker) {
  //       this.currentLocationMarker.setPosition(this.location);
  //       this.updateCurrentLocation(this.user.UserId);
  //     }
  //   }
  // }

  // async updateCurrentLocation(user_id: number) {
  //   const method = config.UPD_LOC_V1;
  //   const params = {
  //     UserId: user_id,
  //     Latitude: this.location.lat,
  //     Longitude: this.location.lng,
  //   };
  //   await this.http.post(method, params).subscribe(result => { });
  // }

  userMarkerCluster: any;
  stopPing() {
    this.searchCriteria = null;
    this.pingResults = [];
  }

  addServiceRequiredToMap(services: SonarServiceRequiredSearchRespond[], serviceType: string, startIndexInResult: number) {

    this.mixedArray.push(...services);

    // services.forEach(service => this.addMultipleUserToMap(service));

    // let keysWithSingleValue: any = [];

    // Array.from(this.markersMap.entries()).forEach(([key, markers]) => {
    //   if (markers.length === 1) {
    //     if (markers[0].entity === 'SR') keysWithSingleValue.push(markers[0]);
    //   }
    // });

    // keysWithSingleValue.forEach((key: any) => {
    //   this.markersMap.delete(key.Latitude+','+key.Longitude);
    // })



    // keysWithSingleValue.forEach(async (each: any) => {

    //   const beachFlagImg = document.createElement('img');
    //   beachFlagImg.src =  icons.SERVICE_REQUIRED;

    //   let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //     position: { lat: each.Latitude, lng: each.Longitude },
    //     icon: icons.SERVICE_REQUIRED,
    //     title: each.Title,
    //     content: beachFlagImg
    //   };

    //   const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

    //   const markerData: MarkerInfo<SonarServiceRequiredSearchRespond> = {
    //     data: each, 
    //     MarkerType: MarkerType.FiniteeService,
    //     itemIndex: startIndexInResult
    //   };
    //   // this.serviceRequired_markers.push(marker);
    //   startIndexInResult++;
    //   marker.addListener("click", () => {
    //     this.onAdvanceMarkerClick(marker, markerData);
    //   })
    // });
    return startIndexInResult;
  }

  addServiceAvailableToMap(services: SonarServiceAvailableSearchRespond[], serviceType: string, startIndexInResult: number) {

    this.mixedArray.push(...services);

    // services.forEach(service => this.addMultipleUserToMap(service));

    // let keysWithSingleValue: any = [];
    // console.log("map at SA", this.markersMap);
    // Array.from(this.markersMap.entries()).forEach(([key, markers]) => {
    //   if (markers.length === 1) {
    //     if (markers[0].entity === 'SA') keysWithSingleValue.push(markers[0]);
    //   }
    // });

    // keysWithSingleValue.forEach(async (each: any) => {

    //   this.markers.forEach(oldmarker => {
    //     if (oldmarker.get('ServiceId') == each.Id) {
    //       oldmarker.setMap(null);
    //     }
    //   });

    //   const beachFlagImg = document.createElement('img');
    //   beachFlagImg.src =  icons.SERVICE_AVAILABLE;


    //   let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //     position: { lat: each.Latitude, lng: each.Longitude },
    //     icon: icons.SERVICE_AVAILABLE,
    //     title: each.Title,
    //     content: beachFlagImg
    //   };

    //   const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

    //   const markerData: MarkerInfo<SonarServiceAvailableSearchRespond> = {
    //     data: each, 
    //     MarkerType: MarkerType.FiniteeService,
    //     itemIndex: startIndexInResult
    //   };

    //   startIndexInResult++;
    //   marker.addListener("click", () => {
    //     console.log("clicked", marker)
    //     this.onAdvanceMarkerClick(marker, markerData);
    //   });
    // });

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
        marker.addListener("click", () => {
          this.onMarkerClick(marker);
        });
      }
    });
    return startIndexInResult;
  }

  addEventToMap(events: SonarEventSearchRespond[], startIndexInResult: number) {
    this.mixedArray.push(...events);
    // events.forEach(events => this.addMultipleUserToMap(events));

    // let keysWithSingleValue: any = [];

    // Array.from(this.markersMap.entries()).forEach(([key, markers]) => {
    //   if (markers.length === 1) {
    //     if(markers[0].entity === 'E') keysWithSingleValue.push(markers[0]);
    //   }
    // });

    // events.map(async (eachEvent) => {
    //   if (!this.event_markers.some((cres: any) => cres.Id == eachEvent.Id)) {

    //     const beachFlagImg = document.createElement('img');
    //     beachFlagImg.src = icons.EVENT;

    //     let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //       position: { lat: eachEvent.Latitude, lng: eachEvent.Longitude },
    //       // icon: icons.BUYSELL,
    //       title: eachEvent.Title,
    //       content: beachFlagImg
    //     };

    //     const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

    //     const markerData: MarkerInfo<SonarEventSearchRespond> = {
    //       data: eachEvent,
    //       MarkerType: MarkerType.Event,
    //       itemIndex: startIndexInResult
    //     };

    //     this.event_markers.push(marker);
    //     startIndexInResult++;
    //     marker.addListener("click", () => {
    //       this.onAdvanceMarkerClick(marker, markerData);
    //     });
    //   }
    // });
    return startIndexInResult;
  }

  addSalesListingToMap(salesList: SonarSalesListingSearchRespond[], startIndexInResult: number) {

    this.mixedArray.push(...salesList);
    // salesList.forEach(salesList => this.addMultipleUserToMap(salesList));

    // let keysWithSingleValue: any = [];

    // Array.from(this.markersMap.entries()).forEach(([key, markers]) => {
    //   if (markers.length === 1) {
    //     if(markers[0].entity === 'SL') keysWithSingleValue.push(markers[0]);
    //   }
    // });

    // salesList.map(async (salesList) => {
    //   if (!this.salesListing_markers.some((cres: any) => cres.Id == salesList.Id)) {

    //     const beachFlagImg = document.createElement('img');
    //     beachFlagImg.src = icons.BUYSELL;

    //     let markerOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{
    //       position: { lat: salesList.Latitude, lng: salesList.Longitude },
    //       // icon: icons.BUYSELL,
    //       title: salesList.Title,
    //       content: beachFlagImg
    //     };

    //     const marker: google.maps.marker.AdvancedMarkerElement = await this.addAdvanceMarkerToMap(markerOptions);

    //     // marker.map?.set("markerData", <MarkerInfo<SonarSalesListingSearchRespond>>{
    //     //   data: salesList,
    //     //   MarkerType: MarkerType.Sales,
    //     //   itemIndex: startIndexInResult
    //     // });

    //     const markerData: MarkerInfo<SonarSalesListingSearchRespond> = {
    //       data: salesList,
    //       MarkerType: MarkerType.FiniteeService,
    //       itemIndex: startIndexInResult
    //     };

    //     this.salesListing_markers.push(marker);
    //     startIndexInResult++;
    //     marker.addListener("click", () => {
    //       this.onAdvanceMarkerClick(marker, markerData);
    //     });
    //   }
    // });
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
          return o1.get('id') === o2.id;// assumes unique id
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
    // this.isLocationTurnedOn = true;
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
      // this.updateVisibleMode(1);
      this.makeUserInvisible(true);
      this.setCurrentLocationMarker();
    } else {
      // this.updateVisibleMode(0);
      this.makeUserInvisible(false);
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
    const res = this.mainResultFromSearch.findIndex((v: any) => {
      return (v as any)?.Id === markerData.data.Id
    })
    this.markerCurrentIndex = res;
    await this.openMarkerDetails();
  }

  async onMarkerClick(params: google.maps.Marker) {//Obsolete function to open MapInfoWindow
    console.log("onMarkerClick....");
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
      case MarkerType.Event: {
        compRef.instance.event = markerData.data
      }
        break;
    }

    let refrence = div.getElementsByClassName(`refrence-${markerData.MarkerType}`)[0];
    this.mapWindow.setOptions({ content: refrence });

    if (markerData.MarkerType == MarkerType.FreeUser || markerData.MarkerType == MarkerType.BusinessNonProfitUser) {
      let toUserId: number = markerData.data.Id;
      let toUserName: number = markerData.data.UserName;
      let fromUserName: number = this.user.name;
      let fromUserId: number = this.user.UserId;
    }

    // Dynamic rendering
    this._ngZone.run(() => {
      this.mapWindow.open(this.map, params);
    });
  }

  // advance marker click map

  async onAdvanceMarkerClickV2(marker: any, data?: any) {
    this.mainResultFromSearch = this.mainResultFromSearch.sort((a: any, b: any) => a.Proximity - b.Proximity);

    // const markerData: MarkerInfo<any> = (marker as any)?.markerData;
    const markerData = data;
    this.markerCurrentIndex = markerData.itemIndex;
    const id = markerData.data[0] ? markerData.data[0].Id : markerData.data.Id;
    const res = this.mainResultFromSearch.findIndex((v: any) => {
      return (v as any)?.Id === id;
    })
    this.markerCurrentIndex = res;
    await this.openMarkerDetails();
  }

  async onAdvanceMarkerClick(params: any, data?: any) {
    console.log(data);
    const latLng = params?.position;
    if (latLng) {
      const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;

      this.map?.panTo({ lat, lng });
    }
    if (data.data.length > 1) {
      this.onMapResultsClick(data);
    } else {
      this.onAdvanceMarkerClickV2(params, data);
    }

    if (this.mapWindow) {
      this.mapWindow.close();
    }
  }

  backbtn() {
    this.router.navigateByUrl('/tabs/tab1');
  }

  public async onViewingClick(): Promise<void> {
    const modal = await this.modalController.create({
      component: ViewingUsersComponent,
      componentProps: {
        template: "Viewing",
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) {
        this.addUserToMap([result.data as SonarFreeUserSearchRespond], 0);
      }
    });
    return await modal.present();
  }

  showSonarSearchResultInListView(checkSonarResult?: boolean) {
    this.onMapResultsClick(this.mainResultFromSearch, checkSonarResult);
  }

  public async onMapResultsClick(data: any, checkSonarResult?: boolean): Promise<void> {


    // let results = this.mapService.mainList;
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

    const sonarResult = data?.data || data;
    let modal : any = [];
    console.log('checkSonarResult', checkSonarResult)
    if(checkSonarResult){
      modal = await this.modalController.create({
        component: MapResultComponent,
        componentProps: {
          results: sonarResult
        },
      });
    }else{
      modal = await this.modalController.create({
        component: MapResultComponent,
        componentProps: {
          results: sonarResult
        },
        initialBreakpoint: 0.75 
      });
    }
    
    modal.onDidDismiss().then((result: any) => {
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
    // console.log(markers);
    var bounds = new google.maps.LatLngBounds();
    for (var i in markers) {// your marker list here
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
    // const obj = {
    //   lat: this.location.lat,
    //   lng: this.location.lng,
    //   id: this.user.UserId,
    //   setting: this.privacySett,
    //   radius: this.radius,
    //   searchCriteria: this.searchCriteria,
    // };

    const obj: AllSonarSearchRequest = {
      geolocation: { latitude: this.location.lat, longitude: this.location.lng },
      searchKey: 'nisa',
      scope: 1,
      freeUser: true,
      connections: false,
      businessUser: true,
      nonProfitUser: false,
      events: true,
      sales: false,
      serviceReq: true,
      serviceAvailable: false,
    };
    const screenWidth = window.innerWidth;

    let breakpoints: number[];
    let initialBreakpoint: number;

    if (screenWidth < 768) {

      if (screenWidth == 412) {
        breakpoints = [0, 0.8];
        initialBreakpoint = 0.7;
      } else {
        breakpoints = [0, 1];
        initialBreakpoint = 0.9;
      }
      // Small screens (e.g., smartphones)

    }
    else if (screenWidth >= 768 && screenWidth < 1024) {
      // Medium screens (e.g., tablets)
      breakpoints = [0, 0.6];
      initialBreakpoint = 0.6;
    } else {
      // Large screens (e.g., desktops)
      breakpoints = [0, 0.4];
      initialBreakpoint = 0.4;
    }

    const modal = await this.modalController.create({
      component: MapSearchComponent,
      breakpoints: breakpoints,
      initialBreakpoint: initialBreakpoint,
      handle: false,
      componentProps: { values: obj }
    });
    modal.onDidDismiss().then(result => {
      this.markers.splice(0, this.markers.length);
      this.clearResults();
      this.mapSearchResult = result;
      // this.removeSearchResultFromMap();obsolete
      // this.removeAdvanceMarkerFromMap();
      if (result.data) {
        if (result.data?.status == 'L') {

          let Latitude = result.data?.lat;
          let Longitude = result.data?.lng;
          let RangeInKm = 2;

          this.getTotemByUserId(Latitude, Longitude, RangeInKm);
        } else {
          this.searchCriteria = result.data;
          if (result.data?.status == 'P') {
            // this.setCircle(result.data)
          }
          if (result.data) {
            // result.data[`location`] = this.location;
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
    const method: any = config.API.SEARCH.ALL_SONAR_SEARCH;
    await this.http.post(method, params)
      .subscribe(async (result: any) => {
        console.log(config.API.SEARCH.ALL_SONAR_SEARCH, result);
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
  clearResults(onMapSearchDismiss?: any) {
    //this._signalRService.onMapSearchClear(this.user_markers.filter(marker => marker.UserTypeId == 1).map(x => x.id));
    if (onMapSearchDismiss) this.getUserSonarPrivacySettings();
    this.mainResultFromSearch = [];
    this.mixedArray = [];
    this.changedArray = [];
    this.clusterMap.clear();
    this.markersMap.clear();
    this.clearMap();
    this.removeSearchResultFromMap();
    this.removeAdvanceMarkerFromMap();
    if (this.getFlag() != 'P') {
      this.removeCircle();
    }
    this.searchCriteria = null;
    this.removeCluster();
    // this.refreshMap()
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
    // const svg = window.btoa(`
    //   <svg fill="#03A9F4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    //     <circle cx="120" cy="120" opacity=".6" r="50" />
    //     <circle cx="120" cy="120" opacity=".3" r="70" />
    //     <circle cx="120" cy="120" opacity=".2" r="90" />
    //     <circle cx="120" cy="120" opacity=".1" r="110" />
    //   </svg>`);
    // const renderer = {
    //   render: (data: any) =>
    //     new google.maps.Marker({
    //       label: { text: String(data.count), color: "white", fontSize: "15px" },
    //       icon: {
    //         url: `data:image/svg+xml;base64,${svg}`,
    //         scaledSize: new google.maps.Size(45, 45),
    //       },
    //       // adjust zIndex to be above other markers
    //       zIndex: Number(google.maps.Marker.MAX_ZINDEX) + data.count,
    //     }),
    // };
    // console.log('this.markerCluster',this.markerCluster)
    if (this.markerCluster) this.markerCluster.clearMarkers();
    this.markerCluster = new MarkerClusterer({
      map: this.map,
      markers: setclusters,
      algorithmOptions: {
        maxZoom: 12, 
      }
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
    this.sonarSettingModal?.onDidDismiss().then((data) => {
      // Handle the data received when the modal is closed
      console.log('Data received:', data.data?.data.LocationShowAt);
      if (data.data?.data.LocationShowAt === 'H') {
        this.locationUpdateSubscription.unsubscribe();

      }
      else if (data.data?.data.LocationShowAt === 'L') this.setupLocationUpdates();
    });

  }

  public async setHomeLocation() {
    const home_Location = localStorage.getItem('location');
    // if(home_Location != null) this.homeLocation = home_Location;
    // this.location.lat = homeLocation?.latitude;
  }

  public async viewGreetingDetails(): Promise<void> {
    // this._commonService.greetingStatusWithDetails();
    const modal = await this.modalController.create({
      component: ViewingUsersComponent,
      componentProps: {
        template: "Greeting"
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) {
        // this.addUserToMap([result.data as SonarFreeUserSearchRespond], 0);
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
