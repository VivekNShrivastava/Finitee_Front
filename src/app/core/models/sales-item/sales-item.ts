export class SalesItem {
  Id?: number ;
  Title: string = "";
  Description: string = "";
  Condition: string = "New";
  Price: any;
  VisibleTo: string = "All Finitee users";
  SalesItemImages: Array<string> = [];
  CreatedOn: Date = new Date();
  ExpiredOn: Date = new Date();;
  ModifiedOn: Date = new Date();
  Location: string = "current";
  Latitude? : number
  Longitude? : number
  IsOffsetLocation : boolean = true;
  IsActive : boolean = true;
  daysLeft : any;
  UserId: string = "";
  Currency: string = 'INR';


}

