import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { PrivacySettingConfig } from 'src/app/core/models/config/PrivacyConfigSetting';
import { UserPrivacySetting } from 'src/app/core/models/UserPrivacySetting';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';

@Component({
  selector: 'sonar-settings',
  templateUrl: './sonar-settings.component.html',
  styleUrls: ['./sonar-settings.component.scss'],
})
export class SonarSettingsComponent implements OnInit {
  public isOpen: boolean = false;
  public privacySettings = PrivacySettingConfig;
  public editedSetting: PrivacySettingConfig = <PrivacySettingConfig>{};
  public sonarSetting: any = <UserPrivacySetting>{};

  @ViewChild('popover') popover?: IonPopover = undefined;
  @Output() onCloseSetting: EventEmitter<void> = new EventEmitter<void>();


  public getSettingField(setting: PrivacySettingConfig): string | undefined {
    return setting.Options?.find(x => x.Value == this.sonarSetting[setting.SettingField])?.Text;
  }

  constructor(
    private privacyService: PrivacySettingService
  ) {
    this.sonarSetting = privacyService.privacySettings;
  }

  ngOnInit() { }

  presentPopover(e: Event, setting: any): void {
    if (this.popover)
      this.popover.event = e;
    this.isOpen = true;

    this.editedSetting = setting;
  }

  public onOptionSelect(selectedOption: {
    Text: string,
    Value: string
  }): void {
    this.sonarSetting[this.editedSetting.SettingField] = selectedOption.Value;
    this.popover?.dismiss();
  }

  public closeSetting(): void {
    this.onCloseSetting.emit();
  }
}
