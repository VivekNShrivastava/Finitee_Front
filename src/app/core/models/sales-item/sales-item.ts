export class SalesItem {
  Id?: number ;
  Title: string = "";
  Description: string = "";
  SalesTraits: Array<string> = [];
  Condition: number = 1;
  Price: any;
  VisibleTo: string = "A";
  SalesItemImages: Array<string> = [];
  CreatedOn: Date = new Date();
  ExpireOn: Date = new Date();CreatedBy: any;
;
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

