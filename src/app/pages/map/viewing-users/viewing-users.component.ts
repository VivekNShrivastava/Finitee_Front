import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { environment } from 'src/environments/environment';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { NavigationExtras, Router } from '@angular/router';

export enum GreetingCode {
  GreetingSend = 'Send',
  GreetingAccept = 'Accept',
  GreetingReject = 'Reject',
  GreetingBlock = 'Block'
}

@Component({
  selector: 'viewing-users',
  templateUrl: './viewing-users.component.html',
  styleUrls: ['./viewing-users.component.scss'],
})
export class ViewingUsersComponent implements OnInit {
  readonly appConstants: any = AppConstants;
  public viewType: number = 1;
  public viewTemplate: string = "";
  public viewList: any = [];
  public greetList: any = [];
  public attachmentURL = environment.attachementUrl;
  constructor(
    public _commonService: CommonService,
    public navParams: NavParams,
    public _modalController: ModalController,
    private firestoreService: FirestoreService,
    public router: Router
  ) { 
    const res = this.navParams.get('template');
    console.log(res);
    // this.viewTemplate = navParams?.data['viewTemplate'] ?? this.viewTemplate;
    this.viewTemplate = res;
    console.log("view", this.viewTemplate)

    this.firestoreService.viewList$.subscribe(updatedData => {
      console.log("map updated data", updatedData);
      this.viewList = updatedData;
    });

    this.firestoreService.greetingList$.subscribe(updatedData => {
      console.log("map updated data", updatedData);
      this.greetList = updatedData;
    });
  }

  ngOnInit() { }

  goBack() {
    this._modalController.dismiss();
  }

  openUser(user: FiniteeUserOnMap) {
    this.goBack();
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

  public onViewTypeChange(viewType: number): void {
    this.viewType = viewType;
  }

  public viewConnection(user: FiniteeUserOnMap): void {

  }

  public viewUserOnMap(user: FiniteeUserOnMap): void {
    this._modalController.dismiss(user);
  }

  public startChat(user: FiniteeUserOnMap): void {

  }

  public greetingUpdate(user: FiniteeUserOnMap, greetingStatus: string): void {

  }

  public blockUser(): void {

  }
}
