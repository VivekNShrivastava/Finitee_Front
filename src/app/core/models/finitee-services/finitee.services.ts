export class FiniteeService {
  Id?: number;
  Title: string = "";
  Description: string = "";
  StartDate:  Date = new Date();
  ExpiryOn: Date = new Date();
  Price?: number;
  Currency?: string;
  PriceType: string = '';
  VisibleTo: string = "";
  Location: string = 'current';
  Latitude?: number;
  Longitude?: number;
  LocationOffset: boolean = true;
  ImageList: Array<string> = [];
  CreatedOn: Date = new Date();
  ModifiedOn: Date = new Date();
  DaysLeft: any;

  IsActive: boolean = true;
}

 
export class ServiceAlertWord {
  Id?: number;
  TraitWord:string  = ''
  Distance?: number; 
}