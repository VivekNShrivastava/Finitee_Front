import { CreatedByDto } from "../user/createdByDto";

export class EventItem {
  Id?: number;
  UserId?: string;
  Title: string = "";
  Description: string = "";
  Address: string = '' 
  
  StartDate: any
  // location : string = "current";
  // locationOffset : boolean =true;

  EndDate: any;
  Latitude: any  ;
  Longitude: any  ;
  // Scope: number = 10;
  VisibleTo: string = 'A';
  EventImages: Array<string> = [];
  EventTraits: Array<string> = [];
  Image: string = "";
  daysLeft : any;
  RequireInvite: any;
  CreatedBy!: CreatedByDto;
 
  AddressLine1: string = "";
  AddressLine2: string = "";
  AddressLine3: string = "";
   
}
 