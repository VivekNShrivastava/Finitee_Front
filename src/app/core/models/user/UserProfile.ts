import { Address } from "../places/Address";
import { ContactDetail, Education, WorkExperience } from "./WorkExperience";


export class getUserProfileAsPerPrivacy {
    userProfile: UserProfile = new UserProfile();
    EndorsementCount!: number;
    InflowsCount!: number;
    ConnectedUserCount!: number;
    PostCount!: number;
}

export class UserProfile {
    user: User = new User();
    EndorsementCount!: number;
    InflowsCount!: number;
    ConnectedUserCount!: number;
    IsConnected: boolean = false;
    IsRequestExits: boolean = false;
    IsInflowsStarted: boolean = false;
    FirstName: string = "";
    MiddleName: string = "";
    LastName: string = "";
    UserName: string = "";
    DisplayName: string = "";
    UserTypeId: number = -1;
    // DateOfBirth: string = "";
    Gender: string = "";
    About: string = "";
    Bio: string = "";
    ProfileImage: string = "";
    Languages: string = "";
    Previous_cities: string = "";
    Professionalskills: string = "";
    Religion: string = "";
    Website: string = "";
    UserTrait: UserTrait = new UserTrait();
    UserTraits: Array<UserTrait> = [];
    DoB : string = "";


    BioPrivacy: number = 1;
    LanguagesPrivacy: number = 1;
    ProfessionalskillsPrivacy: number = 1;
    Previous_citiesPrivacy: number = 1;
    ReligionPrivacy: number = 1;
    GenderPrivacy: number = 1;
    DobPrivacy: number = 1;
    LanguagePrivacy : number = 1;
    ProfessionalSkillsPrivacy : number = 1;

    WorkExperience: WorkExperience = new WorkExperience();
    WorkExperiences: WorkExperience[] = [];

    Education: Education = new Education();
    Educations: Education[] = [];

    ContactDetail: ContactDetail = new ContactDetail();
    ContactDetails: ContactDetail[] = [];
}

export class UserTrait{
    Trait: string = "";
    // IsDeleted: boolean = false;
    // IsDeletedBy: number = 1;
    UserId : string = "" ;
    // IsActive: boolean = false;
    // CreatedOn: string = "";
    Thumbnail: string = "";
    // ModifiedOn: string = "";
    // DeletedOn: string = "";
    Id?: string = "";
}

export class User {
    Id?: string = "";
    FullName: string = "";
    Email: string = "";
    Phone: string = "";//why duplicate?
    Website: string = "";
    LinkedIn:string ="";
    About: string = "";
    SonarDescription: string = "";
    ProfileImage: string = "";
    Banner: string = "";
    CustomField1: string = "";
    CustomField2: string = "";
    CustomField3: string = "";
    CustomField4: string = "";
    Traits: Array<string> = [];
    ConnectionRequest?: string = "N"; //for other user viewing business home
    FirstName: string = "";
    LastName: string = "";
    MiddleName: string = "";
    UserName: string = "";
    DisplayName: string = "";
    PhoneNumber: string = "";
    PhoneCode: string = "";
    Password: string = "";
    UserTypeId: number = -1;
    Age?: number;

    ProofAttachmentPath: string = "";
    DateOfBirth: string = "";
    Gender: string = "";
    EmailCode: string = "";

    DisplayPhoneNo: string = ""; //Phone Code required?
    DisplayEmail: string = "";

    Address: Address = new Address();
    WorkExperience: WorkExperience = new WorkExperience();
    WorkExperiences: WorkExperience[] = [];

    Education: Education = new Education();
    Educations: Education[] = [];
    // Latitude: string = "";
    // Longitude: string = "";
    // ZipCode: string = "";
    // CityId!: number;
    // StateId!: number;
    // CountryId!: number;
    // AddressLine1: string = "";
    // AddressLine2: string = "";

    Bio: string = "";

    BioPrivacy: number = 1;
    LanguagesPrivacy: number = 1;
    ProfessionalskillsPrivacy: number = 1;
    Previous_citiesPrivacy: number = 1;
    ReligionPrivacy: number = 1;
    GenderPrivacy: number = 1;
    DobPrivacy: number = 1;
    Religion: string = ''
    Previous_cities: string = ''

    Professionalskills: string = ''
    Languages: string = ''
    // ContactDetails = new ContactDetail();

}

export class UserProfileImgAbt {
    ProfileImage: string = "";
    About: string = "";
}

export class EditPersonal {
    Professionalskills: string = "";
    Religion: string = "";
    Previous_cities : string = "";
    Languages : string = "";
    Bio : string = "";
    DoB : string = "";
    BioPrivacy : number = 1;
    GenderPrivacy : number = 1;
    DobPrivacy : number = 1;
    LanguagePrivacy : number = 1;
    ProfessionalskillsPrivacy : number = 1;
    Previous_citiesPrivacy : number = 1;
    ReligionPrivacy : number = 1;

}

export class UserCanvasProfile {
    canvasProfile: CanvasProfile = new CanvasProfile();
    EndorsementCount!: number;
    InflowsCount!: number;
    ConnectedUserCount!: number;
    IsConnected: boolean = false;
    IsRequestExits: boolean = false;
    IsInflowsStarted: boolean = false;
    IsRequestTo: boolean = false;
}

export class CanvasProfile {
    About : string = "";
    DisplayName : string = "";
    FirstName : string = "";
    LastName : string = "";
    MiddleName : string = "";
    ProfileImage : string = "";
    UserName : string = "";
    UserTypeId! : number ;
    Id: string = "";
    Private: boolean = false;
}



export class UserProfileAsPerPrivacy {
    editUserPersonal: EditUserPersonal = new EditUserPersonal();
    ContactDetails: string = "";
    WorkExperiences: string = "";
    Educations: string = "";
}

export class EditUserPersonal{
    FirstName: string = "";
    MiddleName: string = "";
    LastName: string = "";
    UserName: string = "";
    DisplayName: string = "";
    UserTypeId: number = -1;
    DateOfBirth: string = "";
    Gender: string = "";
    About: string = "";
    Bio: string = "";
    ProfileImage: string = "";
    Languages: string = "";
    Previous_cities: string = "";
    ProfessionalSkills: string = "";
    Religion: string = "";
    Website: string = "";
    Traits: Array<string> = [];
}
