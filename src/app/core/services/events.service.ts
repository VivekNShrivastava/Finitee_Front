import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

import * as config from 'src/app/core/models/config/ApiMethods';
import { CommonService } from './common.service';
import { EventItem } from '../models/event/event';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventList: Array<EventItem> = [];
  resEventID: any;
  RSVPorInvite: boolean = false;
  rsvpValue : any;
  eventListData: Subject<any> = new Subject();
  
  inviteAcceptedList: Subject<any> = new Subject();
  requestList: Subject<any> = new Subject();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  //create event
  createEvent(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.CREATE_EVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.resEventID = response.ResponseData;
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.EVENT_CREATED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }
 
  //update event
  updateEvent(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.UPD_EVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.EVENT_UPDATED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //update event
  deleteEvent(eventId: number) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(`${config.DEL_EVE}/${eventId}`).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.EVENT_DELETED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //get all events
  getAllEventByUser() {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.get<any>(config.GET_ALL_EVE_BY_USR).subscribe((response: any) => {
        //this.commonService.hideLoader();
        this.eventList = response.ResponseData;
        resolve(true);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //get event by eventid
  getEventByEventId(eventId: string) {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.GET_EVE_BY_ID + "/" + eventId).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //get Request list by eventid
  getEventInviteRequestList(eventId: string) {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.GET_REQ_LIST_BY_ID + "/" + eventId).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //send invitation by eventid
  sendInviationRequest(eventId: string) {
    return new Promise<any>((resolve) => {
      return this.http.put<any>(config.SEND_INVITE_REQ + "/" + eventId, {}).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(true);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  //accept or decline by eventid
  sendAcceptDeclineRequest(eventId: string, userId: string, action: any) {
    return new Promise<any>((resolve) => {
      this.commonService.showLoader();
      return this.http.put<any>(config.ACCEPT_DECLINE + "/" + eventId + "/" + userId + "/" + action, {}).subscribe((response: any) => {
        this.commonService.hideLoader();
        if (response.ResponseData.Error == "Accepted")
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_ACC);
        else if (response.ResponseData.Error == "declined")
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.REQ_DEC);
        resolve(true);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  //get invite accepted list by eventid
  getInviteAcceptedList(eventId: string) {
    return new Promise<any>((resolve, reject) => {
      return this.http.get<any>(config.GET_ACCEPTED_LIST + "/" + eventId).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

}
