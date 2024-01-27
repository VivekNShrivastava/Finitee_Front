export class UserPrivacySetting {
    Id: string = "";
    //sonar
    LocationVisibleTo: string = "A";
    LocationShowAt: string = "";
    LocationShowOnlyWhenLoggedIn: boolean = true;
    AvailableForGreetingWhenLoggedIn: boolean = true;
    OffSetLocation: boolean = false;
    IsMobileBusiness: boolean = false;


    FreeUserType: string = "";
    CanvasViewableBy: string = "A";
    OffSetHomeLocation: string = "";
    IsActive: string = "";
    AllowReferralsFrom: string = "";
    AllowReferralsTo: string = "";
    MakeConnectionRequest: string = "";
    RegularSearchAbility: string = "";
    EcardViewableBy: string = "";
    ShowConnectionList: string = "";
    AllowBeamBy: string = "";
    StartInflows: string = "";
    ReceiveChatFrom: string = "";

    //meta
    CreatedOn: string = "";
    IsDeleted: string = "";
    IsDeletedBy: string = "";
    ModifiedOn: string = "";
    DeletedOn: string = "";
    InactivatedOn: string = "";

    //may remove
    AllowConnectedMembersToReferMyECard: string = "";
    AllowOtherUsersToReceiveMyProfile: string = "";
    AllowOtherUsersToReceiveMyECard: string = "";
        HomeScreenViewableBy: string = "A";
        AllowToViewHomeScreen: boolean = true;
}
//sonar
//LocationShowAt: string = "L";
//OffSetLiveLocation: boolean = false;
//donation
//DonationScreenViewableBy: string = "A";