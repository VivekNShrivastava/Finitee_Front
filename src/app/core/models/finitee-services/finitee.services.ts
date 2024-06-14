export class FiniteeService {
  Id?: number;
  Title: string = "";
  Description: string = "";
  ServiceTraits: Array<string> = [];
  StartDate:  Date = new Date();
  ExpiryOn: Date = new Date();
  Price?: number;
  Currency?: string;
  PriceType: string = '';
  VisibleTo: string = "A";
  Location: string = 'current';
  Latitude?: number;
  Longitude?: number;
  LocationOffset: boolean = true;
  ImageList: Array<string> = [];
  CreatedOn: Date = new Date();
  ModifiedOn: Date = new Date();
  DaysLeft: any;
  FirstName: string = '';
  LastName: string = '';
  IsActive: boolean = true;
}

 
export class ServiceAlertWord {
  Id?: number;
  TraitWord:string  = ''
  Distance?: number; 
}