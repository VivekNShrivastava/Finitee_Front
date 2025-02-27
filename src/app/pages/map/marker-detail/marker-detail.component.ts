import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { IonModal, Platform } from '@ionic/angular';
import 'firebase/firestore';
import { MapService } from '../services/map.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { FiniteeUserOnMap } from '../models/MapSearchResult';
import { NavigationExtras, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ModalController } from '@ionic/angular';
import { ChatDetailPage } from '../../chat/chat-detail/chat-detail.page';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { AlertController } from '@ionic/angular';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-marker-detail',
  templateUrl: './marker-detail.component.html',
  styleUrls: ['./marker-detail.component.scss'],
})
export class MarkerDetailComponent implements OnInit {

  @Input() markerList!: any;
  @Input() markerCurrentIndex!: number;
  @Output() onCloseDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowPrevious: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() panMapToCurrLoc: EventEmitter<any> = new EventEmitter<any>();
  readonly appConstants: any = AppConstants;
  showNext: boolean = false;
  showPrevious: boolean = false;
  currentItem: any;
  onView: any;
  basepage: any = BasePage;
  user: any;
  greetingList: any = [];
  swipeSubsciption!: Subscription;
  greetingIcon: string = 'greeting';
  connectionIcon: string = 'send-connection-sonar-icon';
  prevIconName: string = "";
  nextIconName: string = "";
 
  @ViewChild(IonModal) greetingAcceptRejectModal?: IonModal;
  deviceHeight: number | undefined;
  formattedInflows: string;



  constructor(public swipeService: SwipeService,
    private platform: Platform,
    public mapService: MapService,
    public authService: AuthService,
    public router: Router,
    public commonService: CommonService,
    public modalController: ModalController,
    public chatService: ChatsService,
    public firestoreService: FirestoreService,
    public connectionsService: ConnectionsService,
    public alertController: AlertController
  ) {
    this.user = this.authService.getUserInfo();
    console.log("marker-user", this.user);
    this.formattedInflows = '';
    //removed viewing functionality

    this.firestoreService.greetingList$.subscribe(updatedData => {
      this.greetingList = updatedData;
      if (this.greetingList.length > 0) {
        const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
        if (this.greetingList[0] === id && this.markerList[this.markerCurrentIndex].Greeting === 1) {
          this.markerList[this.markerCurrentIndex].Greeting = 4;
          // this.updateGreetingIcon();
          // this.getButtonClass();
          // this.getButtonText();

        }
      } else {
        if (this.markerList && this.markerList[this.markerCurrentIndex].Greeting === 4) {
          this.markerList[this.markerCurrentIndex].Greeting = 1;
          // this.updateGreetingIcon();
          // this.getButtonClass();
          // this.getButtonText();   
        }
      }

      // this.loadCurrentItem();
      console.log("map updated data", this.greetingList);
    });
  }

  ngOnInit() {
    // console.log("markerCurrentIndex: ", this.markerCurrentIndex);
    // console.log("markerList tl", this.markerList);
    // console.log("markerList: ", this.markerList[this.markerCurrentIndex]);
    // console.log('Current Item on Init issssssssssssf:', this.currentItem);
    // this.markerList = this.markerList.sort((a : any, b : any) => a.Proximity - b.Proximity);

    //removed viewing functionality

    // if(this.markerList[this.markerCurrentIndex].UserName) this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)

    this.subscribeSwipeEvent();
    this.loadCurrentItem();
    this.platform.ready().then(() => {
      this.deviceHeight = this.getDeviceHeight();
      const countedheight = (264 / this.deviceHeight).toFixed(2);
      console.log("this is the ",countedheight)
    });

    // this.updateGreetingIcon();
  }

  getDeviceHeight(): number {
    
    return window.innerHeight;
  }

