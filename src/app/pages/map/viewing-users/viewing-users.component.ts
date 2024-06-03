import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { environment } from 'src/environments/environment';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { NavigationExtras, Router } from '@angular/router';
import { MapService } from '../services/map.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { GreetingViewComponent } from '../greeting-view/greeting-view.component';

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
export class ViewingUsersComponent extends BasePage implements OnInit, OnDestroy {
  public viewType: number = 1;
  public activeOrExpired: number = 1;
  public viewTemplate: string = "";
  public viewList: any = [];
  public greetList: any = [];
  public attachmentURL = environment.attachementUrl;
  public greetingListApi: any = [];
  public filteredGreetingList: any = [];

  constructor(
    public _commonService: CommonService,
    public navParams: NavParams,
    public _modalController: ModalController,
    private firestoreService: FirestoreService,
    public router: Router,
    private mapService: MapService,
    private authService: AuthService,
  ) {
    super(authService);
    const res = this.navParams.get('template');
    this.viewTemplate = res;

    this.firestoreService.greetingList$.subscribe(updatedData => {
      this.greetList = updatedData;
      if (this.viewTemplate === "Greeting") this.getUserGreetingHistory();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.updateFirebaseGreeting();
  }

  goBack() {
    this._modalController.dismiss();
  }

  async updateFirebaseGreeting() {
    const res = await this.mapService.updateFirebaseGreeting();
  }

  async getUserGreetingHistory() {
    const res = await this.mapService.getGreetingHistory();
    if (res) this.greetingListApi = res?.ResponseData?.greetings;
    this.activeExpiredGreeting(1);
  }

  openUser(user: FiniteeUserOnMap) {
    this.goBack();
    const navigationExtras: NavigationExtras = {
      state: {
        data: user
      }
    };
    if (user.UserTypeId == AppConstants.USER_TYPE.BN_USER)
      this.router.navigateByUrl('business-user-canvas-other', navigationExtras);
    else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.router.navigateByUrl('free-user-canvas', navigationExtras);
  }

  public async greetingRecieved(user: any): Promise<void> {
    const modal = await this._modalController.create({
      component: GreetingViewComponent,
      componentProps: {
        fromUserId: this.greetingListApi.user
      }
    });

    return await modal.present();
  }

  public onViewTypeChange(viewType: number): void {
    this.viewType = viewType;
  }

  public activeExpiredGreeting(viewType: number): void {
    this.activeOrExpired = viewType;

    if (viewType === 1) {
      this.filteredGreetingList = this.greetingListApi.filter((x: any) => x.Status === null);
    } else if (viewType === 2) {
      this.filteredGreetingList = this.greetingListApi.filter((x: any) => x.Status != null);
    }
  }

  public viewConnection(user: FiniteeUserOnMap): void {}

  public viewUserOnMap(user: FiniteeUserOnMap): void {}

  public startChat(user: FiniteeUserOnMap): void {}

  public greetingUpdate(user: FiniteeUserOnMap, greetingStatus: string): void {}

  public blockUser(): void {}
}
