

export class WorkExperience {
  Company: string = "";//TBD
  JobTitle: string = "";
  WorkLocation: string = "";
  WorkingMonthFrom: string = "";
  WorkingYearFrom: string = "";
  WorkingMonthToDate: string = "";
  WorkingYearToDate: string = "";
  Privacy: number = 1;

  IsCurrentWorking: boolean = false
}
export class Education {
  SchoolName: string = "";//TBD
  JobTitle: string = "";
  Degree: string = "";
  FieldOfStudy: string = "";
  StartDate: string = "";
  EndDate: string = "";

  // added from chetan
  EducationMonthFrom: string = "";
  EducationYearFrom: string = "";
  EducationMonthToDate: string = "";
  EducationYearToDate: string = "";
  Privacy: number = 1;

}
export class ContactDetail {
   Email: string= "";
   EmailPrivacy: number = 1;
   PhoneNumber: string = '';
   PhoneNumberPrivacy: number = 1;
   Website: string = '';
   WebsitePrivacy: number = 1;
   AddressLine1: string = '';
   AddressLine1Privacy: number = 1;
   AddressLine2: string = '';
   AddressLine2Privacy: number = 1;
   City: string = '';
   CityPrivacy: number = 1;
   CityId: string = '';
   State: string = '';
   StatePrivacy: number = 1;
   StateId: string = '';
   Zipcode: string = '';
   ZipcodePrivacy: number = 1;
   Country: string = '';
   CountryPrivacy: number = 1;
   CountryId: string = '';
   UserId?: string = '';
   Id: string = '';
}
// export class Coordinate {
//   latitude: number | undefined;
//   longitude: number | undefined;
//   accuracy: number | undefined;
// }