  updateGreetingIcon() {
    var iconName = 'send-greeting-blue';
    if (this.markerList[this.markerCurrentIndex]?.Greeting === 4) {
      return iconName = 'receive-greeting-green';
    } else if (this.markerList[this.markerCurrentIndex]?.Greeting === 5) {
      return iconName = 'sent-greeting-orange';
    }
    return iconName;
  }



  //   getConnectionIcon() {
  //   var iconName = 'free-user-request-white-icon';
  //   if (this.userCanvasProfile.IsConnected)
  //     return iconName = 'free-user-connected-white-icon';
  //   else if (this.userCanvasProfile.IsRequestTo === true)
  //     iconName = 'free-user-recieved-white-icon';
  //   else if (this.userCanvasProfile.IsRequestExits)
  //     iconName = 'free-user-pending-white-icon';

  //   return iconName
  // }

  // send-connection-sonar-icon

  getFallbackImage(entity: string): string {
    switch (entity) {
      case 'E':
        return 'assets/custom-ion-icons/Event_thumbnail.svg';
      case 'SA':
        return 'assets/custom-ion-icons/Serviceavailable_thumbnail.svg';
      case 'SR':
        return 'assets/custom-ion-icons/servicerequired_thumbnail.svg';

      case 'SL':
        return 'assets/custom-ion-icons/saleslisting_thumbnail.svg';
      // Add more cases as needed for other entities
      default:
        return 'assets/custom-ion-icons/default_thumbnail.svg';
    }
  }

  onError(event: Event, entity: string): void {
    const element = event.target as HTMLImageElement;
    element.src = this.getFallbackImage(entity);
  }





  updateConnectionIcon() {
    var iconName2 = 'send-connection-sonar-icon';
    if (this.markerList[this.markerCurrentIndex]?.IsConnected === 3) {
      return iconName2 = 'connection-req-sent-icon';
    } else if (this.markerList[this.markerCurrentIndex]?.IsConnected === 2) {
      return iconName2 = 'connection-req-recieved-icon';
    } else if(this.markerList[this.markerCurrentIndex]?.IsConnected === 4){
      this.markerList[this.markerCurrentIndex].Greeting = 3;
      this.updateGreetingIcon();
      // return iconName2 = 'connected-sonar-icon';
    }
    return iconName2;

  }

  async sendConnection(user: any) {
    if (user.IsConnected === 0) {
      console.log("Sending connection request...");
      const res = await this.mapService.sendConnectionTOuser(user.Id);
      if (res && res.ResponseData && res.ResponseData.Success) {
        this.commonService.presentToast('Connection Sent To ' + user.UserName);
        user.IsConnected = 3;
        this.markerList[this.markerCurrentIndex].IsConnected = 3; // Update the marker list item
        this.updateConnectionIcon(); // Update the icon after successful connection
      }
    } else if (user.IsConnected === 3) {
      console.log("Cancelling connection request...");
      const res = await this.mapService.cancelConnectionToUser(user.Id);
      if (res && res.ResponseData && res.ResponseData.Success) {
        user.IsConnected = 0;
        this.markerList[this.markerCurrentIndex].IsConnected = 0; // Update the marker list item
        this.commonService.presentToast("Connection Cancelled");
        this.updateConnectionIcon(); // Update the icon after cancelling connection
      } else if (res && !res.ResponseData.Success) {
        this.commonService.presentToast("Cannot cancel connection to " + user.UserName);
      } else {
        this.commonService.presentToast("Something went wrong");
      }
    } else if (user.IsConnected === 2) {
      await this.acceptRejectModalConnection(user);
    }
  }

  async acceptRejectModalConnection(user: any) {
    const alert = await this.alertController.create({
      header: `You Have A Connection Request!`,
      cssClass: 'add-user-alert',
      buttons: [
        {
          text: 'Decline',
          role: 'reject',
          cssClass: 'add-user-alert-send-button',
          handler: (data: any) => {
            this.requestAction(false, user);
          }
        },
        {
          text: 'Accept',
          role: 'confirm',
          cssClass: 'add-user-alert-send-without-button',
          handler: (data: any) => {
            this.requestAction(true, user);
            alert.dismiss();
          }
        },
        {
          text: 'X',
          role: 'close',
          cssClass: 'add-user-alert-close-button',
          handler: (data: any) => {
            alert.dismiss();
          }
        },
      ],
    });

    await alert.present();
  }

