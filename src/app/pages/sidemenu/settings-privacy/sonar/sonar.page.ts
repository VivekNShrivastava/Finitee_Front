import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { UserPrivacySetting } from 'src/app/core/models/user-privacy/UserPrivacyDTO';
import { CommonService } from 'src/app/core/services/common.service';
import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sonar',
  templateUrl: './sonar.page.html',
  styleUrls: ['./sonar.page.scss'],
})
export class SonarPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  isOpen = false;
  key: any;
  selectedPopoverValue: any;
  privacySetting: any = new UserPrivacySetting();
  loaded: boolean = false;
  
  constructor(public _userPrivacyServivce: UserPrivacyService,
    public _commonService: CommonService,
    private router: Router) { }

  ngOnInit() {
    this.getUserPrivacy();
  }

  presentPopover(e: Event, key: any) {
    this.key = key;
    this.popover.event = e;
    this.selectedPopoverValue = this.privacySetting[this.key];
    this.isOpen = true;
  }

  async getUserPrivacy() {
    this.privacySetting = await this._userPrivacyServivce.getUserPrivacySetting();
    this.loaded = true;
    console.log(this.privacySetting)
  }

  saveUserPrivacy() {
    console.log("ab", this.privacySetting);
    this._userPrivacyServivce.saveUserPrivacySetting(this.privacySetting);
  }

  radioGroupChange(e: any) {
    this.privacySetting[this.key] = e.detail.value;
    console.log(e.detail.value + " " + this.key);
    this.isOpen = false;
  }

}
