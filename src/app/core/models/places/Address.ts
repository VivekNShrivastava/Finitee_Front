export class Address {
  Latitude: number | undefined;
  Longitude: number | undefined;
  Accuracy: number | undefined;
  AddressLine1: string = "";
  AddressLine2: string = "";
  ZipCode: string = "";
  CityId: number = 0;
  StateId: number = 0;
  CountryId: number = 0;
  AddressLabel: string | undefined; // TBD
  Landmark: string = "";
  DefaultAddress: boolean = false;
  UserId: string | undefined;//TBD
  Id: number = 0;
}

export class AddressMap extends Address {
  FormattedAddress: string = "";//TBD
  CountryName: string = "";
  CountryCode: string = "";
  StateName: string = "";
  StateCode: string = "";
  CityName: string = "";
}


export class Area {
  Coordinate: Location | undefined;
  City: string = "";
  Locality: string = "";
  Zip: string = "";
  State: string = "";
  Country: string = "";
  CountryId: number = 0;
}

export class Location {
  Latitude: number | undefined;
  Longitude: number | undefined;
}

// export class Coordinate {
//   latitude: number | undefined;
//   longitude: number | undefined;
//   accuracy: number | undefined;
// }
