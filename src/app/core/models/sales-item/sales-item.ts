export class SalesItem {
  Id?: number ;
  Title: string = "";
  Description: string = "";
  SalesTraits: Array<string> = [];
  Condition: string = "New";
  Price: any;
  VisibleTo: string = "A";
  SalesItemImages: Array<string> = [];
  CreatedOn: Date = new Date();
  ExpireOn: Date = new Date();;
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

