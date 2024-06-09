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
            this.getGreetingIcon();
          }
        }else{
          if(this.markerList && this.markerList[this.markerCurrentIndex].Greeting === 4){
            this.markerList[this.markerCurrentIndex].Greeting = 1;
            this.getGreetingIcon();
          }
        }
        
        // this.loadCurrentItem();
        console.log("map updated data", this.greetingList);
      });
    }

  ngOnInit() {
    
    console.log("markerCurrentIndex: ", this.markerCurrentIndex);
    console.log("markerList: ", this.markerList[this.markerCurrentIndex]);
    // this.markerList = this.markerList.sort((a : any, b : any) => a.Proximity - b.Proximity);

    //removed viewing functionality

    // if(this.markerList[this.markerCurrentIndex].UserName) this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)

    this.subscribeSwipeEvent();
    this.loadCurrentItem();
  }

  public showGreetingActions(user: any): void {
    this.greetingAcceptRejectModal?.present().then(() => {

    });
  }

  public closeShowGreetingActions(): void{
    this.greetingAcceptRejectModal?.dismiss().then(() => {
      console.log("closed modal");
    })
  }

  openUser(user: FiniteeUserOnMap) {
    this.closeDetails();
    console.log("openUser: ", user);

    const navigationExtras1s: NavigationExtras = {
      state: {
        data: user
      }
    };
    // if (user.UserTypeId == AppConstants.USER_TYPE.BN_USER)
    //   this.router.navigateByUrl('business-user-canvas-other', navigationExtras1s);
    // else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
    this.router.navigateByUrl('free-user-canvas', navigationExtras1s);
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

  // public async addToViewList() {
  //   try {
  //     const docRef = await addDoc(collection(this.onView, 'viewingList'), {
  //       name: this.markerList[this.markerCurrentIndex],
  //     });

  //     console.log('Document written with ID: ', docRef.id);
  //   } catch (e) {
  //     console.error('Error adding document: ', e);
  //   }
  // }

  async startChat(user: any) {
    console.log("data chat", user)
    var selctedUser: any = {
      UserId: user.Id,
      DisplayName: user.UserName,
      ProfilePhoto: user.ProfileImage == undefined ? null : user.ProfileImage,
      groupId: ""
    }
    this.closeDetails();
    const res = await this.chatService.openChat(selctedUser, true);
    console.log(res);

    // this.chatTray(res);
  }

  public async chatTray(user: any): Promise<void> {
    const modal = await this.modalController.create({
      component: ChatDetailPage,
      componentProps: {
        otherValue : user
      }
    });
    modal.onDidDismiss().then(result => {
      if (result) {
      }
    });
    return await modal.present();
  }

  async acceptGreeting(user: any){
    this.closeShowGreetingActions();
    const res = await this.mapService.actionGreetingToUser(user.Id, true);
    if(res && res.Success === true){
      user.Greeting = 1;
      this.getGreetingIcon();
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
      this.getGreetingIcon();
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
    this.unsubscribeEvnets();
  }

  unsubscribeEvnets() {
    if (this.swipeSubsciption) {
      this.swipeSubsciption.unsubscribe();
    }
  }

  loadCurrentItem() {
    if (this.markerList && this.markerList.length > 0) {
      if (this.markerCurrentIndex > -1 && this.markerCurrentIndex < this.markerList.length) {
        this.currentItem = this.markerList[this, this.markerCurrentIndex];
        console.log("cureent", this.currentItem)
      }
      else {
        this.currentItem = this.markerList[0];// TODO Check for errors
      }
    }
    this.setNextPreviousVisibility();
  }

  /**Button Visibility is set for Previous and next button */
  setNextPreviousVisibility() {
    if (this.markerList && this.markerList.length > 1) {
      if (this.markerCurrentIndex <= 0) {
        this.showPrevious = false;
      }
      else {
        this.showPrevious = true;
      }

      if (this.markerCurrentIndex == this.markerList.length - 1) {
        this.showNext = false;
      }
      else {
        this.showNext = true;
      }
    }
    else {
      this.showNext = false;
      this.showPrevious = false;
    }
  }

  async loadNextItem(previous: boolean) {
    let currentIndex = this.markerCurrentIndex;
    console.log("loadNextItem: previous: " + previous + " CurrentIndex: "+ this.markerCurrentIndex);
    if (this.markerList && this.markerList.length > 0) {
      if (this.markerCurrentIndex > -1 && this.markerCurrentIndex < this.markerList.length) {
        if (previous) {
          if (this.markerCurrentIndex > 0) {
            this.markerCurrentIndex--;
            this.onShowPrevious.emit();
          }
        }
        else {
          if (this.markerCurrentIndex < this.markerList.length - 1) {
            this.markerCurrentIndex++;
            this.onShowNext.emit();
          }
        }
        this.currentItem = this.markerList[this, this.markerCurrentIndex];
      }
      else {
        this.currentItem = this.markerList[0];// TODO Check for errors
      }
      console.log("loadNextItem: previous: " + previous + " NewIndex: "+ this.markerCurrentIndex);
      // await this.mapService.removeNameFromViewList(this.markerList[this.markerCurrentIndex+1].UserName, temp);
      if(this.markerList[this.markerCurrentIndex].UserName){
        console.log("c", this.markerList[this.markerCurrentIndex])
        if(this.markerList[this.markerCurrentIndex].Greeting === 1){
          const id =  'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if(res == true) this.markerList[this.markerCurrentIndex].Greeting = 4;
        }else if(this.markerList[this.markerCurrentIndex].Greeting === 4){
          const id =  'u-' + this.markerList[this.markerCurrentIndex].Id;
          const res = this.greetingList.includes(id);
          if(res == false) this.markerList[this.markerCurrentIndex].Greeting = 1;
        }
        //removed viewing functionality

        // await this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)
      } 
      this.setNextPreviousVisibility();
    }
  }

  tempClick() {

  }

  getGreetingIcon(){
    var iconName = "greeting";
    if(this.markerList[this.markerCurrentIndex].Greeting === 4) iconName = "greeting-blink";
    else if(this.markerList[this.markerCurrentIndex].Greeting === 5) iconName = "greeting-sent";
    return iconName;
  }

  async sendGreeting(user: any){
    if(user.Greeting === 1){
      const res = await this.mapService.sendGreetingToUser(user.Id)
      if(res && res.Success){
          this.commonService.presentToast("Greeting sent to " + user.UserName)
          user.Greeting = 5;
          this.getGreetingIcon();
        
      }
      else{
        console.log(res.Success)
        this.commonService.presentToast("Something went wrong")
      }
    }else if(user.Greeting === 5){
      const res = await this.mapService.cancelGreetingToUser(user.Id)
      if(res && res.Success){
        user.Greeting = 1;
        this.commonService.presentToast("Greeting Cancelled")
        this.getGreetingIcon();
      }else if(res && !res.Success) this.commonService.presentToast("Cannot sent greeting " + user.UserName + " until One Hour") 
      else{
        this.commonService.presentToast("Something went wrong")
      }
    }else if(user.Greeting === 4){
      this.showGreetingActions(user);
    }   
  }
}
