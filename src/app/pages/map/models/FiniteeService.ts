export interface FiniteeService extends google.maps.MarkerOptions{
    ServiceId?: number;
    UserId?: any;
    UserProfileImage?: string;
    FullName?: string;
    BusinessOrNonProfitCompanyName?: string;
    DisplayName?: string;//TODO Manoj Sonar
    Title?: string;
    Price?: number;
    PriceType?: string;
    State?: string;
    CurrencyCode?: string;
    ServiceType?: string;
    Images?: any;
    Latitude?: number;
    Longitude?: number;
    timg?:string;
    CreatedOn?:Date;
}
