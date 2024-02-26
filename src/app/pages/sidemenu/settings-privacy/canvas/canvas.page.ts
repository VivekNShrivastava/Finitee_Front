import { Component, OnInit } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { UserPrivacySetting } from 'src/app/core/models/user-privacy/UserPrivacyDTO';
import { CommonService } from 'src/app/core/services/common.service';
import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.page.html',
  styleUrls: ['./canvas.page.scss'],
})
export class CanvasPage implements OnInit {

  // @ViewChild('popover') popover!: IonPopover;

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
    private privacySettingService: PrivacySettingService,
    private router: Router) { }

  ngOnInit() {
    this.getUserPrivacy();

  }
  selectedOption: string = '';

  presentPopover(e: Event, key: any, val: string) {
    console.log("eve", e);
    console.log("key", key)
    this.key = key;
    

    if(val == "AllowBeamBy"){
      this.selectedPopoverValue = this.privacySetting[this.key];
      if(this.privacySetting.FreeUserType == "I"){
        this.para2 = true;
        this.para3 = true;
      }
      else if(this.privacySetting.FreeUserType == "E"){
        this.para1 = true;
        this.para2 = true;
        this.para3 = true;

      }
      this.isOpen = true;
    }
    else if(val == "StartInflows"){
      this.selectedPopoverValue = this.privacySetting[this.key];
      if(this.privacySetting.FreeUserType == "I"){
        this.para2 = true;
        this.para3 = true;
      }
      else if(this.privacySetting.FreeUserType == "E"){
        this.para1 = true;
        this.para2 = true;
        this.para3 = true;

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

    const res = this.privacySettingService.updateBeamPrivacy(this.privacySetting.AllowBeamBy)
  }

  handleRadioChange(option: string) {
    this.selectedOption = option;
  }

  // Function to determine whether a label should be blue or grey based on selection
  getLabelColor(option: string): string {
    return this.selectedOption === option ? 'blue-label' : 'grey-label';
  }

}