  async requestAction(reqAcceptOrDecline: boolean, user: any) {


    var res = await this.connectionsService.actionConnectionRequest(reqAcceptOrDecline, user?.Id);
    if (res) {
      if (!reqAcceptOrDecline) {
        user.IsConnected = 0;
        this.markerList[this.markerCurrentIndex].IsConnected = 0;
        this.updateConnectionIcon();
      } else {
        user.IsConnected = 4;
        this.updateConnectionIcon();
      }

    }
  }

  async sendGreeting(user: any) {
    if (user.Greeting === 1) {
      const res = await this.mapService.sendGreetingToUser(user.Id);
      if (res && res.Success) {
        this.commonService.presentToast('Greeting sent to ' + user.UserName);
        user.Greeting = 5;
        this.markerList[this.markerCurrentIndex].Greeting = 5; // Ensure the correct item is updated
        this.updateGreetingIcon();
      }
    } else if (user.Greeting === 5) {
      const res = await this.mapService.cancelGreetingToUser(user.Id);
      if (res && res.Success) {
        user.Greeting = 1;
        this.commonService.presentToast("Greeting Cancelled");
        this.updateGreetingIcon();
      } else if (res && !res.Success) {
        this.commonService.presentToast("Cannot send greeting to " + user.UserName + " until One Hour");
      } else {
        this.commonService.presentToast("Something went wrong");
      }
    } else if (user.Greeting === 4) {
      this.showGreetingActions(user);
    }
  }

  getButtonClass() {
    return {
      'green-background': this.greetingIcon === 'greeting',
      'orange-background': this.greetingIcon === 'orange-carousel',
      'greenbg': this.greetingIcon === 'Greeting-icon-white-green-carousel'
    };
  }

  getButtonText() {
    if (this.greetingIcon === 'greeting') {
      return 'Send Greeting';
    } else if (this.greetingIcon === 'orange-greeting') {
      return 'Greeting Sent';
    } else {
      return 'Greeting Received';
    }
  }


  public showGreetingActions(user: any): void {
    this.greetingAcceptRejectModal?.present().then(() => { });
  }

  public closeShowGreetingActions(): void {
    this.greetingAcceptRejectModal?.dismiss().then(() => {
      console.log("closed modal");
    });
  }

  openUser(user: FiniteeUserOnMap) {
    this.closeDetails();
    console.log("openUser: ", user);

    const navigationExtras: NavigationExtras = {
      state: {
        data: user
      }
    };
    this.router.navigateByUrl('free-user-canvas', navigationExtras);
  }

  open(item: any) {
    switch (item.entity) {
      case 'E':
        this.router.navigateByUrl(`/events/event-view/${item.Id}`)
        this.closeDetails();
        break;

      case 'SL':
        this.router.navigateByUrl(`/sales-listing/sales-item-view/${item.Id}`)
        this.closeDetails();
        break;

      case 'SA':
        this.router.navigateByUrl(`service-available/service-available-view/${item.Id}`);
        this.closeDetails();
        break;

      case 'SR':
        this.router.navigateByUrl(`service-required/service-required-view/${item.Id}`);
        this.closeDetails();
        break;
    }
  }

  async startChat(user: any) {
    console.log("data chat", user);
    var selectedUser: any = {
      UserId: user.Id,
      DisplayName: user.UserName,
      ProfilePhoto: user.ProfileImage == undefined ? null : user.ProfileImage,
      groupId: ""

    }
    this.closeDetails();
    const res = await this.chatService.openChat(selectedUser, true);

    console.log(res);

    // this.chatTray(res);
  }

