import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { UserPrivacySetting } from 'src/app/core/models/user-privacy/UserPrivacyDTO';
import { CommonService } from 'src/app/core/services/common.service';
import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  isOpen = false;
  key: any;
  selectedPopoverValue: any;
  privacySetting: any = new UserPrivacySetting();
  loaded: boolean = false;
  para1: boolean = false;
  para2: boolean = false;
  para3: boolean = false;

  constructor(public _userPrivacyServivce: UserPrivacyService,
    public _commonService: CommonService,
    private router: Router,
    private privacySettingService: PrivacySettingService) { }

  ngOnInit() {
    this.getUserPrivacy();
  }

  navigateToAnotherRoute(routeName: string) {
    // Use the Angular Router to navigate to the desired route
    console.log('routename', routeName)
    this.router.navigate(['/', routeName]);
  }
  

  presentPopover(e: Event, key: any, val: string) {
    this.key = key;
    // this.popover.event = e;
    // this.selectedPopoverValue = this.privacySetting[this.key];
    if(val == "ReceiveChatFrom"){
      this.selectedPopoverValue = this.privacySetting[this.key];
      if(this.privacySetting.FreeUserType == "E"){
        this.para2 = true;
        this.para1 = true;
      }
      this.isOpen = true;
    }    
  }

  async getUserPrivacy() {
    this.privacySetting = await this._userPrivacyServivce.getUserPrivacySetting();
    this.loaded = true;
  }

  saveUserPrivacy() {
    console.log("ab", this.privacySetting);
    this._userPrivacyServivce.saveUserPrivacySetting(this.privacySetting);
  }

  radioGroupChange(e: any) {
    this.privacySetting[this.key] = e.detail.value;
    console.log(e.detail.value + " " + this.key);
    this.isOpen = false;
    console.log("value", e.detail.value);

    const res = this.privacySettingService.chatRecievePrivacy(e.detail.value)
  }

}
