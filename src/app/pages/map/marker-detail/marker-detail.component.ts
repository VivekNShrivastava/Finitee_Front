import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { SwipeService } from 'src/app/core/services/swipe.service';

import 'firebase/firestore';
import { MapService } from '../services/map.service';
import { BasePage } from 'src/app/base.page';
import { App } from '@capacitor/app';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { FiniteeUserOnMap } from '../models/MapSearchResult';
import { NavigationExtras, Router } from '@angular/router';
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

  swipeSubsciption!: Subscription;
  constructor(public swipeService: SwipeService,
    public mapService: MapService,
    public authService: AuthService,
    public router: Router) { 
      this.user = this.authService.getUserInfo();
      console.log("marker-user", this.user);
    }

  ngOnInit() {
    
    console.log("markerCurrentIndex: ", this.markerCurrentIndex);
    console.log("markerList: ", this.markerList);
    // this.markerList = this.markerList.sort((a : any, b : any) => a.Proximity - b.Proximity);
    // console.log("markerList: ", this.markerList);
    if(this.markerList[this.markerCurrentIndex].UserName) this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)
    // this.addToViewList();
    this.subscribeSwipeEvent();
    this.loadCurrentItem();
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
      if(this.markerList[this.markerCurrentIndex].UserName) await this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, this.user)
      this.setNextPreviousVisibility();
    }
  }

  tempClick() {

  }
}
