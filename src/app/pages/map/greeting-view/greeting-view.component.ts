import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { Greeting } from 'src/app/pages/map/models/UserOnMap';
import { MapService } from 'src/app/pages/map/services/map.service';
import { environment } from 'src/environments/environment';

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
  private greetingEventObservable?: Subscription;
  public isShowBlinkIcon?: boolean = false;
  public isShowChatIcon: boolean = false;
  public attachmentURL = environment.attachementUrl;

  @ViewChild(IonModal) greetingAcceptRejectModal?: IonModal;

  constructor(
    private _signalService: SignalRService,
    private _authService: AuthService,
    private _commonService: CommonService,
    private _mapService: MapService,
    private alertController:AlertController
  ) {
    this.greetingEventObservable = _signalService._onGreetingEventOb.subscribe(this.onGreetingEvent.bind(this));
  }


  ngOnDestroy(): void {
    this.greetingEventObservable?.unsubscribe();
  }

  ngOnInit() {
    this.onGreetingEvent();
  }

  public showGreetingActions(): void {
    this.greetingAcceptRejectModal?.present().then(() => {

    });
  }

  public sendGreeting(): void {
    let param = <Greeting>{
      ToId: this.fromUserId,
      FromId: this._authService.getUserId(),
      Status: "S"
    }
    this._mapService.sendGreeting(param)
      .subscribe(response => {
        this._commonService.greetings.push(response);
        this.onGreetingEvent();
      });
  }

  public acceptGreeting(): void {
    let param = <Greeting>{
      ToId: this._authService.getUserId(),
      FromId: this.fromUserId,
      Status: "A"
    }
    this._mapService.acceptGreeting(param)
      .subscribe(response => {
        let selfUserId = this._authService.getUserId();
        let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) ||
          (x.FromId == selfUserId && x.ToId == this.fromUserId));
        if (greetingStatus) {
          greetingStatus.Status = "A";
        }
        this.onGreetingEvent();
        //this._commonService._signalRService._onGreetingEventOb.emit();
        this.greetingAcceptRejectModal?.dismiss();
      });
  }

  public rejectGreeting(): void {
    let param = <Greeting>{
      ToId: this._authService.getUserId(),
      FromId: this.fromUserId,
      Status: "R"
    }
    this._mapService.rejectGreeting(param)
      .subscribe(response => {
        let selfUserId = this._authService.getUserId();
        let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) ||
          (x.FromId == selfUserId && x.ToId == this.fromUserId));
        if (greetingStatus) {
          greetingStatus.Status = "R";
        }
        this.onGreetingEvent();
        //this._commonService._signalRService._onGreetingEventOb.emit();
        this.greetingAcceptRejectModal?.dismiss();
      });
  }

  public onGreetingEvent(): void {
    let selfUserId = this._authService.getUserId();
    let greetingStatus = this._commonService.greetings.find(x => (x.FromId == this.fromUserId && x.ToId == selfUserId) ||
      (x.FromId == selfUserId && x.ToId == this.fromUserId));

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
