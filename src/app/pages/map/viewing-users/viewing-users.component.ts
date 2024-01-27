import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { environment } from 'src/environments/environment';

export enum GreetingCode {
  GreetingSend = 'Send',
  GreetingAccept = 'Accept',
  GreetingReject = 'Reject',
  GreetingBlock = 'Block'
}

@Component({
  selector: 'viewing-users',
  templateUrl: './viewing-users.component.html',
  styleUrls: ['./viewing-users.component.scss'],
})
export class ViewingUsersComponent implements OnInit {
  public viewType: number = 1;
  public viewTemplate: string = "Viewing";
  public attachmentURL = environment.attachementUrl;
  constructor(
    public _commonService: CommonService,
    public navParams: NavParams,
    public _modalController: ModalController,
  ) { 
    this.viewTemplate = navParams?.data['viewTemplate'] ?? this.viewTemplate;
  }

  ngOnInit() { }

  goBack() {
    this._modalController.dismiss();
  }

  public onViewTypeChange(viewType: number): void {
    this.viewType = viewType;
  }

  public viewConnection(user: FiniteeUserOnMap): void {

  }

  public viewUserOnMap(user: FiniteeUserOnMap): void {
    this._modalController.dismiss(user);
  }

  public startChat(user: FiniteeUserOnMap): void {

  }

  public greetingUpdate(user: FiniteeUserOnMap, greetingStatus: string): void {

  }

  public blockUser(): void {

  }
}
