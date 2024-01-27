import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { UserProfile, getUserProfileAsPerPrivacy } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { ContactDetail } from 'src/app/core/models/user/WorkExperience';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { UserContacvtDetailsService } from 'src/app/core/services/user-contact-details.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-edit-contact-page',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
})
export class EditcontactPage extends BasePage implements OnInit, OnDestroy {
  userProfile: UserProfile = new UserProfile();
  userContact: ContactDetail = new ContactDetail();
  getUserProfileAsPerPrivacy: getUserProfileAsPerPrivacy = new getUserProfileAsPerPrivacy();
  subscription!: any;
  loaded: boolean = false

   

  privacyDetails = {
    property: '',
    privacy: ''
  }

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
  @ViewChild('selectStateModal') selectStateModal!: IonModal;
  @ViewChild('selectCityModal') selectCityModal!: IonModal;
  @ViewChild('emailPop') emailPop!: IonPopover;
  @ViewChild('phonePop') phonePop!: IonPopover;
  @ViewChild('websitePop') websitePop!: IonPopover;
  @ViewChild('address1Pop') address1Pop!: IonPopover;
  @ViewChild('address2Pop') address2Pop!: IonPopover;
  @ViewChild('cityPop') cityPop!: IonPopover;
  @ViewChild('statePop') statePop!: IonPopover;
  @ViewChild('zipPop') zipPop!: IonPopover;
  @ViewChild('countryPop') countryPop!: IonPopover;
  @ViewChild('selectCountryModal') selectCountryModalRef!: IonModal;
  @ViewChild('selectStateModal') selectStateModalRef!: IonModal;
  @ViewChild('selectCityModal') selectCityModalRef!: IonModal;
  isOpen = false;

  CountryPrivacyisOpen = false;
  EmailPrivacyisOpen = false;
  PhoneNumberPrivacyisOpen = false
  WebsitePrivacysOpen = false
  AddressLine1PrivacyisOpen = false
  AddressLine2PrivacyisOpen = false
  CityPrivacysOpen = false
  StatePrivacyisOpen = false
  ZipcodePrivacyisOpen = false

  contact: any;


  constructor(
    private router: Router, public commonService: CommonService,
    public businessCanvasService: BusinessCanvasService, public placesService: PlacesService,
    private userContDetailsService: UserContacvtDetailsService, private authService: AuthService,
    public placeService: PlacesService, private profileService: ProfileService, private navCtrl: NavController,
  ) {
    super(authService);
    
    this.getUserProfileAsPerPrivacy = this.router!.getCurrentNavigation()!.extras.state!['data'];
    console.log(this.getUserProfileAsPerPrivacy);
  }
  
  presentPopover(e: Event, property?: any) {

    switch (property) {
      case 'email':
        this.emailPop.event = e;
        this.EmailPrivacyisOpen = true;
        break;
      case 'phone':
        this.phonePop.event = e;
        this.PhoneNumberPrivacyisOpen = true;
        break;
      case 'website':
        this.websitePop.event = e;
        this.WebsitePrivacysOpen = true;
        break;
      case 'address1':
        this.address1Pop.event = e;
        this.AddressLine1PrivacyisOpen = true;
        break;
      case 'address2':
        this.address2Pop.event = e;
        this.AddressLine2PrivacyisOpen = true;
        break;
      case 'city':
        this.cityPop.event = e;
        this.CityPrivacysOpen = true;
        break;
      case 'zip':
        this.zipPop.event = e;
        this.ZipcodePrivacyisOpen = true;
        break;
      case 'state':
        this.statePop.event = e;
        this.StatePrivacyisOpen = true;
        break; case
        'country':
        this.countryPop.event = e;
        this.CountryPrivacyisOpen = true;
        break;

      default:
        break;


    }

  }


  async onSubmit() {
    // this.commonService.contactDetails.UserId = this.getUserProfileAsPerPrivacy.userProfile.user.Id
    // console.log("abc", this.getUserProfileAsPerPrivacy.userProfile.ContactDetail.Email,"xyz", this.commonService.contactDetails.Email)
    this.getUserProfileAsPerPrivacy.userProfile.ContactDetail.Id = this.contact.Id
    this.getUserProfileAsPerPrivacy.userProfile.ContactDetails = this.contact;
    console.log("abc", this.getUserProfileAsPerPrivacy.userProfile.ContactDetails)
    var result = await this.profileService.AddUserContact(this.getUserProfileAsPerPrivacy.userProfile.ContactDetails);
    if (result) {
      this.navCtrl.pop();
    }
    if (result) {
      this.businessCanvasService.businessData.next(this.userProfile);
      this.navCtrl.pop();
    }
  }

  async ngOnInit() {
    this.loaded = false;
    if (!this.getUserProfileAsPerPrivacy.userProfile.ContactDetail) {
      this.getUserProfileAsPerPrivacy.userProfile.ContactDetail = new ContactDetail;
    }
    this.contact = this.getUserProfileAsPerPrivacy.userProfile.ContactDetails? this.getUserProfileAsPerPrivacy.userProfile.ContactDetails : {};

  }
 
  validateForm(product: any) {
    var valid = true;
    if (this.userProfile.user.ProfileImage && this.userProfile.user.ProfileImage.indexOf("localhost") != -1)
      valid = false;
    else if (this.userProfile.user.Banner && this.userProfile.user.Banner.indexOf("localhost") != -1)
      valid = false;
    return valid;
  }

  async saveUserProfile() {
    var isFormValid = this.validateForm(this.userProfile.user);
    if (isFormValid) {

      delete this.userProfile.user.Id;
      var result = await this.businessCanvasService.saveBusinessUserProfile(this.userProfile.user);
      if (result) {
        this.businessCanvasService.businessData.next(this.userProfile);
        this.navCtrl.pop();
      }
    } else {

    }
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
