export class FreeUserProfile {
    Id: string = "";//BusinessUserId
    FullName: string = "";
    Email: string = "";
    Phone: string = "";
    AddressLine1: string = "";
    AddressLine2: string = "";
    About: string = "";
    SonarDescription: string = "";
    ProfileImage: string = "";
    Banner: string = "";
    CustomField1: string = "";
    CustomField2: string = "";
    CustomField3: string = "";
    CustomField4: string = "";
    Traits: Array<string> = [];
    CityId!: number;
    StateId!: number;
    CountryId!: number;
    Zip!: number;
    ConnectedUserCount!: number;
    IsConnected: boolean = false;
    ConnectionRequest?: string = "N"; //for other user viewing business home
}