import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { Greeting, UserOnMap } from 'src/app/pages/map/models/UserOnMap';
import * as config from "src/app/core/models/config/ApiMethods";
import { NotificationEvents } from 'src/app/core/models/notification/NotificationEvents';
import { NotificationPayload } from 'src/app/core/models/notification/NotificationPayload';
import { HubConnectionState } from '@microsoft/signalr';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  hubUrl: string;
  connection!: signalR.HubConnection;
  public onViewedOnSonarObs: EventEmitter<NotificationPayload<UserOnMap>> = new EventEmitter();
  public _onGreetingEventOb: EventEmitter<Greeting> = new EventEmitter();
  public onClearViewingObs: EventEmitter<any> = new EventEmitter();
  private user!:FiniteeUser;
  private userPingInterval = setInterval(this.userPing.bind(this),10000);
  constructor(
    private toastController: ToastController
  ) {
    this.hubUrl = config.SIGNAL_R;
  }

  public async initiateSignalrConnection(): Promise<void> {
    try {
      this.user = JSON.parse(<string>localStorage.getItem("userData"));
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect()
        .build();

      await this.connection.start();

      this.onConnectionStarted();
      this.bindEvents();
      this.connection.onclose(this.onConnectionClose.bind(this))
      this.connection.onreconnected(this.onReConnected.bind(this))

      console.log(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
      // window.alert(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
    }
    catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }
  }
  private onReConnected(): void {
    if(this.connection.state != HubConnectionState.Connected){
      this.connection.start();
    }
    this.onConnectionStarted();
  }

  private onConnectionStarted(): void {
    this.connection.invoke("OnConnect", this.connection.connectionId, this.user.UserId.toString())
      .then(() => {
        console.log("onUserConnect:Success");
      })
      .catch(err => {
        console.log("onUserConnect:Failed");
      });
  }

  private onConnectionClose(): void {
    this.connection.start();
  }

  public sendMessage(event:string, payload: string): void {
    this.connection.send(event, payload)
    .then(response =>{
      console.log("sendMessage:Success" + event);
    }).catch(err => {
      console.log("sendMessage:Failed" + event);
    });
  }

  public bindEvents(): void {
    this.connection.on(NotificationEvents.ViewedOnSonar,this.onViewedOnSonar.bind(this));
    this.connection.on(NotificationEvents.OnMapSearchClear,this.onClearSearchOnMap.bind(this));
    this.connection.on(NotificationEvents.IsUserOnlineCallback,this.userOnlineCallBack.bind(this));
    this.connection.on(NotificationEvents.GreetingEvent,this.onGreetingEvent.bind(this));
  }

  public async onGreetingEvent(params:NotificationPayload<Greeting>){
    const toast = await this.toastController.create({
      message: params.title,
      duration: 1500,
      icon: 'handshake'
    });

    await toast.present();
    this._onGreetingEventOb.emit(params.data);
  }

  public async onViewedOnSonar(params: NotificationPayload<UserOnMap>) {
    const toast = await this.toastController.create({
      message: params.title,
      duration: 1500,
      icon: 'viewing-binoculars'
    });

    await toast.present();
    this.onViewedOnSonarObs.emit(params);
  }

  public userOnlineCallBack(params:NotificationPayload<boolean>): void {

  }

  public onClearSearchOnMap(fromUserId:number): void {
    this.onClearViewingObs.emit(fromUserId);
  }

  public async onMapSearchClear(UserIds:number[]): Promise<void> {
    if(this.connection.state == HubConnectionState.Disconnected){
      await this.connection.start();
    }

    this.connection.send(NotificationEvents.OnMapSearchClear, UserIds, Number(this.user.UserId.toString()));
  }

  public userPing(): void {
    if (this.isConnected) {
      this.connection.send(NotificationEvents.OnUserPing, Number(this.user.UserId.toString()));
    }
  }

  public get isConnected(): boolean {
    return this.user && this.connection && this.connection.state === signalR.HubConnectionState.Connected
  }

}
