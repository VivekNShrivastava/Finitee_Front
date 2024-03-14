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

export interface SonarServiceRequiredSearchRespond {
    CurrencyCode: string | null;
    Description: string;
    FirstName: string;
    Id: string;
    Image: string | null;
    JobTraits: string[];
    LastName: string;
    Latitude: number;
    Longitude: number;
    Price: number;
    PriceType: string;
    ProfileImage: string;
    Proximity: number;
    Title: string;
}

export interface SonarServiceAvailableSearchRespond{
    CurrencyCode: string | null;
    Description: string;
    FirstName: string;
    Id: string;
    Image: string | null;
    JobTraits: string[];
    LastName: string;
    Latitude: number;
    Longitude: number;
    Price: number;
    PriceType: string;
    ProfileImage: string;
    Proximity: number;
    Title: string;
}