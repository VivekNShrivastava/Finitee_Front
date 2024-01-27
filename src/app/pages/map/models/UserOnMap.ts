export class GreetingShow {
    accept?: any;
    send?: boolean;
    reject?: any;
    block?: any;
}

export class Greeting {
    GreetingId?: number;
    FromId?: number;
    ToId?: number;
    Status?: string;
}

export class UserOnMap {
    entity?: string;
    UserId?: string;
    Id?: string;//TODO Manoj Sonar
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    UserName?: string;
    FullName?: string;
    BusinessOrNonProfitCompanyName?: string;
    DisplayName?: string;//TODO Manoj Sonar
    ProfilePhoto?: string;
    UserTypeId?: number;
    Latitude?: number;
    Longitude?: number;
    RangeInKm?: number;
    IsConnected?: boolean;
    IsViewing?: boolean;
    greetingShow?: GreetingShow;
    Greeting?: Greeting;
    timg?: string;
}
