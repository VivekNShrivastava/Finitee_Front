import { CreatedByDto } from "src/app/core/models/user/createdByDto";
import { Greeting } from "./UserOnMap";

export interface TotemSearchResult {
    TotemId: number;
    TotemTitle: string;
    UserId: number;
    UserName: number;
    Latitude: number;
    Longitude: number;
    TotemImage: string;
    TotemVideo: string;
    CreatedOn: Date;
    IsActive: boolean;
    RangeInKm: number;
    UserProfileImage:string;
    ttimg:string;
}

export interface FiniteeUserOnMap {
    UserId: number;
    Id?: number;
    FirstName: string | null;
    MiddleName: string | null;
    LastName: string | null;
    UserName: string | null;
    FullName: string | null;
    BusinessOrNonProfitCompanyName: string | null;
    DisplayName?: string;//TODO Manoj Sonar
    ProfilePhoto: string | null;
    UserTypeId: number;
    Latitude: number | null;
    Longitude: number | null;
    RangeInKm: number;
    SonarDescription: string;
    IsConnected: boolean;
    Greeting: Greeting | null;
    About: string | null;
}

export interface SonarFreeUserSearchRespond {
  Id?: number;
  FirstName: string | null;
  LastName: string | null;
  UserName: string | null;
  ProfileImage: string | null;
  LatLong : LatLong;
  Traits: Array<string>;
  ShowLocation: any;
  PopularityScore: number;
  TotalPosts: number;
  TotalConnections: number;
  IsConnected: boolean;
}

export interface LatLong {
  Latitude: number;
  Longitude: number;
}

export interface SalesItemResponse {
  Id?: any ;
  Title: string | null;
  Description: string | null;
  Condition: string | null;
  Price: any | null;
  VisibleTo: string | null;
  SalesItemImages: Array<string>;
  Image : string;
  CreatedOn: string | null;
  ExpiredOn: string | null;
  ModifiedOn: string | null;
  //ModifiedOn: Date = new Date();
  Location: string | null;
  IsOffsetLocation : boolean;
  IsActive : boolean;
  ItemStatus: string | null;
  daysLeft : any;
  UserId: string;
  CurrencyCode: string;
  Views: number;
  User: FiniteeUserOnMap | null;
}

export interface SonarEventSearchRespond {
  Description: string;
  Latitude: number;
  Longitude: number;
  AddressLine1: string;
  AddressLine2: string;
  EndDate: string;
  Id: string;
  Title: string;
  FirstName: string;
  LastName: string;
  ProfileImage: string | null;
  StartDate: string;
  Image: string | null;
  EventTraits: string[]; // You may need to adjust this type based on the actual structure of EventTraits
  Proximity: number;
}

export interface SonarSalesListingSearchRespond {
  Description: string;
  Latitude: number;
  Longitude: number;
  Id: string;
  Title: string;
  FirstName: string;
  LastName: string;
  ProfileImage: string;
  Image: string;
  Price: number;
  CurrencyCode: string;
  Condition: string;
  SalesTraits: string[];
  Proximity: number;
}


export interface EventItemResponse {
  Id?: any;
  UserId?: string;
  Title: string | null;
  Description: string | null;
  Address: string | null;

  StartDate: string | null;
  EndDate: string | null;
  ModifiedOn: string | null;
  CreatedOn: string | null;
  Location : string | null;
  IsOffsetLocation : string | null;
  RequireInvite: boolean;

  isActive: boolean;
  Latitude: any;
  Longitude: any ;
  Scope: number;
  VisibleTo: string | null;
  EventImages: Array<string>;
  EventTraits: Array<string>;
  Image: string ;
  daysLeft : any;
  Views: number;
  User: FiniteeUserOnMap | null;

  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;

}

export interface ServiceResponse {
  Id?: any;
  UserId?: string;
  Title: string | null;
  Description: string | null;
  Address: string | null;

  StartDate: string | null;
  ExpiryOn: string | null;
  CreatedOn: string | null;
  ModifiedOn: string | null;
  Location : string | null;
  LocationOffset : string | null;
  RequireInvite: boolean;

  IsActive: boolean;
  Latitude: any;
  Longitude: any ;
  CurrencyCode: string | null;
  VisibleTo: string | null;
  Images: Array<string>;
  DaysLeft : any;
  Views: number;
  User: FiniteeUserOnMap | null;
  Price: any ;
  PriceType: string | null;
  State: string | null;
  // AddressLine3: string | null;

}

export interface PostResponse {
  Id?: any;
  UserId?: string;
  Title: string | null;
  PostDescription: string | null;
  Type: string | null;


  CreatedOn: string | null;
  ModifiedOn: string | null;

  Privacy: string | null;
  Location : string | null;
  // IsOffsetLocation : string | null;
  isActive: boolean;
  Latitude: any;
  Longitude: any ;

  PostImages: Array<string>;
  PostTraits: Array<string>;
  Views: number;
  // User: FiniteeUserOnMap | null;
  CreatedBy: CreatedByDto | null;
  FavouredByCU: boolean;
  FavourCount: number | null;
  CommentCount: string | null;
  BeamCount: string | null;

  BelongsToId: string | null;
  BelongsToNodeName: string | null;

}

export interface RegularSearchUser {
  Id?: any;
  UserName: string;
  FirstName: string;
  LastName: string;
  ProfileImage: string;
  TotalPosts: number;
  TotalConnections: number;
  PopularityScore: any;
  ShowLocation: boolean;
}