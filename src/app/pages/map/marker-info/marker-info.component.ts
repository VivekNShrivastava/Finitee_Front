import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ComponentRef, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Greeting } from 'src/app/pages/map/models/UserOnMap';
import * as config from 'src/app/core/models/config/ApiMethods';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { MapService } from 'src/app/pages/map/services/map.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { MarkerType } from '../models/MarkerInfo';
import { FiniteeService } from '../models/FiniteeService';
import { TotemSearchResult, FiniteeUserOnMap } from '../models/MapSearchResult';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { UserLocation } from '../models/Location';
import { environment } from 'src/environments/environment';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-marker-info',
  templateUrl: './marker-info.component.html',
  styleUrls: ['./marker-info.component.scss'],
})
export class MarkerInfoComponent implements AfterViewInit{
  public htmlInfoWindow?:google.maps.InfoWindow;
  public compRef?: ComponentRef<MarkerInfoComponent>;
  public markerType?: MarkerType;
  public attachmentURL = environment.attachementUrl;
  public currentUserLocation?:UserLocation;
  public profileImage?:string;
  public group:any;
  public event:any;
  public isSavedLocation:boolean = false;
  public savedLocation:any = {};
  public finiteeService: FiniteeService = <FiniteeService>{};
  public sales?:FiniteeUserOnMap;
  public totem:TotemSearchResult = <TotemSearchResult>{};
  public freeUser:FiniteeUserOnMap = <FiniteeUserOnMap>{};
  public businessAndNonProfitUser:FiniteeUserOnMap = <FiniteeUserOnMap>{};
  constructor(
    public navController: NavController,
    public router: Router,
    public httpService: HttpClient,
    public _chatsService:ChatsService,
    public _authService: AuthService,
    private navCtrl: NavController,
    private mapService : MapService,
    private _commonService : CommonService,
    private _notificationService: SignalRService
  ) {
  }


  ngAfterViewInit(): void {
    if (this.markerType == MarkerType.BusinessNonProfitUser) {
      this.isSavedLocation = (this._commonService.savedSonarLocations ?? []).find(x => x.FlagId == this.businessAndNonProfitUser.UserId) ? true : false;
    }
    if (this.markerType == MarkerType.SavedLocation) {
      this.isSavedLocation = (this._commonService.savedSonarLocations ?? []).find(x => x.FlagId == this.savedLocation.FlagId) ? true : false;
    }
  }


