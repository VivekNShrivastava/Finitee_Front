import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { environment } from 'src/environments/environment';
import { UserOnMap } from '../models/UserOnMap';
import { NavigationExtras, Router } from '@angular/router';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

export enum GreetingCode {
  GreetingSend = 'Send',
  GreetingAccept = 'Accept',
  GreetingReject = 'Reject',
  GreetingBlock = 'Block'
}

@Component({
  selector: 'map-result',
  templateUrl: './map-result.component.html',
  styleUrls: ['./map-result.component.scss'],
})
export class MapResultComponent implements OnInit {
  readonly appConstants: any = AppConstants;
  public viewType: number = 1;
  public viewTemplate: string = "ShowByType";
  public attachmentURL = environment.attachementUrl;
  results = [];
  users = [];
  business = [];
  nonProfits = [];
  donations = [];
  totems = [];
  salesListings = [];

  constructor(
    public _commonService: CommonService,
    public navParams: NavParams,
    public _modalController: ModalController,
    public router: Router,
  ) {
    this.viewTemplate = navParams?.data['viewTemplate'] ?? this.viewTemplate;
    this.results = navParams?.data['results'];
    console.log("Passed Results:", this.results);
  }

  ngOnInit() {

    if (this.results.length > 0) {
      // this.snrlst.forEach((val: any) => {
      //   results = results.filter((x: any) => val.FlagId != x.UserId)
      // })
      this.users = this.results.filter((val: any) => val.entity == 'U' && val.UserTypeId == 1);
      this.business = this.results.filter((val: any) => val.entity == 'U' && val.UserTypeId == 2);
      this.nonProfits = this.results.filter((val: any) => val.entity == 'U' && val.UserTypeId == 3);
      this.totems = this.results.filter((val: any) => val.entity == 'T');
      const serviceAvailable = this.results.filter((val: any) => val.entity == 'SA');
      const serviceRequired = this.results.filter((val: any) => val.entity == 'SR');

    }
  }

  goBack() {
    this._modalController.dismiss();
  }

  public onViewTypeChange(viewType: number): void {
    this.viewType = viewType;
  }

  public viewConnection(user: FiniteeUserOnMap): void {
    // if (user) {
    //   this.openUser(user);
    // }
    this.dismissModal("VIEW_CONNECTION", user);
  }

  public viewUserOnMap(user: FiniteeUserOnMap): void {
    // const result = {
    //   action: "ViewMap",
    //   data: user
    // }
    // this._modalController.dismiss(result);
    this.dismissModal("VIEW_MAP", user);
  }

  public startChat(user: UserOnMap): void {
    let selctedUser = {
      UserId: user?.Id,
      DisplayName: user?.DisplayName,
      ProfilePhoto: user?.ProfilePhoto,
      groupId: null
    }
    // this._chatsService.openChat(selctedUser);

    this.dismissModal("CHAT", selctedUser);
  }

  public greetingUpdate(user: FiniteeUserOnMap, greetingStatus: string): void {

  }

  public blockUser(): void {

  }

  viewBusiness(dataItem: any) {
    console.log("dataItem", dataItem);
    // const navigationExtras1s: NavigationExtras = {
    //   state: {
    //     data: dataItem
    //   }
    // };
    // this.router.navigate(['business-user-canvas-other'], navigationExtras1s);
    this.dismissModal("VIEW_BUSINESS", dataItem);
  }

  dismissModal(action: string, data: any) {
    const result = {
      action: action,
      data: data
    }
    this._modalController.dismiss(result);
  }
}
