export interface UserPrivacySetting {
    LocationVisibleTo: string;
    LocationShowAt: string;
    LocationShowOnlyWhenLoggedIn: boolean;
    AvailableForGreeting: boolean;
    OffSetHomeLocation: boolean;
    OffSetLocation: boolean;
    IsMobileBusiness: boolean;
    
    HomeScreenViewableBy: string;
    AllowToViewHomeScreen: boolean;
    CanvasViewableBy: string;
    AllowToViewCanvas: boolean;
    ReceiveMessageFromNonConnection: boolean;
    ReceiveMessageFromNonConnectionBusiness: boolean;
    ReceiveMessageFromNonConnectionNPUser: boolean;
    ConnectionViewableBy: string;
    AllowConnectionRequest: boolean;
    AllowConnectionToReferMe: boolean;
    AllowConnectionToSendReferals: boolean;
    DonationScreenViewableBy: string;
}