  goToViewConnection(data?: any) {


    console.log("goToViewConnection: ", data);
    if (data) {
      // const navgiationExtras: NavigationExtras = {
      //   state: {
      //     data: {
      //       id: data?.UserId
      //     }
      //   }
      // };
      // console.log("navgiationExtras: ", navgiationExtras);
      // this.navController.navigateForward('view-connection', navgiationExtras);

      this.openUser(data);

    }
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

  public openChat():void {

  }

  gotoSalesItem(salesId:number = 0) {
    const navEx: NavigationExtras = {
      state: {
        data: {
          onlyId: salesId
        }
      }
    };
    this.navCtrl.navigateForward(['sales-item', navEx]);
  }
  gotototem() {
    const obj = {};
    const navigationExtras: NavigationExtras = {
      state: {
        data: obj
      }
    };
    this.navCtrl.navigateForward(['totem-detail'], navigationExtras);
  }

  gotoChat() {
    this.navCtrl.navigateForward(['messages']);
  }

  gotoEvent() {

  }

  gotoGroupPage() {
    const obj = {};
    const navigationExtras: NavigationExtras = {
      state: {
        data: obj
      }
    };
    this.navCtrl.navigateForward(['view-group'], navigationExtras);
  }

  getEventById() {
    const params = {};
    const method = config.GET_EVE_BY_ID;
    this.httpService.post(method, params)
      .subscribe((result: any) => {
        if (result.ResponseData != null) {
          const navigationExtras1s: NavigationExtras = {
            state: {
              data: result.ResponseData[0]
            }
          };
          this.navCtrl.navigateForward(['event-detail'], navigationExtras1s);
        }
      });
  }

  addToMap(status:string) {
    this.htmlInfoWindow?.close();
    this.compRef?.destroy();
    const params: any = {
      FlagId: 0,
      FromUserId: this._authService.getUserId(),
      Latitude: this.businessAndNonProfitUser?.Latitude,
      Longitude: this.businessAndNonProfitUser?.Longitude,
      // DateTime: new Date(),
      Flag: status
    };
    const obj: any = {};
    if (status == 'B') {
      params.FlagId = this.businessAndNonProfitUser?.UserId;
      obj.id = this.businessAndNonProfitUser?.UserId;
    } else if (status == 'G') {
      params.FlagId = this.group.GroupId;
      obj.id = this.group.GroupId;;
    } else if (status == 'E') {
      params.FlagId = this.event.Id;
      obj.id = this.event.Id;
    }
    obj.status = 'A';
    // obj.fflag = this.fflag == null ? 'L' : this.fflag;
    const method = config.ADD_TO_SONAR;
    this.httpService.post(method, params)
      .subscribe((result: any) => {
        if (result != null) {
          document.dispatchEvent(new Event('getSonarList'));
        }
      });
  }

  removeMap(status: string): void {
    this.htmlInfoWindow?.close();
    this.compRef?.destroy();
    let idToDeleteFrom: any = null;
    if (status == 'B') {
      idToDeleteFrom = this.savedLocation.Id;
    } else if (status == 'G') {
      idToDeleteFrom = this.savedLocation.GroupId;
    } else if (status == 'E') {
      idToDeleteFrom = this.savedLocation.Id;
    } 
    this.httpService.delete(`${config.RMV_TO_SONAR}/${idToDeleteFrom}`)
      .subscribe((result) => {
        console.log("removeMap: " + idToDeleteFrom + " Response:", result);
        document.dispatchEvent(new Event('getSonarList'));
      });
  }

  fromMultiple(item:any) {
    // this.touserid = item.touserid;
    // this.tuserCode = item.tuserCode;
    // this.isConnection = item.connid || false;
    // if (this.userTypeCode == 'b' || this.userTypeCode == 'n') {
    //   this.goToViewConnection();
    // }
    // if (this.userTypeCode == 'f') {
    //   this.goToViewConnection();
    // }
    // if (item.userTypeCode == 's') {
    //   this.gotoSalesItem(0);
    // }
  }

  infoClose() {
    this.htmlInfoWindow?.close();
    this.compRef?.destroy();
  }

  public goToChat(): void {

  }

  public ignoreUser(): void {

  }

  public blockUser(): void {

  }

  startChat() {

    let data = this.getMarkerData();
    let selctedUser = {
      UserId: this.markerType == MarkerType.SavedLocation ? data.FlagId : data.Id,
      DisplayName: data?.DisplayName,
      ProfilePhoto: data?.ProfilePhoto,
      groupId:null
    }
    this._chatsService.openChat(selctedUser);
  }

  getMarkerData() {
    switch (this.markerType) {
      case MarkerType.FiniteeService: {
        return this.finiteeService;
      }
      case MarkerType.Sales: {
        return this.sales;
      }
      case MarkerType.Totem: {
        return this.totem;
      }
      case MarkerType.FreeUser: {
        return this.freeUser;
      }
      case MarkerType.BusinessNonProfitUser: {
        return this.businessAndNonProfitUser;
      }
      case MarkerType.SavedLocation: {
        return this.savedLocation;
      }
      default: {
        return null;
      }
    }
  }

  viewBusiness(dataItem:any){

    console.log("dataItem",dataItem);

    const navigationExtras1s: NavigationExtras = {
      state: {
        data: dataItem
      }
    };
    this.router.navigate(['business-user-canvas-other'], navigationExtras1s);
    //this.router.navigateByUrl('product/add-edit-product', this.navEx);
  }
}
