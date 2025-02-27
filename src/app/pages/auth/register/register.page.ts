import { formatDate, LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, IonModal, Platform } from '@ionic/angular';
import { interval, Subscription, take, takeWhile } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
// import { BasicUser } from 'src/app/core/models/user/BasicUser';
// import { BusinessUser } from 'src/app/core/models/user/BusinessUser';
// import { IndividualUser } from 'src/app/core/models/user/IndividualUser';
// import { NonProfitUser } from 'src/app/core/models/user/NonProfitUser';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocationService } from 'src/app/core/services/location.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { getEmptyForNull } from 'src/app/core/util/string-utils';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { isEqual } from 'lodash';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { Address, AddressMap } from 'src/app/core/models/places/Address';
import { NgOtpInputComponent } from 'ng-otp-input';
import { User } from 'src/app/core/models/user/UserProfile';
import { error } from 'console';
// import { Filesystem } from '@capacitor/filesystem';

const secTimer = interval(1000);
const emailTimer = interval(20000);


// const pickFiles = async () => {
//   const result = await FilePicker.pickFiles({
//     types: ['image/png', 'image/jpeg', 'application/pdf'],
//     multiple: false,
//   });
// };

// const pickImages = async () => {
//   const result = await FilePicker.pickImages({
//     multiple: true,
//   });
// };

// const pickMedia = async () => {
//   const result = await FilePicker.pickMedia({
//     multiple: true,
//   });
// };

// const pickVideos = async () => {
//   const result = await FilePicker.pickVideos({
//     multiple: true,
//   });
// };

// const appendFileToFormData = async () => {
//   const result = await FilePicker.pickFiles();
//   const file = result.files[0];

