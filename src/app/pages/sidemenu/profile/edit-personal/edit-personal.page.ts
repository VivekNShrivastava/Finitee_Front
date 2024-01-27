import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonInput, IonModal, IonPopover, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { City } from 'src/app/core/models/places/City';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { UserProfile, EditPersonal, getUserProfileAsPerPrivacy } from 'src/app/core/models/user/UserProfile';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { formatDate } from '@angular/common';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommonService } from 'src/app/core/services/common.service';

import { FreeUserCanvasService } from 'src/app/core/services/canvas-home/freeuser-canvas.service';

import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-personal-page',
  templateUrl: './edit-personal.page.html',
  styleUrls: ['./edit-personal.page.scss'],
})
export class EditPersonalPage extends BasePage implements OnInit, OnDestroy {
  userProfile: UserProfile = new UserProfile();
  getUserProfileAsPerPrivacy: getUserProfileAsPerPrivacy = new getUserProfileAsPerPrivacy();
  editPersonal: EditPersonal = new EditPersonal();

  birthDate: any = {
    day: '',
    month: '',
    year: ''
  }

  @ViewChild('form', { static: false }) form!: NgForm;

  @ViewChild('inputDOBDay', { static: false }) inputDOBDay!: IonInput;
  @ViewChild('inputDOBMonth', { static: false }) inputDOBMonth!: IonInput;
  @ViewChild('inputDOBYear', { static: false }) inputDOBYear!: IonInput;


  @ViewChild('BioPop') BioPop!: IonPopover;
  @ViewChild('GenderPop') GenderPop!: IonPopover;
  @ViewChild('DobPop') DobPop!: IonPopover;
  @ViewChild('LangPop') LangPop!: IonPopover;
  @ViewChild('SkillPop') SkillPop!: IonPopover;
  @ViewChild('CityPop') CityPop!: IonPopover;
  @ViewChild('ReligionPop') ReligionPop!: IonPopover;

  BioPrivacyIsOpen = false;
  GenderPrivacyIsOpen = false;
  DobPrivacyIsOpen = false;
  LangPrivacyIsOpen = false;
  SkillPrivacyIsOpen = false;
  CityPrivacyIsOpen = false;
  ReligionPrivacyIsOpen = false;


  privacyType = [
    {
      name: 'All',
      value: 1
    },
    {
      name: 'Connections',
      value: 2
    },

  ]
  dateOfBirth = {
    DayOfBirth: '',
    MonthOfBirth: '',
    YearOfBirth: ''
  };
  constructor(
    private router: Router,
    public businessCanvasService: BusinessCanvasService,
    public freeUserCanvasService: FreeUserCanvasService,
    private authService: AuthService,
    public placeService: PlacesService, private commonService: CommonService,
    private navCtrl: NavController,

  ) {
    super(authService);
    // this.userProfile = this.router!.getCurrentNavigation()!.extras.state!['data'];
    this.getUserProfileAsPerPrivacy = this.router!.getCurrentNavigation()!.extras.state!['data'];
    this.editPersonal = this.router!.getCurrentNavigation()!.extras.state!['data'];
    console.log(this.editPersonal);

  }

  privacyDetails = {
    property: '',
    privacy: 1
  }


  

  propertyMatching() {

    // this.getUserProfileAsPerPrivacy.userProfile.BioPrivacy = 1;

    const { BioPrivacy, GenderPrivacy, DobPrivacy, ReligionPrivacy, LanguagesPrivacy, ProfessionalskillsPrivacy, Previous_citiesPrivacy } = this.getUserProfileAsPerPrivacy.userProfile
    switch (this.privacyDetails.property) {

      case 'bio':
        this.privacyDetails.privacy = BioPrivacy
        break;
      case 'gender':
        this.privacyDetails.privacy = GenderPrivacy
        break;
      case 'dob':
        this.privacyDetails.privacy = DobPrivacy
        break;
      case 'lang':
        this.privacyDetails.privacy = LanguagesPrivacy
        break;
      case 'skill':
        this.privacyDetails.privacy = ProfessionalskillsPrivacy
        break;
      case 'city':
        this.privacyDetails.privacy = Previous_citiesPrivacy
        break;
      case 'religion':
        this.privacyDetails.privacy = ReligionPrivacy
        break;

      default:
        break;
    }

  }
  presentPopover(e: Event, property?: any) {

    switch (property) {
      case 'bio':
        console.log(property)
        this.BioPop.event = e;
        this.BioPrivacyIsOpen = true;
        break;
      case 'gender':
        this.GenderPop.event = e;
        this.GenderPrivacyIsOpen = true;
        break;
      case 'dob':
        this.DobPop.event = e;
        this.DobPrivacyIsOpen = true;
        break;
      case 'lang':
        this.LangPop.event = e;
        this.LangPrivacyIsOpen = true;
        break;
      case 'skill':
        this.SkillPop.event = e;
        this.SkillPrivacyIsOpen = true;
        break;
      case 'city':
        this.CityPop.event = e;
        this.CityPrivacyIsOpen = true;
        break;
      case 'religion':
        this.ReligionPop.event = e;
        this.ReligionPrivacyIsOpen = true;
        break;


      default:
        break;


    }

  }

  async ngOnInit() {  }
  ionViewWillEnter() {
    const dateOfBirthParts = this.getUserProfileAsPerPrivacy.userProfile.DoB.split('-');
    if (dateOfBirthParts.length === 3) {
      this.birthDate.year = dateOfBirthParts[0];
      this.birthDate.month = dateOfBirthParts[1];
      this.birthDate.day = dateOfBirthParts[2];
    }
  }

  @ViewChild('popover') popover!: IonPopover;
  isOpen = false;



  inputOnCahnge() {
    this.errorDate.is_show = false;
  }
  errorDate = {
    message: 'invalid date of birth',
    is_show: false
  }

  async saveUserProfile() {
    console.log("clicked")
    const { year, month, day } = this.birthDate;
    const formattedDateOfBirth = `${year}-${month}-${day}`;
    const isBirthDateValid = this.isBirthDateBeforeToday(formattedDateOfBirth);
    this.getUserProfileAsPerPrivacy.userProfile.DoB = formattedDateOfBirth;
    console.log(isBirthDateValid, "tof")
    if (isBirthDateValid) {
      this.errorDate.is_show = false;
      // const userProfileWithoutId = { ...this.getUserProfileAsPerPrivacy.userProfile };
      // delete userProfileWithoutId.Id;
      // userProfileWithoutId.DateOfBirth = formattedDateOfBirth;

      // const savedProfile = await this.businessCanvasService.saveBusinessUserProfile(userProfileWithoutId);
      // const savedProfile = await this.freeUserCanvasService.saveUserProfile(userProfileWithoutId);
      this.editPersonal = this.getUserProfileAsPerPrivacy.userProfile;
      const savedProfile = await this.freeUserCanvasService.editPersonal(this.editPersonal)


      console.log("Saved", savedProfile);
      if (savedProfile) {
        this.businessCanvasService.businessData.next(this.userProfile);
        this.navCtrl.pop();
      }
    } else {
      this.errorDate.is_show = true;
      console.log("Invalid Birth date")
    }
  }


  isBirthDateBeforeToday(birthDate: string): boolean {
    try {
      // Convert the date string to a Date object with the correct format
      const [year, month, day] = birthDate.split("-").map(Number);
      const birthDateObj: Date = new Date(year, month - 1, day);

      const today: Date = new Date();
      today.setHours(0, 0, 0, 0);

      return birthDateObj < today;
    } catch (error) {
      console.error("Invalid date format. Please use the format: dd-mm-yyyy");
      return false;
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
