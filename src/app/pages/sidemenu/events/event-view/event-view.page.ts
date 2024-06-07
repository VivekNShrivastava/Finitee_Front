import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { EventItem } from 'src/app/core/models/event/event';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventsService } from 'src/app/core/services/events.service';
import { NavController } from '@ionic/angular';
import { Observable, forkJoin } from 'rxjs';
import { CommonService } from '../../../../core/services/common.service';

import moment from 'moment';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.page.html',
  styleUrls: ['./event-view.page.scss'],
})
export class EventViewPage extends BasePage implements OnInit {
  requestList: any = []
  inviteAcceptedList: any = [];
  eventId!: string;
  event: EventItem = new EventItem;
  createdById: any;
  logInfoDetails: any;
  requiredValue: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventsService,
    private authService: AuthService,
    private navCtrl: NavController,
    public commonService: CommonService
  ) {
    super(authService);
    this.route.params.subscribe((params: any) => {
      console.log("params22", params)
      this.eventId = params.id;
    });
    this.subscribeEventListSubject()
  }

  subscribeEventListSubject() {
    this.eventService.inviteAcceptedList.subscribe({
      next: (result: any) => {
        this.inviteAcceptedList.push(result);
      }
    });

    this.eventService.requestList.subscribe({
      next: (result: any) => {
        this.requestList.splice(result, 1)
      }
    });
  }

  // ionViewWillEnter() {
  //   this.getRequestAndInvite();
  // }


  ngOnInit() {
    this.commonService.showLoader();
    this.logInfoDetails = this.logInfo;
    this.getEventByEventId();

  }

  async getRequestAndInvite() {
    if (this.event.RequireInvite == true) {
      let inviteList = this.eventService.getEventInviteRequestList(this.eventId)
      let acceptedList = this.eventService.getInviteAcceptedList(this.eventId)

      forkJoin([inviteList, acceptedList]).subscribe(response => {
        this.requestList = response[0];
        this.inviteAcceptedList = response[1];
        this.commonService.hideLoader();
      })
    } else {
      this.inviteAcceptedList = await this.eventService.getInviteAcceptedList(this.eventId)
      this.commonService.hideLoader();
    }
  }


  async getEventByEventId() {
    var result = await this.eventService.getEventByEventId(this.eventId);
    if (result)
      this.event = result.eventData;
    this.requiredValue = result;
    this.createdById = this.event.CreatedBy.Id
    this.getRequestAndInvite();
  }


  openRequestRsvpPage(eventId: any, val: any) {
    this.eventService.rsvpValue = val;
    this.eventService.RSVPorInvite = this.event.RequireInvite;
    this.navEx!.state!['data'] = val;
    this.router.navigateByUrl(`/events/request-rsvp/${eventId}`, this.navEx);
  }

  async openRequestToAttend() {
    let val = await this.eventService.sendInviationRequest(this.eventId)
    if (val) {
      this.requiredValue.IsRequestSent = val;
    }
    //this.navCtrl.pop();
  }

  async cancelRSVP(userId: any, action: any) {
    var res = await this.eventService.sendAcceptDeclineRequest(this.eventId, userId, action);
    if (res) {
      this.requiredValue.IsRequestSent = false;
      this.requiredValue.IsRequestAccepted = false;
    }
    //this.navCtrl.pop();
  }
}
