import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';
import { EventItem } from 'src/app/core/models/event/event';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user/UserProfile';
import { NavController } from '@ionic/angular';
import { Observable, forkJoin } from 'rxjs';
import { CommonService } from '../../../../core/services/common.service';

@Component({
  selector: 'app-request-rsvp',
  templateUrl: './request-rsvp.page.html',
  styleUrls: ['./request-rsvp.page.scss'],
})
export class RequestRsvpPage extends BasePage implements OnInit {
  requestList: any = []
  inviteAcceptedList: any = [];
  eventId!: string;
  textValue: any;
  navParams: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public eventService: EventsService,
    private authService: AuthService,
    private navCtrl: NavController,
    private CommonService : CommonService) {
    super(authService);
    this.route.params.subscribe((params: any) => {
      this.eventId = params.id;
    });

    if (this.router!.getCurrentNavigation()!.extras.state) {
      this.navParams = this.router!.getCurrentNavigation()!.extras.state!['data'];
    }
  }

  async ngOnInit() {
    this.CommonService.showLoader();
    if (this.navParams == 'rsvp') {
      this.inviteAcceptedList = await this.eventService.getInviteAcceptedList(this.eventId)
      this.CommonService.hideLoader();
    } else if(this.navParams == 'invite'){
      this.requestList = await this.eventService.getEventInviteRequestList(this.eventId)
      this.CommonService.hideLoader();
    }
  }

  async acceptDecline(user: any, action: any, index: number) {
    var res = await this.eventService.sendAcceptDeclineRequest(this.eventId, user.Id, action);
    if (res){
      if(action == "ACCEPT"){
        this.eventService.inviteAcceptedList.next(this.requestList[index]);
        this.requestList.splice(index, 1);
        this.eventService.requestList.next(index);
      }else{
        this.requestList.splice(index, 1);
        this.eventService.requestList.next(index);
      }
    }
  }

}