  public async chatTray(user: any): Promise<void> {
    const modal = await this.modalController.create({
      component: ChatDetailPage,
      componentProps: {
        otherValue: user
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) { }
    });
    return await modal.present();
  }

  async acceptGreeting(user: any) {
    this.closeShowGreetingActions();
    const res = await this.mapService.actionGreetingToUser(user.Id, true);
    if (res && res.Success === true) {
      user.Greeting = 1;
      this.updateGreetingIcon();
      this.startChat(user);
    } else {
      console.log("error while accepting greeting");
    }
  }

  async rejectGreeting(user: any) {
    this.closeShowGreetingActions();
    const res = await this.mapService.actionGreetingToUser(user.Id, false);
    if (res && res.Success === true) {
      user.Greeting = 1;
      this.updateGreetingIcon();
    } else {
      console.log("error while rejecting greeting");
    }
  }

  public closeDetails(): void {
    this.onCloseDetails.emit();
  }

  subscribeSwipeEvent() {
    this.swipeSubsciption = this.swipeService.currentMessage.subscribe(message => {
      if (message === 'next') {
        console.log("show next");
        this.loadNextItem(false);
      }
      if (message === 'previous') {
        console.log("show previous");
        this.loadNextItem(true);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this.swipeSubsciption) {
      this.swipeSubsciption.unsubscribe();
    }
  }

  loadCurrentItem() {
    if (this.markerList && this.markerList.length > 0) {
      if (this.markerCurrentIndex > -1 && this.markerCurrentIndex < this.markerList.length) {
        this.currentItem = this.markerList[this.markerCurrentIndex];
        console.log("current", this.currentItem);
        const inflows = this.currentItem.InflowsCount; // Get inflows from currentItem
        this.formattedInflows = this.formatNumber(inflows); // Format the inflows for display
        console.log("Formatted Inflows: ", this.formattedInflows);
      } else {
        this.currentItem = this.markerList[0];
      }
    }
    this.setNextPreviousVisibility();
    this.updateGreetingIcon();
  }
  
  formatNumber(num: number): string {
    if (num >= 1000 && num < 1000000) {
      return Math.floor(num / 1000) + 'k';
    } else if (num >= 1000000) {
      const millionValue = num / 1000000;
      if (Math.floor(millionValue) === millionValue) {
        return millionValue.toFixed(0) + 'M';
      } else {
        return millionValue.toFixed(1).replace(/\.0$/, '') + 'M';
      }
    } else {
      return num.toString();
    }
  }
  

  setNextPreviousVisibility() {
    if (this.markerList && this.markerList.length > 1) {
      this.showPrevious = this.markerCurrentIndex > 0;
      this.showNext = this.markerCurrentIndex < this.markerList.length - 1;
      if(this.showNext) this.updateNextIcon();
      if(this.showPrevious) this.updatePrevIcon();
    } else {
      this.showNext = false;
      this.showPrevious = false;
    }
  }

  updateNextIcon(){
    const index = this.markerCurrentIndex + 1;
    let curr_lat = 0;
    let curr_lng = 0;
    let next_lat = 0;
    let next_lng = 0;
    
    if(this.markerList[this.markerCurrentIndex].LatLong){
      curr_lat = this.markerList[this.markerCurrentIndex]?.LatLong.Latitude;
      curr_lng = this.markerList[this.markerCurrentIndex]?.LatLong.Longitude;
    }else{
      curr_lat = this.markerList[this.markerCurrentIndex]?.Latitude;
      curr_lng = this.markerList[this.markerCurrentIndex]?.Latitude;
    }
    if(this.markerList[index].LatLong){
      next_lat = this.markerList[index]?.LatLong.Latitude;
      next_lng = this.markerList[index]?.LatLong.Longitude;
    }else{
      next_lat = this.markerList[index]?.Latitude;
      next_lng = this.markerList[index]?.Latitude;
    }
  
    if(curr_lat === next_lat && curr_lng === next_lng) this.nextIconName = 'chevron-forward-circle-outline';
    else this.nextIconName = 'flame';
  }

  updatePrevIcon(){
    const index = this.markerCurrentIndex - 1;
    let curr_lat = 0;
    let curr_lng = 0;
    let next_lat = 0;
    let next_lng = 0;
    
    if(this.markerList[this.markerCurrentIndex].LatLong){
      curr_lat = this.markerList[this.markerCurrentIndex]?.LatLong.Latitude;
      curr_lng = this.markerList[this.markerCurrentIndex]?.LatLong.Longitude;
    }else{
      curr_lat = this.markerList[this.markerCurrentIndex]?.Latitude;
      curr_lng = this.markerList[this.markerCurrentIndex]?.Latitude;
    }
    if(this.markerList[index].LatLong){
      next_lat = this.markerList[index]?.LatLong.Latitude;
      next_lng = this.markerList[index]?.LatLong.Longitude;
    }else{
      next_lat = this.markerList[index]?.Latitude;
      next_lng = this.markerList[index]?.Latitude;
    }

    if(curr_lat === next_lat && curr_lng === next_lng) this.prevIconName = 'chevron-back-circle-outline';
    else this.prevIconName = 'flame';
  }



  async loadNextItem(previous: boolean) {
    console.log("loadNextItem: previous: " + previous + " CurrentIndex: " + this.markerCurrentIndex);
    if (this.markerList && this.markerList.length > 0) {
      if (previous) {
        if (this.markerCurrentIndex > 0) {
          this.markerCurrentIndex--;
          // this.panMapToCurrLoc.emit(this.currentItem);
          this.onShowPrevious.emit(this.markerList[this.markerCurrentIndex ]);
        }
      } else {
        if (this.markerCurrentIndex < this.markerList.length - 1) {
          this.markerCurrentIndex++;
          // this.panMapToCurrLoc.emit(this.currentItem);
          this.onShowNext.emit(this.markerList[this.markerCurrentIndex]);
        }
      }
      this.currentItem = this.markerList[this.markerCurrentIndex];
      console.log("loadNextItem: previous: " + previous + " NewIndex: " + this.markerCurrentIndex);
      if (this.markerList[this.markerCurrentIndex].UserName) {
        console.log("current", this.markerList[this.markerCurrentIndex]);
        if (this.markerList[this.markerCurrentIndex].Greeting === 1) {
          const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if (res == true) this.markerList[this.markerCurrentIndex].Greeting = 4;
        } else if (this.markerList[this.markerCurrentIndex].Greeting === 4) {
          const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if (res == false) this.markerList[this.markerCurrentIndex].Greeting = 1;
        }
      }
      this.setNextPreviousVisibility();
      this.updateGreetingIcon();
    }
  }
  // getRandomInflowsCount(inflow: any) {
  //   console.log("here is all inflows from count",inflow)
    
  // }

  getRandomInflowsCount(): string {
    const inflows2 = Math.floor(Math.random() * (9000000 - 1000 + 1)) + 1000;
    console.log(inflows2)

    // Format the number
    const formattedInflows = this.formatNumber(inflows2);

    console.log(formattedInflows);
    return formattedInflows;
  }

  // formatNumber(num: number): string {
  //   if (num >= 1000 && num < 1000000) {
  //     return Math.floor(num / 1000) + 'k';
  //   } else if (num >= 1000000) {
  //     const millionValue = num / 1000000;
  //     if (Math.floor(millionValue) === millionValue) {
  //       return millionValue.toFixed(0) + 'M';
  //     } else {
  //       return millionValue.toFixed(1).replace(/\.0$/, '') + 'M';
  //     }
  //   } else {
  //     return num.toString();
  //   }
  // }
  
  
  

  // Other component logic...



  currentItem2: any = {
   
    InflowsCount: this.getRandomInflowsCount()
  };


  tempClick() { }
}
function ifelse(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function elif(arg0: boolean) {
  throw new Error('Function not implemented.');
}