//   const formData = new FormData();
//   if (file.blob) {
//     const rawFile = new File(file.blob, file.name, {
//       type: file.mimeType,
//     });
//     formData.append('file', rawFile, file.name);
//   }
// };

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('inputDOBDay', { static: false }) inputDOBDay!: IonInput;
  @ViewChild('inputDOBMonth', { static: false }) inputDOBMonth!: IonInput;
  @ViewChild('inputDOBYear', { static: false }) inputDOBYear!: IonInput;
  @ViewChild('selectCountryModal') selectCountryModalRef!: IonModal;
  @ViewChild('selectStateModal') selectStateModalRef!: IonModal;
  @ViewChild('selectCityModal') selectCityModalRef!: IonModal;
  @ViewChild('selectGenderModal') selectGenderModalRef!: IonModal;
  @ViewChild('pinLocationModal') pinLocationModalRef!: IonModal;
  @ViewChild('phoneOTPInputComp') phoneOTPInputRef!: NgOtpInputComponent;

  seletedGender: String = '';
  genderInputValue: String = '';
  tempUser: boolean = false;
  selectedCountry!: any;
  selectedState!: any;
  selectedCity!: any;
  countrySearchableInput!: SelectSearchableInput;
  stateSearchableInput!: SelectSearchableInput;
  citySearchableInput!: SelectSearchableInput;
  genderSelect!: SelectSearchableInput;
  pinnedLocation!: AddressMap;
  routeSubscription!: Subscription;
  screenStack: number[] = [];
  // inputDOB = {day : 0, month : 0, year : 0};
  inputDOB = { day: "", month: "", year: "", enteredDOBFormatted: "", showDOBError: 0, errorMsg: "Please enter a valid date of birth" };
  step: any = 1;
  selectedFile: any;
  selectedFileObj: any;
  mediaSubscription!: Subscription;
  currentLocation!: any;
  selectedUserType: any = AppConstants.USER_TYPE.FR_USER;
  addressLabel = "Please enter your address";
  currentUser!: User;
  currentUserWCurrLoc: any;
  maxDOBDate!: Date;
  minDOBDate!: Date;
  emailForm!: FormGroup;
  nameForm!: FormGroup;
  passwordForm!: FormGroup;
  addressForm!: FormGroup;
  phoneForm!: FormGroup;
  usernameForm!: FormGroup;
  lastUNameCheckTime!: any;
  AppConstants = AppConstants;//TODO Manoj check if correct way to use
  otpTimer = {
    secs: AppConstants.DEFAULT_OTP_TIMEOUT,
    msg: ""
  }

  otpTimeout = secTimer.pipe(take(AppConstants.DEFAULT_OTP_TIMEOUT));
  // emailTimeout = emailTimer.pipe( take(10));
  otpSubscription!: Subscription;
  emailTimerSubscription!: Subscription;
  checkedUsername = {
    username: "",
    available: false,
    valid: false,
    errorMsg: ""
  }

  errorMsgGrp = {
    email: "",
    phone: ""
  }

  REG_STEP = {
    CHOOSE_ACC: 1,
    NAME: 2,
    BIRTHDAY: 3,
    PHONE_NO: 4,
    PHONE_OTP: 5,
    EMAIL: 6,
    EMAIL_VERIFY: 7,
    PASSWORD: 8,
    ADDRESS: 9,
    USERNAME: 10,
    BUSINESS_REG: 12,
    NONPROFIT_REG: 13,
    FILE_UPLOAD_REQ: 14,
    FILE_UPLOAD_RES: 15,
    BUSINESS_NP_WELCOME: 16,
    HOME: 20,
    EMAIL_VERIFYOLD: 21

  }

  stepFlow: any = {
    basic: [this.REG_STEP.CHOOSE_ACC, this.REG_STEP.NAME, this.REG_STEP.BIRTHDAY, this.REG_STEP.PHONE_NO, this.REG_STEP.PHONE_OTP, this.REG_STEP.EMAIL]
  }
  passwordMismatch = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public placesService: PlacesService,
    private regService: RegistrationService,
    private authService: AuthService,
    public alertController: AlertController,
    private locationService: LocationService,
    private platform: Platform,
    private attachmentService: AttachmentHelperService,
    private route: ActivatedRoute
    // private recaptchaV3Service: ReCaptchaV3Service,

  ) { }

  async ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(async () => {
      if (this.router?.getCurrentNavigation()?.extras.queryParams) {
        this.tempUser = this.router.getCurrentNavigation()?.extras?.queryParams?.['tempUser'];
        console.log("REG: ngOnInit: queryParams tempUser: ", this.tempUser);
      }
    });

    this.initForms();
    this.setUserDefaultCountryId();
    if (this.tempUser) {
      // this.currentUser = await this.regService.getTempUser();
      this.setUpFormWithTempUser();
    }
    else {
      this.currentUser = new User();//new BasicUser();
      this.nextStep(this.REG_STEP.CHOOSE_ACC);
      // this.nextStep(this.REG_STEP.PASSWORD);

    }



    this.platform.pause.subscribe(async () => {
      // alert('Pause event detected');
      // this.regService.commonService.presentToast("TEST: REG: PLATFORM PAUSE");
      console.log("Register: Platform Paused");
    });

    this.platform.resume.subscribe(async () => {
      // alert('Resume event detected');
      // this.regService.commonService.presentToast("TEST: REG: PLATFORM RESUME");
      // console.log("ionViewDidEnter");
      console.log("Register: Platform Resume");
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log("Register: Platform Back Pressed");
      this.back();//TODO check for more conditions
    });

    this.mediaSubscription = this.attachmentService.getMediaSaveEmitter().subscribe(data => {
      console.log("Reg Media Subscription: ", data)
      if (data != null) {
        // this.selectedFileObj = data;
        let mediaObj: any = {};
        mediaObj.name = data.name;
        if (data.blob) {
          //Means for web
          mediaObj.blob = data.blob;
          console.log("pickFileFromUser: mediaObj: ", mediaObj);
          this.processSelectedFile(mediaObj);
        }
      }
    })
  }
  async ionViewDidEnter() {
    console.log("ionViewDidEnter");
    // await Filesystem.requestPermissions();
    let genderArray = ["Male", "Female", "Other"];
    this.genderSelect = new SelectSearchableInput(genderArray, "");

    this.maxDOBDate = this.getMaxDateforDOB();
    this.minDOBDate = this.getMinDateforDOB();

    // this.setupEmailVerifyTimer();
    let countryList = await this.placesService.findCountry({ all: true });
    this.countrySearchableInput = new SelectSearchableInput();
    this.countrySearchableInput.listData = countryList;
    this.countrySearchableInput.title = "Select country";
    this.countrySearchableInput.searchPlaceholder = "Search country";
    this.countrySearchableInput.searchable = true;
    this.countrySearchableInput.preSelected = this.selectedCountry;
    this.countrySearchableInput.dataKeyMap = { title: "CountryName", srno: "PhoneCode", id: "id", icon: "CountryName", detail: "" };

    this.stateSearchableInput = new SelectSearchableInput();
    this.stateSearchableInput.listData = this.placesService.states;// await this.placesService.findState(101, {all: true});
    this.stateSearchableInput.title = "Select state";
    this.stateSearchableInput.searchPlaceholder = "Search state";
    this.stateSearchableInput.searchable = true;
    // this.stateSearchableInput.preSelected = undefined;//this.selectedCountry;
    this.stateSearchableInput.dataKeyMap = { title: "StateName", srno: "", id: "id", icon: "", detail: "" };

    this.citySearchableInput = new SelectSearchableInput();
    this.citySearchableInput.listData = this.placesService.cities;// await this.placesService.findState(101, {all: true});
    this.citySearchableInput.title = "Select city";
    this.citySearchableInput.searchPlaceholder = "Search city";
    this.citySearchableInput.searchable = true;
    // this.stateSearchableInput.preSelected = undefined;//this.selectedCountry;
    this.citySearchableInput.dataKeyMap = { title: "CityName", srno: "", id: "id", icon: "", detail: "" };
  }



  ngOnDestroy() {
    this.unsubscribeEvnets();
  }

  unsubscribeEvnets() {
    if (this.otpSubscription) {
      this.otpSubscription.unsubscribe();
    }

    if (this.emailTimerSubscription) {
      this.emailTimerSubscription.unsubscribe();
    }

    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }

    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  setUpFormWithTempUser() {

  }

  onGenderSelected(event: any) {
    console.log("onGenderSelected: ", event);
    this.selectGenderModalRef.dismiss();
  }

  userType(data: any) {
    console.log("Reg: UserType: ", data.detail.value);
    this.selectedUserType = data.detail.value;
  }

  chooseActType() {
    this.step = this.REG_STEP.NAME;
    switch (this.selectedUserType) {
      case this.selectedUserType = AppConstants.USER_TYPE.FR_USER:
        // this.step = this.REG_STEP.USERNAME;//NAME;//ADDRESS
        // this.setUpAddressPage();//TODO REMOVE
        // this.step = this.REG_STEP.EMAIL;//NAME;//FILE_UPLOAD_REQ
        this.currentUser.UserTypeId = AppConstants.USER_TYPE.FR_USER;
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.BN_USER:
        // this.setUpAddressPage();//TODO REMOVE
        // this.step = this.REG_STEP.PHONE_NO;//NAME;//FILE_UPLOAD_REQ
        this.currentUser.UserTypeId = AppConstants.USER_TYPE.BN_USER;
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.NF_USER:
        // this.step = this.REG_STEP.FILE_UPLOAD_REQ;
        this.currentUser.UserTypeId = AppConstants.USER_TYPE.NF_USER;
        break;
    }
    this.nextStep(this.step);
    // this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
    //   console.log(`Token [${token}] generated`);
    // });
  }
  getCurrentUser(step?: string) {
    console.log("Reg: SgetCurrentUser " + step + " :", this.currentUser);
  }

  saveNameDetails() {
    this.currentUser.FirstName = this.nameForm.value.fname.trim();
    console.log("saveNameDetails", this.nameForm.value.fname.trim());
    this.currentUser.LastName = this.nameForm.value.lname.trim();
    this.currentUser.Gender = this.nameForm.value.gender;
    console.log("Reg: Save Name: ", this.currentUser);

    this.nextStep(this.REG_STEP.BIRTHDAY);
  }

  freeUserDob() {
    this.getCurrentUser();
    this.resetOTPTimer();
    switch (this.selectedUserType) {
      case this.selectedUserType = AppConstants.USER_TYPE.FR_USER:
        this.step = this.REG_STEP.PHONE_NO;
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.BN_USER:
        this.step = this.REG_STEP.BUSINESS_REG;
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.NF_USER:
        this.step = this.REG_STEP.NONPROFIT_REG;
        break;
    }
    this.nextStep(this.step);
    this.setUserDefaultCountryId();
  }

  async setUserDefaultCountryId() {
    let defaultCountryId = this.placesService.getDefaultCountryId();
    console.log("reg", defaultCountryId);
    this.phoneForm.setValue({ countryId: defaultCountryId, phoneNo: "" });
    this.selectedCountry = await this.placesService.findCountry({ id: defaultCountryId });

    // if (!this.currentUser.CountryId || this.currentUser.CountryId.length == 0) {
    //   this.currentUser.CountryId = this.placesService.getCountryIdFromPhoneCode(AppConstants.DEFAULT_PHONE_CODE);
    //   this.phoneForm.value.countryId = this.currentUser.CountryId ;
    // }
  }

  sendRegisterPhoneOTP(resentOTP: boolean) {
    this.getCurrentUser("Phone");
    this.regService.commonService.showLoader('sendRegisterPhoneOTP');
    // this.currentUser.CountryId = this.phoneForm.value.countryId;
    // this.currentUser.PhoneNumber = this.phoneForm.value.phoneNo;
    // let phoneCode = this.placesService.getPhoneCode(this.currentUser.CountryId);
    // this.currentUser.PhoneCode = phoneCode;
    // this.setUserDefaultCountryId();
    let body = {
      "PhoneCode": this.currentUser.PhoneCode,  // Code
      "PhoneNumber": this.currentUser.PhoneNumber,
      // "DeviceId": 1000
    }

    this.regService.apiService.sendRegisterPhoneOTP(body)
      .subscribe(response => {
        this.regService.commonService.hideLoader('sendRegisterPhoneOTP')
        if (response.ResponseData && response.ResponseData.Success && response.ResponseStatus == "OK") {//TODO Manoj Check and change
          // if (response.ResponseStatus == "OK") {
          this.regService.commonService.presentToast("OTP Sent to entered number");
          if (!resentOTP) {
            this.nextStep(this.REG_STEP.PHONE_OTP);
          }
          this.setOTPTimer();
          this.placesService.getStateList(this.currentUser.Address.CountryId);
        }
        else {
          this.regService.commonService.presentToast("Sorry, failed to send OTP entered number.. Kindly enter a valid number");
        }
      });
    // this.step = this.REG_STEP.PHONE_OTP;//TEMPSTEP
  }

  setOTPTimer() {
    this.otpSubscription = this.otpTimeout.subscribe(timer => {
      this.otpTimer.secs = AppConstants.DEFAULT_OTP_TIMEOUT - (timer + 1);
      this.otpTimer.msg = " in " + this.otpTimer.secs + "s";
      if (this.otpTimer.secs == 0) {
        this.otpTimer.msg = "";
      }
    });
  }

  resetOTPTimer() {
    if (this.otpSubscription) {
      this.otpSubscription.unsubscribe();
    }
    this.otpTimer.msg = "";
    this.otpTimer.secs = AppConstants.DEFAULT_OTP_TIMEOUT;
  }

  resendOTP() {
    this.getCurrentUser("ResendOtp");
    //TODO: Make OTP blank
    this.phoneOTPInputRef.setValue("");
    if (this.step === this.REG_STEP.PHONE_OTP) {
      this.sendRegisterPhoneOTP(true);
    }
    else {
      this.sendOTPOnEmail(true);
    }

  }

  changePhoneNumber() {
    this.resetOTPTimer();
    // this.step = this.REG_STEP.PHONE_NO;
    this.back();
  }

  setBOName() {
    this.nextStep(this.REG_STEP.PHONE_NO);
  }

  setNPName() {
    this.nextStep(this.REG_STEP.PHONE_NO);
  }

  submitEmail() {
    this.getCurrentUser();
    this.currentUser.Email = this.emailForm.value.email;
    this.checkUserDetailsExist("Email");


    // this.step = this.REG_STEP.EMAIL_VERIFY;//TEMPSTEP
  }

  submitPhone() {
    console.log(this.countrySearchableInput.preSelected, "country code@@");
    this.getCurrentUser();
    this.currentUser.Address.CountryId = this.phoneForm.value.countryId;
    this.currentUser.PhoneNumber = this.phoneForm.value.phoneNo;
    let phoneCode = this.placesService.getPhoneCode(this.countrySearchableInput.preSelected.PhoneCode);
    this.currentUser.PhoneCode = phoneCode;
    console.log(phoneCode, "phone code is setting in current user phonecode@@");
    this.checkUserDetailsExist("PhoneNumber");
  }

  getChangeNumberEmailButtonLabel() {
    return this.step === this.REG_STEP.PHONE_OTP ? "Change Phone number" : "Change email";
  }

  sendOTPOnEmail(event: any) {
    console.log("sendOTPOnEmail", event);
    this.regService.commonService.showLoader('sendOTPOnEmail');
    let body = {
      Email: this.currentUser.Email,
      // DeviceId: 1000
    }
    this.regService.apiService.sendOTPOnEmail(body)
      .subscribe({
        next: response => {
          console.log("sendOTPOnEmail: Response: ", response);
          this.regService.commonService.hideLoader('sendOTPOnEmail');
          if (this.regService.apiService.isAPISuccessfull(response)) {
            this.nextStep(this.REG_STEP.EMAIL_VERIFY, true)
            this.regService.commonService.presentToast("OTP sent to entered email.. Kindly check");
            this.setOTPTimer();

          }
          else {
            this.emailForm.controls['email'].setErrors({ 'incorrect': true });
            let errorMsg = "Sorry, error sending OTP on entered email";
            // this.errorMsgGrp.emailForgotPwd = errorMsg;
            this.regService.commonService.presentToast(errorMsg);
          }
        },
        error: errorMsg => {
          console.log("sendOTPOnEmail: Response error: ", errorMsg);
          this.regService.commonService.hideLoader('sendOTPOnEmail');
          this.regService.commonService.presentToast(errorMsg);
          // this.errorMsgGrp.emailForgotPwd = errorMsg;
          this.emailForm.controls['email'].setErrors({ 'incorrect': true });
        }
      });
  }

  verifyOTPSentOnMail(event: any) {
    // console.log("changePasswordViaEmailOTP", event);
    if (event && event.length == 6) {
      this.regService.commonService.showLoader('verifyOTPSentOnMail');
      let body = {
        OTP: event,  // Code
        Email: this.emailForm.value.email,
      }
      this.regService.apiService.verifyOTPSentOnMail(body)
        .subscribe({
          next: response => {
            console.log("verifyOTPSentOnMail: Response: ", response);
            this.regService.commonService.hideLoader('verifyOTPSentOnMail');
            // if (this.regService.apiService.isAPISuccessfull(response) && response.ResponseData === 1) {
            if (response.Success) {
              this.nextStep(this.REG_STEP.PASSWORD);
              this.regService.commonService.presentToast("OTP Verified Successfully!");
            }
            else {
              //SHOW ERROR of Invalid OTP //TODO
              // this.regService.commonService.presentToast("Invalid OTP!");
              // this.emailForm.controls['email'].setErrors({ 'incorrect': true });
              let errorMsg = "Invalid OTP!";
              // this.errorMsgGrp.emailOTP = errorMsg;
              this.regService.commonService.presentToast(errorMsg);
            }
            // this.regService.commonService.hideLoader();
          },
          error: errorMsg => {
            console.log("changePasswordViaEmailOTP: Response error: ", errorMsg);
            this.regService.commonService.hideLoader('verifyOTPSentOnMail');
            this.regService.commonService.presentToast(errorMsg);
            // this.errorMsgGrp.emailOTP = errorMsg;
            // this.emailForm.controls['email'].setErrors({ 'incorrect': true });
          }
        });
    }
  }


  //Not used.. to be removed?
  sendEmailForVerificationXX() {
    this.regService.commonService.showLoader()
    let body = {
      "u_name": getEmptyForNull(this.currentUser.UserName), // Username
      "u_eml": this.currentUser.Email, // Email Id
      "u_ustypid": this.currentUser.UserTypeId // 1 - Free User / 2 - Business User / 3 - Non Profit User
    }
    this.regService.apiService.sendEmailVerification(body)
      .subscribe(
        response => {
          this.currentUser.EmailCode = "";
          this.regService.commonService.hideLoader()
          if (response.ResponseData && response.ResponseData.EmailCode && response.ResponseStatus == "OK") {
            this.currentUser.EmailCode = response.ResponseData.EmailCode;
            this.nextStep(this.REG_STEP.EMAIL_VERIFY);
            this.setupEmailVerifyTimer();
            this.regService.commonService.presentToast("Email verification link sent successfully!");
          }
          else {
            //SHOW ERROR of Invalid OTP //TODO
            this.regService.commonService.presentToast("Error sending email verification link");
          }
        },
        error => {
          this.regService.commonService.presentToast(error);
          console.log("Wrong OTP");
        }
      );
  }

  //Not Used..  to be removed?
  setupEmailVerifyTimer() {

    if (this.step == this.REG_STEP.EMAIL_VERIFY && this.emailTimerSubscription == null) {
      console.log("setupEmailVerifyTimer");
      this.emailTimerSubscription = emailTimer.pipe(takeWhile(interval => this.step == this.REG_STEP.EMAIL_VERIFY)).subscribe(interval => {
        console.log("setupEmailVerifyTimer: Called ", interval);
        // this.checkEmailVerified();
        if (this.step == this.REG_STEP.EMAIL_VERIFY) {//TODO Manoj to check
          this.checkEmailVerified();
        }
        // else {
        //   //do nothing?
        // }
      });
    }
  }

  emailVerification() {
    this.getCurrentUser();
    this.nextStep(this.REG_STEP.PASSWORD);
    // this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
    //   console.log(`Token [${token}] generated`);
    // });
  }

  goToLogin() {
    //clear user data //TODO Manoj
    this.router.navigateByUrl("/");
  }

  resendNewLink() {
    this.submitEmail();
  }

  setPassword() {
    console.log('setPassword called');
    console.log('Password 1:', this.passwordForm.value.password1);
    console.log('Password 2:', this.passwordForm.value.password2);

    if (this.passwordForm.value.password1 !== this.passwordForm.value.password2) {

      console.log('Passwords do not match');
      this.regService.commonService.presentToast("Passwords do not match!");
    } else {

      console.log('Passwords match');
      this.getCurrentUser();
      this.currentUser.Password = this.passwordForm.value.password1;
      this.setUpAddressPage();
      this.nextStep(this.REG_STEP.ADDRESS);
    }
  }
  setUpAddressPage() {
    this.stateSearchableInput.listData = this.placesService.states;// await this.placesService.findState(101, {all: true});
  }

  saveAddress() {
    this.getCurrentUser();
    this.currentUser.Address.StateId = this.selectedState.id;//this.addressForm.value.stateId;
    this.currentUser.Address.CityId = this.selectedCity.id;//this.addressForm.value.cityId;
    this.currentUser.Address.ZipCode = this.addressForm.value.zipCode;
    this.currentUser.Address.AddressLine1 = this.addressForm.value.addressLine1;
    this.currentUser.Address.AddressLine2 = this.addressForm.value.addressLine2;

    //TODO Manoj
    console.log("currentUserWCurrLoc: ", this.currentUserWCurrLoc);
    console.log("currentUser: ", this.currentUser);
    if (isEqual(this.currentUserWCurrLoc, this.currentUser)) {
      this.nextStep(this.REG_STEP.USERNAME);
    }
    else {
      let formattedAddress = this.currentUser.Address.AddressLine1 + ", " + this.currentUser.Address.AddressLine2 + ", " + this.currentUser.Address.ZipCode;//TODO: MANOJ CHECK
      let getUserEnteredCoord = this.locationService.observeGeocodingResult().subscribe((coord) => {
        console.log("REG: saveAddress: getUserEnteredCoord: ", coord);
        if (coord) {
          this.currentUser.Address.Latitude = coord.latitude;
          this.currentUser.Address.Longitude = coord.longitude;
          this.regService.commonService.hideLoader('saveAddress');
          this.nextStep(this.REG_STEP.USERNAME);
          // this.locationService.getAddressFromLatLng({lat: this.currentLocation.latitude, lng: this.currentLocation.longitude});
        }
        else {
          this.regService.commonService.hideLoader('saveAddress');
          this.regService.commonService.presentToast("Location not found, Kindly enter valid address..");
        }
      });
      this.regService.commonService.showLoader('saveAddress');
      this.locationService.getLatLngFromAddress(formattedAddress);
    }


  }

  // skipUsername() {
  //   this.getCurrentUser();
  //   this.router.navigateByUrl('/tabs');
  // }

  saveUsername() {
    this.getCurrentUser();
    if (this.currentUser.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
      this.registerUser(this.REG_STEP.HOME);
    }
    else if (this.currentUser.UserTypeId == AppConstants.USER_TYPE.BN_USER || this.currentUser.UserTypeId == AppConstants.USER_TYPE.NF_USER) {
      this.nextStep(this.REG_STEP.FILE_UPLOAD_REQ);
    }
  }

  back() {
    console.log("Reg: Go Back: A: " + this.step, this.screenStack);
    if (this.step == this.REG_STEP.CHOOSE_ACC) {
      this.router.navigateByUrl('/');
      // LocationStrategy.back(); //TODO Manoj check
    }
    else {
      if (this.step == this.REG_STEP.PHONE_OTP || this.step == this.REG_STEP.EMAIL_VERIFY) {
        this.resetOTPTimer();
      }

      // this.step = this.step - 1;
      let topStep = this.step;
      if (this.screenStack.length > 0) {
        topStep = this.screenStack.pop();
        console.log("Reg: Go Back topStep:", topStep);
        if (this.screenStack.length > 0) {
          this.step = this.screenStack[this.screenStack.length - 1];
        }
        else {
          //else????
        }
        // if (topStep && topStep === this.step) {
        //   this.step = this.screenStack.pop();
        // }
      }
      console.log("Reg: Go Back: B: " + this.step, this.screenStack)
      if (this.screenStack.length == 0) {
        this.screenStack.push(this.step);
      }
      console.log("Reg: Go Back: C: " + this.step, this.screenStack)
      console.log("Reg: DisplayedStep ", this.step)
    }

  }

  nextStep(stepNo: number, avoidStack?: boolean) {
    console.log("nextStep-->", this.step, stepNo)
    this.step = stepNo;
    let topStep = this.screenStack.pop();
    if (topStep && topStep != stepNo) {
      if (!avoidStack) {
        this.screenStack.push(topStep);
      }
    }
    if (!avoidStack) {
      this.screenStack.push(this.step);
    }
    // this.regService.updateTempUser(this.currentUser, stepNo);
  }


  getAddressLabel() {
    let addressLabel = "Please enter your address";
    switch (this.selectedUserType) {
      case this.selectedUserType = AppConstants.USER_TYPE.FR_USER:
        addressLabel = "Please enter your home location";
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.BN_USER:
        addressLabel = "Please enter your business's address";
        break;
      case this.selectedUserType = AppConstants.USER_TYPE.NF_USER:
        addressLabel = "Please enter your nonprofit's address";
        break;
    }
    return addressLabel;
  }

  getMaxDateforDOB() {
    let maxDate = this.getOlderDate(18);
    return maxDate;//maxDateS;
  }

  getMinDateforDOB() {
    let maxDate = this.getOlderDate(120);
    return maxDate;//maxDateS;
  }

  getOlderDate(years: number) {
    let currentDate = new Date();
    let maxDateMilli = currentDate.getTime() - years * 3.156e+10;
    let maxDate = new Date();
    maxDate.setTime(maxDateMilli);
    let maxDateS = formatDate(maxDate, AppConstants.DATE_FORMAT.TIMESTAMP, "en-US");
    //2006-01-01T23:59:59
    console.log("getOlderDate: years: " + years + " max:", maxDateS);
    // this.inputDOBYear.max = maxDate.getFullYear();
    return maxDate;//maxDateS;
  }

  otpInputChange(event: any) {
    if (event && event.length == 6) {
      if (this.step == this.REG_STEP.PHONE_OTP) {
        this.phoneOTPInput(event);
      } else {
        this.verifyOTPSentOnMail(event);
      }
    }
  }

  phoneOTPInput(event: any) {
    console.log("phoneOTPInput", event);
    if (event && event.length == 6) {
      this.regService.commonService.showLoader('phoneOTPInput');
      let body = {
        "OTP": event,  // Code
        "PhoneNumber": this.currentUser.PhoneNumber,
        "PhoneCode": this.currentUser.PhoneCode
      }
      this.regService.apiService.verifyRegisterPhoneOTP(body)
        .subscribe(
          response => {
            this.regService.commonService.hideLoader('phoneOTPInput');
            if (response.Success) {
              this.nextStep(this.REG_STEP.EMAIL);
              // this.registerUser(this.REG_STEP.EMAIL);
              // this.registerUser(this.REG_STEP.ADDRESS);//TODO MAnoj UNDO THIS
              this.regService.commonService.presentToast("OTP Verified Successfully!");
            }
            else {
              //SHOW ERROR of Invalid OTP //TODO
              this.regService.commonService.hideLoader('phoneOTPInput');
              this.regService.commonService.presentToast(response.Error);
            }
          },
          error => {
            this.regService.commonService.hideLoader('phoneOTPInput');
            this.regService.commonService.presentToast(error);
            console.log("wrong otp");
          }
        );
    }
  }

  checkUsernameExist() {
    let usernameTmp = this.usernameForm.value.username;
    // console.log("phoneOTPInput", event);
    if (usernameTmp && usernameTmp.length >= AppConstants.MIN_USERNAME_LENGTH) {
      this.regService.commonService.showLoader('checkUsernameExist');
      this.checkedUsername.username = this.currentUser.UserName;
      this.checkedUsername.available = false;
      this.checkedUsername.valid = false;
      let body = {
        "DetailsType": "UserName",
        "DetailsValue": usernameTmp,
        "PhoneCode": ""
      }
      this.regService.apiService.checkUserDetailsExist(body)
        .subscribe(response => {
          this.regService.commonService.hideLoader('checkUsernameExist');
          // if (response.ResponseData == 0) {
          if (((response.ResponseData && response.ResponseData.Id == 0) || (!response.ResponseData)) && response.ResponseStatus == "OK") {
            this.currentUser.UserName = usernameTmp;
            this.checkedUsername.available = true;
            this.checkedUsername.valid = true;
            // this.regService.commonService.presentToast("Username '" + this.currentUser.UserName + "' is available!");
            this.saveUsername();
          }
          else {
            //SHOW ERROR of Invalid OTP //TODO
            this.currentUser.UserName = "";
            // this.regService.commonService.presentToast("Sorry, this username is already in use");
            this.checkedUsername.errorMsg = "Sorry, this username is already in use";
            this.usernameForm.controls['username'].setErrors({ 'incorrect': true });
          }
        });
    }
    else {
      this.checkedUsername.valid = false;
      this.currentUser.UserName = "";
    }
  }

  onUsernameChange(event: any) {
    console.log("onUsernameChange", event);

    // if (this.currentUser.UserName && this.currentUser.UserName.length() >= AppConstants.MIN_USERNAME_LENGTH) {
    //   let currTime = new Date().getTime();
    //   if (!this.lastUNameCheckTime || (this.lastUNameCheckTime && currTime - this.lastUNameCheckTime >= AppConstants.INPUT_CHANGE_MIN_INTERVAL)) {
    //     this.lastUNameCheckTime = currTime;
    //     this.checkUsernameExist();
    //   }
    // }
    // else {

    // }
    // this.lastUNameCheckTime = new Date().getTime();
    // this.checkUsernameExist();
    let usernameTmp = event.detail.value;

    if (usernameTmp && usernameTmp.length >= AppConstants.MIN_USERNAME_LENGTH) {
      var pattern = new RegExp(AppConstants.USERNAME_REGEX_VALIDATION);
      console.log("Patern---", pattern.test(usernameTmp))
      if (pattern.test(usernameTmp)) {
        this.checkedUsername.errorMsg = "Invalid UserName";
        this.checkedUsername.valid = true;

      }
      else {
        this.checkedUsername.errorMsg = "Please enter a valid username";
        this.checkedUsername.valid = false;
      }
    }
    else {
      this.checkedUsername.errorMsg = "Usernam should be of min " + AppConstants.MIN_USERNAME_LENGTH + " characters";
      this.checkedUsername.valid = false;
    }

  }

  emailOTPInput(event: any) {
    console.log("emailOTPInput", event);
  }

  onUserInputChange(event: any, type: string) {
    if (type == "Email") {
      this.errorMsgGrp.email = this.emailForm.value.email.length > 0 ? "Kindly enter a valid email" : "";
    }
    else if (type == "PhoneNumber") {
      this.errorMsgGrp.phone = "";
    }
    else if (type == "Username") {
      this.onUsernameChange(event);
    }
  }

  // emailIdInput(event: any) {
  //   console.log("emailOTPInput", event.detail.value);
  //   if (event.detail.value && event.detail.value.length > 4 && Vad) {

  //   }
  // }


  initForms() {
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
        // Validators.pattern(AppConstants.EMAIL_REGEX_VALIDATION)
      ]))
    });

    this.usernameForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(AppConstants.MIN_USERNAME_LENGTH),
        Validators.pattern(AppConstants.NAME_REGEX_VALIDATION)
      ]))
    });


    this.phoneForm = this.formBuilder.group({
      phoneNo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.PHONE_REGEX_VALIDATION)
      ])),
      countryId: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.passwordForm = this.formBuilder.group({
      password1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.PASSWORD_REGEX_VALIDATION)
      ])),
      password2: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.PASSWORD_REGEX_VALIDATION)
      ]))
    });

    this.passwordForm.get('password2')!.addValidators(
      this.regService.commonService.createCompareValidator(
        this.passwordForm.get('password1')!,
        this.passwordForm.get('password2')!
      )
    );

    this.nameForm = this.formBuilder.group({
      fname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.NAME_REGEX_VALIDATION)
      ])),
      lname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.NAME_REGEX_VALIDATION)
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(AppConstants.GENDER.MALE)
      ]))
    });

    this.addressForm = this.formBuilder.group({
      zipCode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(AppConstants.MIN_ZIPCODE_LENGTH)
      ])),
      addressLine1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(AppConstants.MIN_ADDRESS_LENGTH)
      ])),
      addressLine2: new FormControl('', Validators.compose([
        // Validators.required,
        // Validators.minLength(AppConstants.MIN_ADDRESS_LENGTH)
      ])),
      state: new FormControl('', Validators.compose([
        Validators.required
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  registerUser(nextStep: number) {
    this.getCurrentUser();
    this.regService.processRegistrationObj(this.currentUser);
    this.regService.commonService.showLoader('registerUser');
    this.regService.apiService.registerUser(this.currentUser)
      .subscribe(async response => {
        this.regService.commonService.hideLoader('registerUser')
        if (response.ResponseData && response.ResponseData.Success) {
          // this.regService.deleteTempUser();
          if (nextStep == this.REG_STEP.HOME) {
            // if (this.currentUser.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
            //   // this.router.navigateByUrl('/free-user-canvas-own');
            //   // this.goToHome();
            //   await this.showWelcomeDialog();
            // }
            // else if (this.currentUser.UserTypeId == AppConstants.USER_TYPE.BN_USER || this.currentUser.UserTypeId == AppConstants.USER_TYPE.NF_USER) {
            //   // this.step = this.REG_STEP.FILE_UPLOAD_REQ;
            //   this.goToHome();
            // }
            this.goToHome();
          }
          else {
            this.nextStep(nextStep);
          }
          // this.regService.commonService.presentToast("Email verification link successfully!");
        }
        else {
          //SHOW ERROR of Invalid OTP //TODO
          if (response.ResponseData?.Error && response.ResponseData?.Error.length > 0) {
            this.regService.commonService.hideLoader('registerUser');
            this.regService.commonService.presentToast(response.ResponseData.Error);
            // this.regService.commonService.//TODO Manoj show alert dialog
          }
          else {
            this.regService.commonService.hideLoader('registerUser');
            this.regService.commonService.presentToast("Sorry, error occurred during registration. Please check again later...");
          }

        }
      });

    // this.step = this.REG_STEP.EMAIL_VERIFY;//TEMPSTEP
  }

  checkEmailVerified() {
    console.log("checkEmailVerified: Call", this.currentUser.Email);
    if (this.currentUser.Email && this.currentUser.Email.length > 0) {
      this.regService.commonService.showLoader();
      let body = {
        "u_email": this.currentUser.Email,
        "EmailCode": this.currentUser.EmailCode
      }
      this.regService.apiService.checkEmailVerified(body)
        .subscribe(response => {
          this.regService.commonService.hideLoader();
          if (response.ResponseData == 1) {
            this.nextStep(this.REG_STEP.PASSWORD);
            // this.registerUser(this.REG_STEP.EMAIL);
            this.regService.commonService.presentToast("Email verified successfully!");
          }
          else {
            //SHOW ERROR of Invalid OTP //TODO
            this.regService.commonService.presentToast("Email not yet verified...");
            this.setupEmailVerifyTimer();
          }
        });
    }
    else {
      // console.log("checkEmailVerified: NOCall", this.currentUser.Email);
    }
  }

  onStateChanged(event: any) {
    console.log("onStateChanged, ", event);
    this.placesService.getCityList(event.detail.value);
  }

  /***checkUserdetailsExist generic api
   * @param type: String - PhoneNumber, Email, UserName
   */
  checkUserDetailsExist(type: String) {
    // console.log("phoneOTPInput", event);

    if (type == "Email") {
      this.emailForm.controls['email'].setErrors(null);
    }
    else {
      this.phoneForm.controls['phoneNo'].setErrors(null);
    }
    this.regService.commonService.showLoader('checkUserDetailsExist');
    let body = {
      "DetailsType": type,//"Email",  // TODO Manoj check if required???
      "DetailsValue": type == "Email" ? this.currentUser.Email : this.currentUser.PhoneNumber,
      "PhoneCode": type == "Email" ? "" : this.currentUser.PhoneCode//Address.CountryId
    }
    this.regService.apiService.checkUserDetailsExist(body)
      .subscribe(response => {
        this.regService.commonService.hideLoader('checkUserDetailsExist');
        if (((response.ResponseData && response.ResponseData.Id == 0) || (!response.ResponseData)) && response.ResponseStatus == "OK") {
          if (type == "Email") {
            // this.step = this.REG_STEP.EMAIL;
            // this.sendEmailForVerification();
            this.sendOTPOnEmail(false);
            // this.regService.commonService.presentToast("Email '" + this.currentUser.Email + "' is available!");
          }
          else {
            //PhoneNumber
            this.sendRegisterPhoneOTP(false);
          }

        }
        else {
          let errorMsg = "Sorry, this " + (type == "Email" ? "email" : "phone number") + " is already in use";
          this.regService.commonService.presentToast(errorMsg);
          if (type == "Email") {
            //SHOW ERROR of already used email
            this.errorMsgGrp.email = errorMsg;
            this.emailForm.controls['email'].setErrors({ 'incorrect': true });

          }
          else {
            //PhoneNumber
            this.errorMsgGrp.phone = errorMsg;
            this.phoneForm.controls['phoneNo'].setErrors({ 'incorrect': true });

          }

        }
      });

  }


  uploadFile() {

    // this.step = this.REG_STEP.FILE_UPLOAD_RES;
    this.pickFileFromUser();
  }

  continuePostFileUpload() {
    this.registerUser(this.REG_STEP.BUSINESS_NP_WELCOME);
  }

  // showWelcomePageBNNP() {
  //   this.nextStep(this.REG_STEP.BUSINESS_NP_WELCOME);
  // }

  fetchCurrentLocation() {
    // console.log("StateId:" + this.addressForm.value.stateId);
    // console.log("CityId:" + this.addressForm.value.cityId);
    // console.log("ZipCode:" + this.addressForm.value.zipCode);
    // console.log("AddressLine1:" + this.addressForm.value.addressLine1);
    // console.log("AddressLine2:" + this.addressForm.value.addressLine2);
    this.regService.commonService.showLoader('fetchCurrentLocation');
    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      console.log("observeReverseGeocodingResult: ", address);
      this.regService.commonService.hideLoader('fetchCurrentLocation');
      if (address) {
        this.currentUser.Address.ZipCode = address.ZipCode;
        this.currentUser.Address.AddressLine1 = address.AddressLine1;
        this.currentUser.Address.AddressLine2 = address.AddressLine2;
        this.currentUser.Address.CityId = address.CityId;
        this.currentUser.Address.StateId = address.StateId;
        this.currentUser.Address.CountryId = address.CountryId;



        //store the stage of currentUser with fetched location to later compare before saving address
        // this.currentUserWCurrLoc = this.currentUser;
        this.currentUserWCurrLoc = Object.assign({}, this.currentUser);

        this.addressForm.setValue({
          addressLine1: this.currentUser.Address.AddressLine1, addressLine2: this.currentUser.Address.AddressLine2, zipCode: this.currentUser.Address.ZipCode,
          city: "", state: ""
        });

        this.selectedState = await this.placesService.findState(address.CountryId, { id: address.StateId });
        await this.onStateSelected([this.selectedState], true, address.CityId);
      }
    });

    let currentPosSubs = this.locationService.observeCurrentPosition().subscribe((position) => {
      console.log("position", position);
      this.currentLocation = this.locationService.getCurrentCoordinate();
      console.log("REG: fetchCurrentLocation: ", this.currentLocation);
      if (this.currentLocation) {
        this.currentUser.Address.Latitude = this.currentLocation.latitude;
        this.currentUser.Address.Longitude = this.currentLocation.longitude;
        this.locationService.getAddressFromLatLng({ lat: this.currentLocation.latitude, lng: this.currentLocation.longitude });
      }
      if (!this.currentLocation) {
        console.log("REG: fetchCurrentLocation: unsubscribe");
        this.regService.commonService.hideLoader('fetchCurrentLocation');

        // currentPosSubs.unsubscribe();//TODO
      }
    });

    this.locationService.requestPermissions();
    this.locationService.fetchCurrentCoordinate();

  }

  getFileUploadLabel1() {
    let label = "To provide you with the benefits of the business account, we require proof of your business's existence. \ne.g. Utility Bill, Bank statement, Taxpayer ID number, Geotagged photo";
    if (this.selectedUserType == AppConstants.USER_TYPE.NF_USER)
      label = "To provide you with the benefits of a nonprofit account, we require proof of your organization's nonprofit status. \ne.g. Certificate of nonprofit, Tax exemption certificate";
    return label;
  }

  getFileUploadLabel2() {
    let label = "Please upload proof of business status";
    if (this.selectedUserType == AppConstants.USER_TYPE.NF_USER)
      label = "Please upload proof of nonprofit status";
    return label;
  }

  getWelcomePageLabel() {
    let label = "Thank you for your submission.\n\nWe are reviewing your business account registration and will get back to you shortly.\n\nIn the meantime, you can use your account as a limited business account with profile data entry and product section creation disabled while we review your submission.\n\nUpon approval, your account will automatically be converted into a fully functional business account with no loss of your account data.\n\nWe hope you enjoy using Finitee!";
    if (this.selectedUserType == AppConstants.USER_TYPE.NF_USER)
      label = "Thank you for your submission.\n\nWe are reviewing your nonprofit account registration and will get back to you shortly.\n\nIn the meantime, you can use your account as a limited business account with profile data entry and product section creation disabled while we review your submission.\n\nUpon approval, your account will automatically be converted into a Nonprofit account with no loss of your account data.\n\nWe hope you enjoy using Finitee!";
    return label;
  }

  getUploadedFilename() {
    return this.selectedFile ? this.selectedFile.name : "Please select file to be uploaded";
  }



  async goToHome() {
    await this.showWelcomeDialog();
    // this.login();
    // this.router.navigateByUrl('/free-user-canvas-own');
  }

  async showWelcomeDialog() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Welcome to Finitee',
      message: 'Your privacy settings are set to default. You can modify them in the settings section any time',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: 'infos',
          id: 'submit-button',
          handler: (blah) => {
            console.log('welcome dialog Continue');
            // this.goToHome();
            this.login();
          }
        }
      ]
    });

    await alert.present();
  }

  login() {
    let body = {
      Email: this.currentUser.Email,
      Password: this.currentUser.Password,
      DeviceId: 1000
    }
    this.authService.login(body).subscribe(response => {

    }, error => {
      // this.error = JSON.stringify(error);
      this.regService.commonService.presentToast(error.error.Error);
      // this.router.navigateByUrl('tabs/map');
    })
  }

  userVerifiedEmailLink() {
    this.checkEmailVerified();
  }

  getFileButtonTitle() {
    return "Upload File";//Select File": "Upload File";
  }


  async pickFileFromUser() {
    // this.captuerMedia("any", AppConstants.MEDIA_PICTURE, AppConstants.SOURCE_PHOTOLIBRARY,'banner');


    let result = await FilePicker.pickFiles({
      types: AppConstants.FILE_UPLOAD_TYPE.IMG_PDF,
      // multiple: false,
    });
    if (result && result.files.length > 0) {
      this.selectedFile = result.files[0];
      console.log("pickFileFromUser: ", this.selectedFile.name);
      console.log("pickFileFromUser: FULL: ", this.selectedFile);
      let mediaObj: any = {};
      mediaObj.name = this.selectedFile.name;
      if (this.selectedFile.blob) {
        //Means for web
        mediaObj.blob = this.selectedFile.blob;
        console.log("pickFileFromUser: mediaObj: ", mediaObj);
        await this.processSelectedFile(mediaObj);
      }
      else {
        //Means path values exist for android and ios
        this.regService.commonService.showLoader('pickFileFromUser');
        // const webPath = this.attachmentService.convertPathToWebPath(this.selectedFile.path);
        let resolvedPath = await this.attachmentService.resolveAndroidContentUri(this.selectedFile.path);
        // mediaObj.blob = await this.attachmentService.makeFileIntoBlob(resolvedPath, this.selectedFile.mimeType);
        await this.attachmentService.getBlobFromFilePath(resolvedPath, this.selectedFile.mimeType);
        this.regService.commonService.hideLoader('pickFileFromUser');
      }
      // this.step = this.REG_STEP.FILE_UPLOAD_RES;

      // console.log("pickFileFromUser: mediaObj: ", mediaObj);
      // await this.processSelectedFile(mediaObj);

    }
    else {
      this.regService.commonService.presentToast("File not selected...");
      this.selectedFile = null;
    }
  }

  async processSelectedFile(mediaObj: any) {
    if (mediaObj) {
      this.regService.commonService.hideLoader();
      await this.uploadFileToserver(mediaObj);
    }
    else {
      this.regService.commonService.hideLoader();
      this.regService.commonService.presentToast("Apologies, failed to upload the file.. some error while picking file from system");
    }
  }

  async uploadFileToserver(mediaObj: any) {
    const formData = new FormData();
    formData.append('file', mediaObj.blob, mediaObj.photoName);
    this.regService.commonService.showLoader('uploadFileToserver');
    var response: any = await this.attachmentService.uploadFileToServerv2(formData, true);
    if (response != "error") {
      var responseData = response.ResponseData;
      console.log("responseData", responseData);
      this.regService.commonService.hideLoader();
      this.nextStep(this.REG_STEP.FILE_UPLOAD_RES);
      if (responseData && responseData.length > 0)
        this.currentUser.ProofAttachmentPath = responseData[0].thumbFilePath;
      /*  responseData.forEach(async (uploadedFile: { filepath: any; }, index: number) => {
         console.log("uploadFileToserver: ", uploadedFile);
         this.currentUser.ProofAttachmentPath = uploadedFile.filepath;
       }); */
    }
    else {
      this.regService.commonService.hideLoader('uploadFileToserver');
      this.regService.commonService.presentToast("Apologies, failed to upload the file");
    }
  }


  async captuerMedia(event: any, MediaType: Number, SourceType: Number, type: string) {
    // event.stopPropagation();
    // event.preventDefault();
    // this.captureImageType = type;
    await this.attachmentService.captureMedia(MediaType, SourceType);
  }


  changeDOB(event: any, modal: any) {
    console.log(event);
    this.currentUser.DateOfBirth = event.detail.value;
    modal.dismiss()
  }

  onChangeDOB(event: any, type: string) {

    // let isValidDOB = false;//Manoj see if can remove
    this.inputDOB.showDOBError = 0;
    this.inputDOB.errorMsg = "Please enter a valid date of birth";
    console.log("OnChangeDOB: " + type + " val:" + event.detail.value + " dob:", this.inputDOB);
    if (type === "dd") {
      if (this.inputDOB.day) {
        if (this.inputDOB.day.toString().length >= 2 && (!this.inputDOB.month || this.inputDOB.month.toString().length == 0)) {
          this.inputDOBMonth.setFocus();
        }
      }
    }
    else if (type === "MM") {
      if (this.inputDOB.month) {
        if (this.inputDOB.month.toString().length >= 2 && (!this.inputDOB.year || this.inputDOB.year.toString().length == 0)) {
          this.inputDOBYear.setFocus();
        }
      }
    }
    else {
      // if (this.inputDOB.year) {
      //   if (this.inputDOB.year.toString().length >= 4) {
      //     this.inputDOBDay.setFocus();
      //   }
      // }
    }

    if (this.inputDOB.day && this.inputDOB.month && this.inputDOB.year) {
      if (this.inputDOB.year.toString().length == 4 && this.inputDOB.day.toString().length > 0 && this.inputDOB.month.toString().length > 0) {
        // this.inputDOB.day = (this.inputDOB.day.toString().length == 1 ? "0" : "") + this.inputDOB.day.toString();
        // this.inputDOB.month = (this.inputDOB.month.toString().length == 1 ? "0" : "") + this.inputDOB.month.toString();

        this.inputDOB.enteredDOBFormatted = this.inputDOB.month.toString() + "-" + this.inputDOB.day.toString() + "-" + this.inputDOB.year.toString();
        console.log("onChangeDOB: enteredDate: ", this.inputDOB.enteredDOBFormatted);
      }
    }

    if (this.inputDOB.enteredDOBFormatted.length > 0) {
      // let birthdate = formatDate(enteredDateFormatted, 'dd-MM-yyyy', "en-US");
      let birthdate = "";
      try {
        birthdate = formatDate(this.inputDOB.enteredDOBFormatted, AppConstants.DATE_FORMAT.YYYYMMDD, "en-US");
        let entertedDate = new Date(birthdate);
        if (entertedDate && this.maxDOBDate) {
          if (this.maxDOBDate.getTime() - entertedDate.getTime() >= 0) {
            if (this.minDOBDate.getTime() - entertedDate.getTime() >= 0) {
              //ghost
              this.inputDOB.showDOBError = 3;
              this.inputDOB.errorMsg = "Sorry, ghosts are not allowed to use Finitee";
            }
            else {
              // isValidDOB = true;
              this.currentUser.DateOfBirth = birthdate;
              this.inputDOB.showDOBError = 0;
            }
          }
          else {
            this.inputDOB.showDOBError = 2;
            this.inputDOB.errorMsg = "Sorry, you must be min 18 years old";
          }
        }
        else {
          // isValidDOB = false;
          // this.currentUser.DateOfBirth = "";
          this.inputDOB.showDOBError = 1;
        }
      } catch (error) {
        // this.currentUser.DateOfBirth = ""
        this.inputDOB.showDOBError = 1;
      }

      console.log("onChangeDOB: birthdate: ", this.currentUser.DateOfBirth);
    }
    else {
      this.inputDOB.showDOBError = 1;
    }

    // if (this.inputDOB.day) {
    //   if ((""+this.inputDOB.day).length >= 2) {
    //     // this.inputDOB.day = parseInt((this.inputDOB.day+"").substring(0, 2));
    //     this.inputDOB.day = (this.inputDOB.day+"").substring(0, 2);
    //   }
    // }
    // if (this.inputDOB.month) {
    //   if ((""+this.inputDOB.month).length >= 2) {
    //     // this.inputDOB.month = parseInt(this.inputDOB.month.toString().substring(0, 2));
    //     this.inputDOB.month = this.inputDOB.month.toString().substring(0, 2);
    //   }
    // }
    // if (this.inputDOB.year) {
    //   if ((this.inputDOB.year.toString()).length >= 4) {
    //     // this.inputDOB.year = parseInt(this.inputDOB.year.toString().substring(0, 4));
    //     this.inputDOB.year = this.inputDOB.year.toString().substring(0, 4);
    //   }
    // }
  }

  onCountrySelected(event: any) {
    console.log("selectedCountry: ", event);
    this.selectCountryModalRef.dismiss();
    this.selectedCountry = event[0];
    this.countrySearchableInput.preSelected = this.selectedCountry;
  }

  onSelectCountryModalDismiss(event: any) {
    this.selectCountryModalRef.dismiss();
  }

  async onStateSelected(event: any, resetCities?: boolean, setCityID?: number) {
    console.log("onStateSelected: Event: ", event);
    this.selectStateModalRef.dismiss();
    if (event[0] && this.selectedState) {
      if (this.selectedState.id != event[0].id || resetCities) {
        this.citySearchableInput.listData = [];
        this.selectedCity = null;
      }
    }
    this.selectedState = event[0];
    this.stateSearchableInput.preSelected = this.selectedState;
    // console.log("onStateSelected: selectedState: ", this.selectedState);
    if (this.selectedState) {
      // this.addressForm.setValue({stateId: this.selectedState.StateName});
      this.addressForm.controls['state'].setValue(this.selectedState.StateName);
      // this.placesService.getCityList(this.selectedState.StateId);
      await this.loadCities(this.selectedState.id);
      if (setCityID) {
        this.selectedCity = await this.placesService.findCity(this.selectedState.id, { id: setCityID });
        this.onCitySelected([this.selectedCity]);
      }
    }
  }

  async loadCities(stateId: number) {
    this.citySearchableInput.listData = await this.placesService.findCity(stateId, { all: true });
  }

  onSelectStateModalDismiss(event: any) {
    this.selectStateModalRef.dismiss();
  }

  onCitySelected(event: any) {
    console.log("onCitySelected: ", event);
    this.selectCityModalRef.dismiss();
    this.selectedCity = event[0];
    if (this.selectedCity) {
      this.addressForm.controls['city'].setValue(this.selectedCity.CityName);
    }
    this.citySearchableInput.preSelected = this.selectedCity;
  }

  onSelectCityModalDismiss(event: any) {
    this.selectCityModalRef.dismiss();
  }

  onPinLocationSubmit(event: any) {
    console.log("onPinLocationSubmit: ", event);
  }

  onPinLocationCancel(event: any) {
    console.log("onPinLocationCancel: ", event);
  }
  selectedGender($event: any) {
    this.nameForm.patchValue({ gender: $event.detail.value })
    this.seletedGender = $event.detail.value
    if ($event.detail.value == 1) this.genderInputValue = 'Male'
    if ($event.detail.value == 2) this.genderInputValue = 'Female'
    if ($event.detail.value == 3) this.genderInputValue = 'Other'
    console.log(this.nameForm.value);


  }

}
