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
    public authService: AuthService) { 
      this.user = this.authService.getUserInfo();
      console.log("marker-user", this.user);
    }

  ngOnInit() {
    
    console.log("markerCurrentIndex: ", this.markerCurrentIndex);
    console.log("markerList: ", this.markerList);
    const temp = this.user.UserName + "_" + this.user.UserId
    this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, temp)
    // this.addToViewList();
    this.subscribeSwipeEvent();
    this.loadCurrentItem();

    

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
      const temp = this.user.UserName + "_" + this.user.UserId
      await this.mapService.removeNameFromViewList(this.markerList[this.markerCurrentIndex+1].UserName, temp);
      await this.mapService.addToViewList(this.markerList[this.markerCurrentIndex].UserName, temp)
      this.setNextPreviousVisibility();
    }
  }

  tempClick() {

  }
}
