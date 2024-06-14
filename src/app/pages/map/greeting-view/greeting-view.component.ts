import { Component, Input, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { MapService } from 'src/app/pages/map/services/map.service';
import { environment } from 'src/environments/environment';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { ModalController } from '@ionic/angular';
import { ChatDetailPage } from '../../chat/chat-detail/chat-detail.page';

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

  public isAcceptRejectModalClosedSubject : BehaviorSubject<any> = new BehaviorSubject<any>('i-closed');
  public isAcceptRejectModalClosed = this.isAcceptRejectModalClosedSubject.asObservable();

  @ViewChild(IonModal) greetingAcceptRejectModal?: IonModal;
  @Output() close: EventEmitter<any> = new EventEmitter();
  // @ViewChild('markerDetailModal') markerDetailModal?: IonModal;

  constructor(
    // private _signalService: SignalRService,
    private _authService: AuthService,
    private _commonService: CommonService,
    private _mapService: MapService,
    private alertController:AlertController,
    private chatService: ChatsService,
    public modalController: ModalController
  ) {
    // this.greetingEventObservable = _signalService._onGreetingEventOb.subscribe(this.onGreetingEvent.bind(this));
    // this.getGreetingIcon();
  }


  ngOnDestroy(): void {
    this.greetingEventObservable?.unsubscribe();
    this.openChat?.unsubscribe();
  }

  ngOnInit() {
    console.log("userInfo", this.userInfo)
    this.onGreetingEvent();
  }

  async sendGreeting(user: any){
    if(user.Greeting === 1){
      const res = await this._mapService.sendGreetingToUser(user.Id)
      if(res && res.Success){
        this._commonService.presentToast("Greeting sent to " + user.UserName)
        user.Greeting = 5;
        this.getGreetingIcon();
      }else{
        this._commonService.presentToast("Something went wrong")
      }
    }else if(user.Greeting === 5){
      const res = await this._mapService.cancelGreetingToUser(user.Id)
      if(res && res.Success){
        user.Greeting = 1;
        this._commonService.presentToast("Greeting Cancelled")
        this.getGreetingIcon();
      }else{
        this._commonService.presentToast("Something went wrong")
      }
    }else if(user.Greeting === 4){
      this.showGreetingActions();
    }   
  }

  closeModal(){
    console.log('gretting modal closed')
    this.close.emit('accepted');
    this.modalController.dismiss('gretting modal closed dismissed');
  }

  public showGreetingActions(): void {
    if(this.userInfo && (this.userInfo.Status != null || this.userInfo.Greeting)) {
      console.log(this.userInfo)
      if(this.userInfo.Greeting && (this.userInfo.Greeting == 1 || this.userInfo.Greeting == 5)){
        this.sendGreeting(this.userInfo)
      }
      // this.sendGreeting(this.userInfo.CreatedBy);
    } 
    else{
      this.greetingAcceptRejectModal?.present().then(() => {

      });
    } 
  }

  getGreetingIcon(){
    var iconName = "greeting";
    if(this.userInfo){
      // if(this.userInfo?.Greeting == 1) iconName = "greeting";
      // else if(this.userInfo?.Greeting == 4) iconName = "greeting-blink";
      // else if(this.userInfo?.Greeting == 5) iconName = "greeting-sent";
      if(this.userInfo && (this.userInfo.Status != null || this.userInfo.Greeting )){
        if(this.userInfo.Greeting){
          switch(this.userInfo.Greeting){
            case 1: iconName = "greeting";
            break;
            case 4: iconName = "greeting-blink";
            break;
            case 5: iconName = "greeting-sent";
            break;
            default : iconName = "greeting";
          }
        }
      }
      else iconName = "greeting-blink";

     
     
        

    }
    
    return iconName;
  }

  // public sendGreeting(): void {
  //   console.log("sent greeting")
  //   // let param = <Greeting>{
  //   //   ToId: this.fromUserId,
  //   //   FromId: this._authService.getUserId(),
  //   //   Status: "S"
  //   // }
  //   // this._mapService.sendGreeting(param)
  //   //   .subscribe(response => {
  //   //     this._commonService.greetings.push(response);
  //   //     this.onGreetingEvent();
  //   //   });
  // }

  async startChat(user: any) {
    console.log("data chat", user)
    var selctedUser: any = {
      UserId: user.Id,
      DisplayName: user.UserName,
      ProfilePhoto: user.ProfileImage == undefined ? null : user.ProfileImage,
      groupId: ""
    }
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

  public async acceptGreeting(user: any) {
    console.log("accepted", user);
    const id = user?.CreatedBy?.Id || user?.UserId;
    const res = await this._mapService.actionGreetingToUser(id, true);
    this.closeModal();
    // this.greetingAcceptRejectModal?.dismiss('accepted');
    // this.isAcceptRejectModalClosedSubject.next("isClosed");
    // this.chatTray(user);
    if(res && res.Success === true){
      user.Greeting = 1;
      this.getGreetingIcon();
      this.startChat(user?.CreatedBy);
    }else{
      console.log("error while accepting greeting");
    }


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

  public async rejectGreeting(user: any) {
    console.log("rejected");
    const id = user?.CreatedBy?.Id || user?.UserId;
    this.greetingAcceptRejectModal?.dismiss(
      "rejected"
    );
    const res = await this._mapService.actionGreetingToUser(id, false);
    if(res && res.Success === true){
      user.Greeting = 1;
      this.getGreetingIcon();
    }else{
      console.log("error while rejecting greeting");
    }
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
