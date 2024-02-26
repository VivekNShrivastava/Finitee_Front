import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { PrivacySettingConfig } from 'src/app/core/models/config/PrivacyConfigSetting';
import { UserPrivacySetting } from 'src/app/core/models/UserPrivacySetting';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';

import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';
import { userSonarPrivacySetting } from 'src/app/core/models/userSonarPrivacySetting'; 
import { CommonService } from 'src/app/core/services/common.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'sonar-settings',
  templateUrl: './sonar-settings.component.html',
  styleUrls: ['./sonar-settings.component.scss'],
})
export class SonarSettingsComponent extends BasePage implements OnInit {
  public isOpen: boolean = false;
  public privacySettings = PrivacySettingConfig;
  public editedSetting: PrivacySettingConfig = <PrivacySettingConfig>{};
  public sonarSetting: any = <UserPrivacySetting>{};

  public getUserProfileAsPerPrivacy: any = [];

  public getUserSonarPrivacySetting: any = <userSonarPrivacySetting>{};

  @ViewChild('popover') popover?: IonPopover = undefined;
  @Output() onCloseSetting: EventEmitter<void> = new EventEmitter<void>();

  key: any;
  selectedPopoverValue: any;
  loaded: boolean = false;

  constructor(
    private privacyService: PrivacySettingService,
    public _userPrivacyServivce: UserPrivacyService,
    public _commonService: CommonService,
    public authService: AuthService
  ) {
    super(authService)
    this.sonarSetting = privacyService.privacySettings;
    this.getUserSonarDetails();
  }

  ngOnInit() { }

  public getSettingField(setting: PrivacySettingConfig): string | undefined {
    // const userSonarPrivacySettingValue = this.getUserSonarPrivacySetting.LocationShowAt;
    // const userSonarPrivacySettingValueLocationVisibleTo = this.getUserSonarPrivacySetting.LocationVisibleTo;
    // if (userSonarPrivacySettingValue) {
    //   return setting.Options?.find(x => x.Value == userSonarPrivacySettingValue)?.Text;
    // }
    // if(userSonarPrivacySettingValueLocationVisibleTo){
    //   return setting.Options?.find(x => x.Value == userSonarPrivacySettingValue)?.Text;
    // }

    return setting.Options?.find(x => x.Value == this.sonarSetting[setting.SettingField])?.Text;
  }

  async getUserSonarDetails () {
    this.getUserProfileAsPerPrivacy = await this._userPrivacyServivce.getUserPrivacySetting();
    this.loaded = true;
  }

  presentPopover(e: Event, setting: any): void {
    if (this.popover)
      this.popover.event = e;
    this.isOpen = true;

    this.editedSetting = setting;
  }

  public onOptionSelect(selectedOption: {
    Text: string,
    Value: string
  }, edit: any): void {
    console.log("Edit", edit);
    console.log(selectedOption.Value);
    this.sonarSetting[this.editedSetting.SettingField] = selectedOption.Value;
    if(edit.SettingField === "LocationVisibleTo") {
      this.getUserSonarPrivacySetting = {};
      this.getUserProfileAsPerPrivacy.LocationVisibleTo = this.sonarSetting[this.editedSetting.SettingField]; 
      this.getUserSonarPrivacySetting.LocationVisibleTo = this.sonarSetting[this.editedSetting.SettingField];
      this.saveUserPrivacy();
    }else if(edit.SettingField === "LocationShowAt"){
      this.getUserSonarPrivacySetting = {};
      this.getUserProfileAsPerPrivacy.LocationShowAt = this.sonarSetting[this.editedSetting.SettingField]; 
      this.getUserSonarPrivacySetting.LocationShowAt = this.sonarSetting[this.editedSetting.SettingField];
      this.saveUserPrivacy();
    } 
    this.popover?.dismiss();
  }

  toggleChanged(newValue: boolean, key: string): void {
    console.log('Toggle value changed to:', newValue);

    switch (key) {
      case "LocationShowOnlyWhenLoggedIn":
        this.getUserSonarPrivacySetting = {};
        this.getUserSonarPrivacySetting.LocationShowOnlyWhenLoggedIn = newValue;
        this.saveUserPrivacy();
        break;
      case "AvailableForGreetingWhenLoggedIn":
        this.getUserSonarPrivacySetting = {};
        this.getUserSonarPrivacySetting.AvailableForGreetingWhenLoggedIn = newValue;
        this.saveUserPrivacy();
        break;
      case "OffSetLocation":
        this.getUserSonarPrivacySetting = {};
        this.getUserSonarPrivacySetting.OffSetLocation = newValue;
        this.saveUserPrivacy();
        break;
      case "OffSetHomeLocation":
        this.getUserSonarPrivacySetting = {};
        this.getUserSonarPrivacySetting.OffSetHomeLocation = newValue;
        this.saveUserPrivacy();
        break;
      default:
        console.log("No such key exists!");
        break;
    }
  }

  radioGroupChange(e: any) {
    this.getUserSonarPrivacySetting = e.detail.value;
    console.log(e.detail.value + " " + this.key);
    this.isOpen = false;
  }

  public closeSetting(): void {
    this.onCloseSetting.emit();
  }

  async saveUserPrivacy() {
    const res = await this.privacyService.updateSonarPrivacySetting(this.getUserSonarPrivacySetting);
  }
}
