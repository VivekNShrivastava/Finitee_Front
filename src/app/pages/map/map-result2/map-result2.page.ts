import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
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
  selector: 'app-map-result2',
  templateUrl: './map-result2.page.html',
  styleUrls: ['./map-result2.page.scss'],
})
export class MapResult2Page implements OnInit {
  readonly appConstants: any = AppConstants;
  public viewType: number = 1;
  public viewTemplate: string = "ShowByType";
  public attachmentURL = environment.attachementUrl;
  results = [];
  users = [];
  paramsData: any;
  business = [];
  nonProfits = [];
  donations = [];
  totems = [];
  salesListings = [];
  serviceAvailable = [];
  serviceRequired = [];
  events: any[] = [];
  displayLimit = 5; // Number of users to show initially
  userDisplayLimit = [5]; // Array to track the blocks of users displayed
  showMore = true;
  showAll = false;
  changeDetector: any;

  constructor(
    public _commonService: CommonService,
    public _modalController: ModalController,
    public router: Router,
  ) {

    this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    this.viewTemplate = this.paramsData.viewTemplate;
    this.results = this.paramsData.results;

    
    // this.viewTemplate = navParams?.data['viewTemplate'] ?? this.viewTemplate;
    // this.results = navParams?.data['results'];
    // console.log("Passed Results:", this.results);
  }

  ngOnInit() {

    if (this.results.length > 0) {
      // this.snrlst.forEach((val: any) => {
      //   results = results.filter((x: any) => val.FlagId != x.UserId)
      // })
      this.users = this.results.filter((val: any) => val.entity == 'U');
      this.business = this.results.filter((val: any) => val.entity == 'U' && val.UserTypeId == 2);
      this.nonProfits = this.results.filter((val: any) => val.entity == 'U' && val.UserTypeId == 3);
      this.totems = this.results.filter((val: any) => val.entity == 'T');
      this.salesListings = this.results.filter((val: any) => val.entity == 'SL');
      this.serviceAvailable = this.results.filter((val: any) => val.entity == 'SA');
      this.serviceRequired = this.results.filter((val: any) => val.entity == 'SR');
      this.events = this.results.filter((val: any) => val.entity == 'E');
        // Initialize showFullDescription property for users
        // this.events.forEach(event => event.showFullDescription = false);
    }
  }

  goBack() {
    this.router.navigateByUrl('/tabs/map');
  }

  handleButtonClick() {
    if (this.showMore) {
      // Show 5 more users
      let nextLimit = this.userDisplayLimit[this.userDisplayLimit.length - 1] + 5;
      this.userDisplayLimit.push(nextLimit);
    } else {
      // Navigate to "All Users" page
      this.showAllUsers();
    }
    this.showMore = !this.showMore; // Toggle between 'See More' and 'See All'
  }

  // Show all users
  showAllUsers() {
    console.log('Navigating to All Users page...');
  
    // Navigate directly to the All Users page without dismissing the modal
    this.router.navigate(['/all-users'], {
      state: {
        users: this.users, // Pass the users to the All Users page
      }
    });
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
