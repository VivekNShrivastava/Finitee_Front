export interface UserPrivacySetting {
    LocationVisibleTo: string;
    LocationShowAt: string;
    LocationShowWhileLoggedIn: boolean;
    AvailableForGreetingWhileLoggedIn: boolean;
    OffSetHomeLocation: boolean;
    OffSetLiveLocation: boolean;
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