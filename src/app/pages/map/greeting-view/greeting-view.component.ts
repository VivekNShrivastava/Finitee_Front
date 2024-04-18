import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { kMaxLength } from 'buffer';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
// import { SignalRService } from 'src/app/core/services/signal-r.service';
import { Greeting } from 'src/app/pages/map/models/UserOnMap';
import { MapService } from 'src/app/pages/map/services/map.service';
import { environment } from 'src/environments/environment';
import { ChatsService } from 'src/app/core/services/chat/chats.service';

@Component({
  selector: 'greeting-view',
  templateUrl: './greeting-view.component.html',
  styleUrls: ['./greeting-view.component.scss'],
})
export class GreetingViewComponent implements OnInit, OnDestroy {
  @Input() fromUserId?: number;
  @Input() fromUserName?: string | null;
  @Input() fromUserProfile?: string | null;
  @Input() isUserConnected?: boolean;
  @Input() userInfo?: any;
  private greetingEventObservable?: Subscription;
  public isShowBlinkIcon?: boolean = false;
  public isShowChatIcon: boolean = false;
  public attachmentURL = environment.attachementUrl;
  public openChat?: Subscription;

  @ViewChild(IonModal) greetingAcceptRejectModal?: IonModal;

  constructor(
    // private _signalService: SignalRService,
    private _authService: AuthService,
    private _commonService: CommonService,
    private _mapService: MapService,
    private alertController:AlertController,
    private chatService: ChatsService
  ) {
    // this.greetingEventObservable = _signalService._onGreetingEventOb.subscribe(this.onGreetingEvent.bind(this));
    
  }


  ngOnDestroy(): void {
    this.greetingEventObservable?.unsubscribe();
    this.openChat?.unsubscribe();
  }

  ngOnInit() {
    this.onGreetingEvent();
  }

  public showGreetingActions(): void {
    this.greetingAcceptRejectModal?.present().then(() => {

    });
  }

  public sendGreeting(): void {
    console.log("sent greeting")
    // let param = <Greeting>{
    //   ToId: this.fromUserId,
    //   FromId: this._authService.getUserId(),
    //   Status: "S"
    // }
    // this._mapService.sendGreeting(param)
    //   .subscribe(response => {
    //     this._commonService.greetings.push(response);
    //     this.onGreetingEvent();
    //   });
  }

  startChat(user: any) {
    console.log("data chat", user)
    var selctedUser: any = {
      UserId: user.Id,
      DisplayName: user.UserName,
      ProfilePhoto: user.ProfileImage == undefined ? null : user.ProfileImage,
      groupId: ""
    }
    this.chatService.openChat(selctedUser);
  }

  public acceptGreeting(user: any): void {
    console.log("accepted", user?.CreatedBy);
    this._mapService.actionGreetingToUser(user.CreatedBy.Id, true);
    this.greetingAcceptRejectModal?.dismiss();
    this.startChat(user?.CreatedBy);
    // let param = <Greeting>{
    //   ToId: this._authService.getUserId(),
    //   FromId: this.fromUserId,
    //   Status: "A"
    // }
    // this._mapService.acceptGreeting(param)
    //   .subscribe(response => {
    //     let selfUserId = this._authService.getUserId();
    //     let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) ||
    //       (x.FromId == selfUserId && x.ToId == this.fromUserId));
    //     if (greetingStatus) {
    //       greetingStatus.Status = "A";
    //     }
    //     this.onGreetingEvent();
    //     //this._commonService._signalRService._onGreetingEventOb.emit();
    //     this.greetingAcceptRejectModal?.dismiss();
    //   });
  }

  public rejectGreeting(user: any): void {
    console.log("rejected");
    this.greetingAcceptRejectModal?.dismiss();
    this._mapService.actionGreetingToUser(user.CreatedBy.Id, false);
    // let param = <Greeting>{
    //   ToId: this._authService.getUserId(),
    //   FromId: this.fromUserId,
    //   Status: "R"
    // }
    // this._mapService.rejectGreeting(param)
    //   .subscribe(response => {
    //     let selfUserId = this._authService.getUserId();
    //     let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) ||
    //       (x.FromId == selfUserId && x.ToId == this.fromUserId));
    //     if (greetingStatus) {
    //       greetingStatus.Status = "R";
    //     }
    //     this.onGreetingEvent();
    //     //this._commonService._signalRService._onGreetingEventOb.emit();
    //     this.greetingAcceptRejectModal?.dismiss();
    //   });
  }

  public onGreetingEvent(): void {
    let selfUserId = this._authService.getUserId();
    let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) || (x.FromId == selfUserId && x.ToId == this.fromUserId));

    if (greetingStatus == null) {
      this.isShowBlinkIcon = false;
      return;
    }

    if (greetingStatus && greetingStatus.Status == "S") {
      this.isShowBlinkIcon = true;
    }

    if (greetingStatus && greetingStatus.Status == "A") {
      this.isShowChatIcon = true;
      this.isShowBlinkIcon = undefined;
    }
  }

  public chatWithUser(): void {

  }
}
