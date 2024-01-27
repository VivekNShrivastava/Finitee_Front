import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { UserPrivacySetting } from 'src/app/core/models/user-privacy/UserPrivacyDTO';
import { CommonService } from 'src/app/core/services/common.service';
import { UserPrivacyService } from 'src/app/core/services/user-privacy/user-privacy.service';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-settings-privacy',
  templateUrl: './settings-privacy.page.html',
  styleUrls: ['./settings-privacy.page.scss'],
})
export class SettingsPrivacyPage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;

  isOpen = false;
  isChecked = false;
  key: any;
  selectedPopoverValue: any;
  privacySetting: any = new UserPrivacySetting();
  loaded: boolean = false;
  currentlyCheckedType: string | null = null;
  checkedToggle: string = "";


  check_I : boolean = false;
  check_E : boolean = false;
  check_S : boolean = false;
  check_G : boolean = false;

  constructor(public _userPrivacyServivce: UserPrivacyService,
    public _commonService: CommonService,
    private privacySettingService: PrivacySettingService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUserPrivacy();
  }

  navigateToAnotherRoute(routeName: string) {
    // Use the Angular Router to navigate to the desired route
    console.log('routename', routeName)
    this.router.navigate(['/', routeName]);
  }
  

  presentPopover(e: Event, key: any) {
    this.key = key;
    this.popover.event = e;
    this.selectedPopoverValue = this.privacySetting[this.key];
    this.isOpen = true;
  }

  async getUserPrivacy() {
    this.privacySetting = await this._userPrivacyServivce.getUserPrivacySetting();
    // this.toggleSection(this.privacySetting.FreeUserType)
    this.checkedToggle = this.privacySetting.FreeUserType;

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
    this.privacySettingService.updateUserPrivacySettings(e);
  }

  isToggleChecked(toggleNumber: string): boolean {
    return this.checkedToggle === toggleNumber;
  }

  handleToggleChange(event: Event, toggleNumber: string) {
    console.log("funtion...")
    const customEvent = event as CustomEvent;

    if (customEvent.detail.checked) {
      // Uncheck the previously checked toggle
      if (this.checkedToggle !== null) {
        this.checkedToggle = "";
      }

      // Check the newly clicked toggle
      this.checkedToggle = toggleNumber;
      this.privacySetting.FreeUserType = this.checkedToggle;

      console.log("res", toggleNumber)
      const res = this.privacySettingService.updateUserPrivacySettings(this.privacySetting.FreeUserType);
    } 

    
    // else {
    //   // Unchecking a toggle, set checkedToggle to null
    //   this.checkedToggle = null;
    // }
  }

  toggleSection(section: string){

    switch(section){
      case 'I':
        this.check_I = !this.check_I;
        this.check_E = false;
        this.check_G = false;
        this.check_S = false;
        console.log("I");
        break;
      case 'E':
        this.check_E = !this.check_E;
        this.check_I = false;
        this.check_G = false;
        this.check_S = false;
        console.log("E");
        break;
      case 'S':
        this.check_S = !this.check_S;
        this.check_E = false;
        this.check_G = false;
        this.check_I = false;
        console.log("S");
        break;
      case 'G':
        this.check_G = !this.check_G;
        this.check_E = false;
        this.check_I = false;
        this.check_S = false;
        console.log("G");
        break;
    }

    // this.cdr.detectChanges();
  }

  // handleToggleChange(event: Event, selectedType: string) {
  //   console.log("funciton....")
  //   const customEvent = event as CustomEvent;

  //   // customEvent.detail.checked = false;

  //   // this.check_I = false;

    // this.check_I = false;
    // this.check_E = false;
    // this.check_G = false;
    // this.check_S = false;

  //   this.privacySetting.FreeUserType = selectedType;

    
  //   // this.check_I = selectedType === 'I' ? !this.check_I : false;
  //   // this.check_E = selectedType === 'E' ? !this.check_E : false;
  //   // this.check_S = selectedType === 'S' ? !this.check_S : false;
  //   // this.check_G = selectedType === 'G' ? !this.check_G : false;

  //   // this.toggleSection(selectedType);

  //   // this.cdr.detectChanges();

    // const res = this.privacySettingService.updateUserPrivacySettings(this.privacySetting.FreeUserType);

  // }

  uncheckAllButtons() {
    // Uncheck all toggle buttons
    this.currentlyCheckedType = null;
  }

  handleToggleChange1(event: Event, selectedType: string) {
    console.log("funciton runing...");
    const customEvent = event as CustomEvent;

    this.check_I = false;
    this.check_E = false;
    this.check_G = false;
    this.check_S = false;

    // console.log("custom", customEvent)
    // if(this.currentlyCheckedType) {
    //   console.log("current", this.currentlyCheckedType)
    //   this.privacySetting.FreeUserType = null;
    // }
  
    // Check the button passed through handleToggleChange
    if (customEvent.detail.checked) {
      this.privacySetting.FreeUserType = selectedType;
      this.currentlyCheckedType = selectedType;
    } else {
      this.currentlyCheckedType = null;
    }
  
    // Add your custom logic here based on the selected type
    console.log('Selected FreeUserType:', selectedType);

    const res = this.privacySettingService.updateUserPrivacySettings(this.privacySetting.FreeUserType)
  }
}
