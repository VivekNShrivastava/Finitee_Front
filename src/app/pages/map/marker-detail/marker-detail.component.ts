import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { IonModal } from '@ionic/angular';
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
  connectionIcon:string='send-connection-sonar-icon';
  

  @ViewChild(IonModal) greetingAcceptRejectModal?: IonModal;
 

  constructor(public swipeService: SwipeService,
    public mapService: MapService,
    public authService: AuthService,
    public router: Router,
    public commonService: CommonService,
    public modalController: ModalController,
    public chatService: ChatsService,
    public firestoreService: FirestoreService
  ) { 
    this.user = this.authService.getUserInfo();
    console.log("marker-user", this.user);

    //removed viewing functionality

    this.firestoreService.greetingList$.subscribe(updatedData => {
      this.greetingList = updatedData;
      if(this.greetingList.length > 0){
        const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
        if(this.greetingList[0] === id && this.markerList[this.markerCurrentIndex].Greeting === 1){
          this.markerList[this.markerCurrentIndex].Greeting = 4;
          this.updateGreetingIcon();
        }
      }else{
        if(this.markerList && this.markerList[this.markerCurrentIndex].Greeting === 4){
          this.markerList[this.markerCurrentIndex].Greeting = 1;
          this.updateGreetingIcon();
        }
      }
      
      // this.loadCurrentItem();
      console.log("map updated data", this.greetingList);
    });
  }

  ngOnInit() {
    console.log("markerCurrentIndex: ", this.markerCurrentIndex);
    console.log("markerList tl", this.markerList);
    console.log("markerList: ", this.markerList[this.markerCurrentIndex]);
    console.log('Current Item on Init issssssssssssf:', this.currentItem);
    // this.markerList = this.markerList.sort((a : any, b : any) => a.Proximity - b.Proximity);

    //removed viewing functionality

    // if(this.markerList[this.markerCurrentIndex].UserName) this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)

    this.subscribeSwipeEvent();
    this.loadCurrentItem();
    this.updateGreetingIcon();
  }


  

  updateGreetingIcon() {
    var iconName = 'greeting';
    if (this.markerList[this.markerCurrentIndex]?.Greeting === 4) {
      iconName = 'Greeting-icon-white-green-carousel';
    } else if (this.markerList[this.markerCurrentIndex]?.Greeting === 5) {
      iconName = 'orange-carousel';
    }
    this.greetingIcon = iconName;
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
  if (this.markerList[this.markerCurrentIndex]?.IsConnected === 2) {
    iconName2 = 'dots';
  } else if (this.markerList[this.markerCurrentIndex]?.IsConnected === 3) {
    iconName2 = 'dots';
  }
  this.connectionIcon = iconName2; // Update component property
  console.log('Updated icon:', this.connectionIcon); // Log the updated icon
}

async sendConnection(user: any) {
  if (user.IsConnected === 0) {
    console.log("Sending connection request...");
    const res = await this.mapService.sendConnectionTOuser(user.Id);
    if (res && res.ResponseData && res.ResponseData.Success) {
      this.commonService.presentToast('Connection Sent To ' + user.UserName);
      user.IsConnected = 2;
      this.markerList[this.markerCurrentIndex].IsConnected = 2; // Update the marker list item
      this.updateConnectionIcon(); // Update the icon after successful connection
    }
  } else if (user.IsConnected === 2) {
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
    } else if(user.Greeting === 5) {
      const res = await this.mapService.cancelGreetingToUser(user.Id);
      if(res && res.Success) {
        user.Greeting = 1;
        this.commonService.presentToast("Greeting Cancelled");
        this.updateGreetingIcon();
      } else if(res && !res.Success) {
        this.commonService.presentToast("Cannot send greeting to " + user.UserName + " until One Hour");
      } else {
        this.commonService.presentToast("Something went wrong");
      }
    } else if(user.Greeting === 4) {
      this.showGreetingActions(user);
    }
  }

  getButtonClass() {
    return {
      'green-background': this.greetingIcon === 'greeting',
      'orange-background': this.greetingIcon === 'orange-carousel',
      'greenbg':this.greetingIcon === 'Greeting-icon-white-green-carousel'
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
    this.greetingAcceptRejectModal?.present().then(() => {});
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
    switch(item.entity){
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
    };
    const res = await this.chatService.openChat(selectedUser, true);
    console.log(res);

    this.chatTray(res);
  }

  public async chatTray(user: any): Promise<void> {
    const modal = await this.modalController.create({
      component: ChatDetailPage,
      componentProps: {
        otherValue: user
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) {}
    });
    return await modal.present();
  }

  async acceptGreeting(user: any){
    this.closeShowGreetingActions();
    const res = await this.mapService.actionGreetingToUser(user.Id, true);
    if(res && res.Success === true){
      user.Greeting = 1;
      this.updateGreetingIcon();
      this.startChat(user);
    }else{
      console.log("error while accepting greeting");
    }
  }

  async rejectGreeting(user: any){
    this.closeShowGreetingActions();
    const res = await this.mapService.actionGreetingToUser(user.Id, false);
    if(res && res.Success === true){
      user.Greeting = 1;
      this.updateGreetingIcon();
    }else{
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
        console.log("Greeting Icon:", this.greetingIcon);
        console.log("Connection Icon",this.connectionIcon);
      } else {
        this.currentItem = this.markerList[0];
      }
    }
    this.setNextPreviousVisibility();
    this.updateGreetingIcon();
  }

  setNextPreviousVisibility() {
    if (this.markerList && this.markerList.length > 1) {
      this.showPrevious = this.markerCurrentIndex > 0;
      this.showNext = this.markerCurrentIndex < this.markerList.length - 1;
    } else {
      this.showNext = false;
      this.showPrevious = false;
    }
  }

  async loadNextItem(previous: boolean) {
    console.log("loadNextItem: previous: " + previous + " CurrentIndex: "+ this.markerCurrentIndex);
    if (this.markerList && this.markerList.length > 0) {
      if (previous) {
        if (this.markerCurrentIndex > 0) {
          this.markerCurrentIndex--;
          this.onShowPrevious.emit();
        }
      } else {
        if (this.markerCurrentIndex < this.markerList.length - 1) {
          this.markerCurrentIndex++;
          this.onShowNext.emit();
        }
      }
      this.currentItem = this.markerList[this.markerCurrentIndex];
      console.log("loadNextItem: previous: " + previous + " NewIndex: "+ this.markerCurrentIndex);
      if(this.markerList[this.markerCurrentIndex].UserName){
        console.log("current", this.markerList[this.markerCurrentIndex]);
        if(this.markerList[this.markerCurrentIndex].Greeting === 1){
          const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if(res == true) this.markerList[this.markerCurrentIndex].Greeting = 4;
        }else if(this.markerList[this.markerCurrentIndex].Greeting === 4){
          const id = 'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if(res == false) this.markerList[this.markerCurrentIndex].Greeting = 1;
        }
      }
      this.setNextPreviousVisibility();
      this.updateGreetingIcon();
    }
  }

  tempClick() {}
}
