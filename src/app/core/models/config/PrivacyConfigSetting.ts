import { UserPrivacySetting } from "../UserPrivacySetting";
import { nameof } from '../nameof';

export interface PrivacySettingConfig {
    SettingName: string;
    SettingField: keyof UserPrivacySetting;
    Type: string;
    Options?: { Text: string, Value: string }[];
} 

export const PrivacySettingConfig: PrivacySettingConfig[] = <PrivacySettingConfig[]>[
    {
        SettingName: "Sonar location visible to",
        SettingField: nameof<UserPrivacySetting>("LocationVisibleTo"),
        Type: "Select",
        Options: [{
            Text: "All Finitee user",
            Value: "A"
        }, {
            Text: "Connections only",
            Value: "C"
        }, {
            Text: "No one",
            Value: "N"
        }]
    },
    {
        SettingName: "Be seen at",
        SettingField: nameof<UserPrivacySetting>("LocationShowAt"),
        Type: "Select",
        Options: [{
            Text: "Live location",
            Value: "L"
        }, {
            Text: "Home location",
            Value: "H"
        }]
    },
    // {
    //     SettingName: "Location show while logged in",
    //     SettingField: nameof<UserPrivacySetting>("LocationShowOnlyWhenLoggedIn"),
    //     Type: "Checkbox"
    // },
    {
        SettingName: "Available for greeting while logged in",
        SettingField: nameof<UserPrivacySetting>("AvailableForGreeting"),
        Type: "Checkbox"
    },
    // {
    //     SettingName: "Real time GPS location offset",
    //     SettingField: nameof<UserPrivacySetting>("OffSetLocation"),
    //     Type: "Checkbox"
    // },
    // {
    //     SettingName: "Home location offset",
    //     SettingField: nameof<UserPrivacySetting>("OffSetHomeLocation"),
    //     Type: "Checkbox"
    // },
    // {
    //     SettingName: "Is mobile business",
    //     SettingField: nameof<UserPrivacySetting>("IsMobileBusiness"),
    //     Type: "Checkbox"
    // }
]