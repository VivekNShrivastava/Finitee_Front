import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AnimationController, IonModal, Platform } from '@ionic/angular';
import { NgOtpInputComponent } from 'ng-otp-input';
import { interval, map, Observable, Subscription, take } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { AuthService } from 'src/app/core/services/auth.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { App } from '@capacitor/app';
import { LocationService } from 'src/app/core/services/location.service';
import { Device } from '@capacitor/device';




const secTimer = interval(1000);
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  backPressTimeStamp!: any;
  loginForm!: FormGroup;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  screenStack: number[] = [];
  captcha: any;
  tempUser: any;

  // forgotPasswordEmailForm!: FormGroup;
  // error: any
  validEmailOTP: string = "";
  emailOTPCode: number = 0;
  inputTypePhone: boolean = false;
  numberPatten!: RegExp;
  selectedCountry!: any;
  countrySearchableInput!: SelectSearchableInput;
  isCountryModalOpen: boolean = false;
  uuid: string = "";
  // isOtpModalOpen: boolean = false;
  otpTimer = {
    secs: AppConstants.DEFAULT_OTP_TIMEOUT,
    msg: ""
  }
  errorMsgGrp = {
    login: "",
    emailForgotPwd: "Kindly enter a valid email",
    emailOTP: "",
    password: "Password should be min 8 chars",
    loginResponse: ""
  }
  otpTimeout = secTimer.pipe(take(AppConstants.DEFAULT_OTP_TIMEOUT));
  // emailTimeout = emailTimer.pipe( take(10));
  otpSubscription!: Subscription;
  @ViewChild('selectCountryModal') selectCountryModalRef!: IonModal;
  @ViewChild('otpModal') otpModalRef!: IonModal;
  @ViewChild('emailModal') emailModalRef!: IonModal;
  @ViewChild('phoneOTPInputComp') phoneOTPInputRef!: NgOtpInputComponent;
  // @ViewChild('forgotPasswordModal') forgotPasswordModal!: IonModal;

  pluginBackListener!: any;
  LOGIN_STEP = {
    LOGIN: 1,
    PHONE_OTP: 2,
    EMAIL: 3,
    EMAIL_OTP: 4,
    PASSWORD: 5,
  }
  step: any = 1;

  constructor(
    public formBuilder: FormBuilder, private locationService: LocationService,
    private authService: AuthService,
    private router: Router,
    public regService: RegistrationService,
    public placesService: PlacesService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.logDeviceInfo();
    
    this.numberPatten = new RegExp(AppConstants.ALL_COUNTRY_REGEX_VALIDATION);
    this.initForms();
    this.nextStep(this.LOGIN_STEP.LOGIN);
    this.setUpCountry();

    // this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
    //   console.log("Login: Platform Back Pressed");
    //   this.back();//TODO check for more conditions
    // });

    this.initAppBackButton();
    // this.forgotPasswordEmailForm = this.formBuilder.group({
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern(AppConstants.EMAIL_REGEX_VALIDATION)
    //   ]))
    // });
  }
  async logDeviceInfo () {
    const info = await Device.getId();
    this.uuid = info.identifier;
    console.log("info", info);
  };

  ngOnDestroy() {
    this.unsubscribeEvnets();
  }

  unsubscribeEvnets() {
    if (this.otpSubscription) {
      this.otpSubscription.unsubscribe();
    }

    if (this.pluginBackListener) {
      this.pluginBackListener.remove();
    }
  }

  async ionViewDidEnter() {
    // this.setUpModalDismiss();
    // this.tempUser = await this.regService.getTempUser();
    // if (this.tempUser) {
    //   console.log("Temp user: ", this.tempUser);
    // }
  }

  initAppBackButton() {

    // this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
    //   console.log("Login: Platform Back Pressed A");
    //   let result = this.back();//TODO check for more conditions
    // });

    this.pluginBackListener = App.addListener('backButton', ({ canGoBack }) => {
      console.log("Login: Platform Back Pressed B ", canGoBack);
      let result = this.back();//TODO check for more conditions
      console.log("Login: Platform Back Pressed B result ", result);
      if (!result) {
        // if(canGoBack){
        //   window.history.back();
        // } else {
        //   App.exitApp();
        // }
        // if(canGoBack){
        // window.history.back();
        // } else {
        let currentTime = new Date();
        if (this.backPressTimeStamp && currentTime.getTime() - this.backPressTimeStamp.getTime() < AppConstants.PRE_APP_EXIT_DURATION) {
          App.exitApp();
        }
        else {
          this.backPressTimeStamp = new Date();
          this.regService.commonService.presentToast("Press back again to exit -- Login");
        }
        // }
        // App.exitApp();
      }
    });

  }

  initForms() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.EMAIL_REGEX_VALIDATION)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(AppConstants.PASSWORD_REGEX_VALIDATION)
      ])),
      // recaptchaReactive: new FormControl(null, Validators.required),
      // remember: new FormControl('false'),
    });

    this.emailForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
        // Validators.pattern(AppConstants.EMAIL_REGEX_VALIDATION)
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
  }

  // setUpModalDismiss() {
  //   this.selectCountryModalRef.onDidDismiss().then(data => {
  //     this.isCountryModalOpen = false;
  //     console.log('selectCountryModalRef: onDidDismiss anydata:', data);
  // })
  // }

  login() {

    this.loginForm.controls['email'].setErrors(null);
    this.errorMsgGrp.loginResponse = "";
    
    let body: any = {
      Email: this.loginForm.value.email.trim(),
      Password: this.loginForm.value.password,
      DeviceId: this.uuid
    }
    if (this.inputTypePhone) {
      body = {
        PhoneCode: this.selectedCountry.PhoneCode,
        PhoneNumber: this.loginForm.value.email.trim(),

        Password: this.loginForm.value.password,
        DeviceId: this.uuid
      }
      // console.log("phone num: ", this.loginForm.value.email)
      // console.log("phone num: ", this.loginForm.value.email.trim())
    }
    // console.log("email num: ", this.loginForm.value.email)
    // console.log("email num: ", this.loginForm.value.email.trim())
    // this.regService.commonService.showloader = true;
    // this.regService.commonService.showLoader();
    // this.regService.commonService.showLoader();

    this.regService.commonService.showLoader();
    this.authService.login(body, this.inputTypePhone)
    .subscribe({
      next: (response) => {
        this.regService.commonService.hideLoader();
        console.log("loginResponse: ", response);
        this.locationService.getCurrencyByCountry();
      },
      error: (error) => {
        this.regService.commonService.hideLoader();
        this.errorMsgGrp.login = error.error.Error;
        this.errorMsgGrp.loginResponse = error.error.Error;
        console.log("loginResponse: Error: ", error);
      },
      // complete: () => {
      //   this.regService.commonService.hideLoader();
      // }
    });

      


    // this.regService.commonService.showLoader();
    // this.authService.login(body, this.inputTypePhone)
    // .subscribe(
    //   response => {
    //     console.log("loginResponse: ", response);
    //     this.locationService.getCurrencyByCountry();
    //   },
    //   error => {
    //     console.log("loginResponse: Error: ", error);
    //     this.handleError(error);
    //   },
    //   () => {
    //     // This block will be executed regardless of success or error
    //     console.log("eding..")
    //     this.regService.commonService.hideLoader();
    //   }
    // );
  }


  createAccount(tempUser?: boolean) {
    if (tempUser) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          tempUser: true
        }
      };
      this.router.navigate(['/register'], navigationExtras);
    }
    else
      this.router.navigateByUrl('/register');

  }

  onInputChange(event: any, type: string) {
    if (type === "email") {// || type === "password") {
      this.loginForm.controls['email'].setErrors(null);
      this.inputTypePhone = this.numberPatten.test(event.detail.value);
      // console.log("onEmailInputChange: "+this.inputTypePhone+" ->" + event.detail.value);
      this.loginForm.controls['email'].setValidators(Validators.compose([
        Validators.required,
        Validators.pattern(this.inputTypePhone ? AppConstants.ALL_COUNTRY_REGEX_VALIDATION : AppConstants.EMAIL_REGEX_VALIDATION)
      ]))
    }
    else if (type === "emailForgotPwd") {
      // this.emailForm.controls['email'].setErrors(null);
      this.errorMsgGrp.emailForgotPwd = "Kindly enter a valid email";
    }
    else if (type === "changePassword1") {
      this.errorMsgGrp.password = "Password should be min 8 chars with atleast one small letter, capital letter, number & a special character";
    }

  }

  sendSignInOTP() {
    // this.nextStep(this.LOGIN_STEP.PHONE_OTP);
    // this.step = this.LOGIN_STEP.PHONE_OTP;
    // this.isOtpModalOpen = true;
    // console.log("sendSignInOTP: ", this.isOtpModalOpen);
    this.sendLoginPhoneOTP(false);

    // this.regService.commonService.presentToast("Coming soon...");
  }

  async setUserDefaultCountryId() {
    let defaultCountryId = this.placesService.getDefaultCountryId();
    // console.log("log", defaultCountryId);
    // this.phoneForm.setValue({ countryId: defaultCountryId, phoneNo: "" });
    this.selectedCountry = await this.placesService.findCountry({ id: defaultCountryId });
    // }
  }

  // ionViewDidEnter() {
  //   console.log("ionViewDidEnter");
  //   // setTimeout(() => {
  //   //   this.setUpCountry();
  //   // }, 2000);
  //   // this.setUpCountry();
  // }

  async setUpCountry() {
    console.log("setUpCountry: start");
    let countryList = await this.placesService.findCountry({ all: true });
    await this.setUserDefaultCountryId();
    console.log("setUpCountry: setUserDefaultCountryId, ", this.selectedCountry);
    this.countrySearchableInput = new SelectSearchableInput();
    this.countrySearchableInput.listData = countryList;
    this.countrySearchableInput.title = "Select country";
    this.countrySearchableInput.searchPlaceholder = "Search country";
    this.countrySearchableInput.searchable = true;
    this.countrySearchableInput.preSelected = this.selectedCountry;
    this.countrySearchableInput.dataKeyMap = { title: "CountryName", srno: "PhoneCode", id: "CountryId", icon: "CountryName", detail: "" };
  }

  onCountrySelected(event: any) {
    console.log("selectedCountry: ", event);
    this.isCountryModalOpen = false;
    this.selectCountryModalRef.dismiss();
    this.selectedCountry = event[0];
  }

  onSelectCountryModalDismiss(event: any) {
    console.log("onSelectCountryModalDismiss, ", event);
    this.isCountryModalOpen = false;
    this.selectCountryModalRef.dismiss();
  }

  forgotPassword() {
    this.nextStep(this.LOGIN_STEP.EMAIL);
  }

  forgotPasswordSubmit() {

  }

  openCountryDialog() {
    this.isCountryModalOpen = true;
  }

  otpInputChange(event: any) {
    if (event && event.length == 6) {
      if (this.step == this.LOGIN_STEP.PHONE_OTP) {
        this.phoneOTPInput(event);
      } else {
        this.verifyOTPSentOnMail(event);
      }
    }
  }

  /**Note: better implementation of API call consumption, to be used elsewhere
   * VerifyOTPEnteredByUser
   * @param event any will consist of OTP code
   */
  phoneOTPInput(event: any) {
    // console.log("phoneOTPInput", event);
    // if (event && event.length == 6) {
    this.regService.commonService.showLoader();
    let body = {
      OTP: event,  // Code
      PhoneCode: this.selectedCountry.PhoneCode,
      PhoneNumber: this.loginForm.value.email,
    }
    this.regService.apiService.verifyLoginPhoneOTP(body)
      .subscribe({
        next: response => {
          console.log("phoneOTPInput: Response: ", response);
          this.regService.commonService.hideLoader();
          if (response && response.IsValid && response.AccessToken.length > 0) {
            // this.isOtpModalOpen = false;
            this.nextStep(this.LOGIN_STEP.LOGIN);
            this.regService.commonService.presentToast("OTP Verified Successfully!");
            setTimeout(() => {
              this.authService.proceedWithLogin(response);
            }, AppConstants.MODAL_ANIMATION_DURATION);//TODO: Other option is to call proceedwithLogin onmodaldismiss... TBC
          }
          else {
            //SHOW ERROR of Invalid OTP //TODO
            // this.isOtpModalOpen = true;
            this.regService.commonService.presentToast("Invalid OTP!");
          }
          // this.regService.commonService.hideLoader();
        },
        error: errorMsg => {
          console.log("phoneOTPInput: Response error: ", errorMsg);
          this.regService.commonService.hideLoader();
          // this.isOtpModalOpen = true;
          this.regService.commonService.presentToast(errorMsg);
        }
      });
    // }
  }


  // changePhoneNo() {
  //   this.isOtpModalOpen = false;
  // }

  resendOTP() {
    //TODO: Make OTP blank
    this.phoneOTPInputRef.setValue("");
    if (this.step === this.LOGIN_STEP.PHONE_OTP) {
      this.sendLoginPhoneOTP(true);
    }
    else {
      this.sendOTPOnEmail(true);
    }

  }

  sendLoginPhoneOTP(resentOTP: boolean) {
    this.regService.commonService.showLoader();
    // this.setUserDefaultCountryId();
    let body = {
      PhoneCode: this.selectedCountry.PhoneCode,
      PhoneNumber: this.loginForm.value.email,
    }

    this.regService.apiService.sendLoginPhoneOTP(body)
      .subscribe(response => {
        this.regService.commonService.hideLoader()
        if (response.ResponseData && response.ResponseData.Success && response.ResponseStatus == "OK") {//TODO Manoj Check and change
          // this.isOtpModalOpen = true;
          // this.step = this.LOGIN_STEP.PHONE_OTP;
          this.nextStep(this.LOGIN_STEP.PHONE_OTP);
          // if (response.ResponseStatus == "OK") {
          this.regService.commonService.presentToast("OTP Sent to entered number");
          if (!resentOTP) {
            // this.nextStep(this.REG_STEP.PHONE_OTP);
          }
          this.setOTPTimer();
          this.placesService.getStateList(this.selectedCountry.CountryId);//TODO Manoj check if required here
        }
        else {
          // this.isOtpModalOpen = false;
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

  resetFormValues() {
    this.passwordForm.setValue({ password1: "", password2: "" });
    this.emailForm.setValue({ email: "" });

  }

  changeEmail() {
    this.step = this.LOGIN_STEP.EMAIL;
  }

  back() {
    let actionDone = false;
    console.log("Login: Go Back: A: " + this.step, this.screenStack);
    if (this.step == this.LOGIN_STEP.LOGIN) {
      this.router.navigateByUrl('/');
      // actionDone = true;
      // LocationStrategy.back(); //TODO Manoj check
    }
    else {
      // this.step = this.step - 1;
      let topStep = this.step;
      if (this.screenStack.length > 0) {
        topStep = this.screenStack.pop();
        console.log("Login: Go Back topStep:", topStep);
        if (this.screenStack.length > 0) {
          this.step = this.screenStack[this.screenStack.length - 1];
        }
        else {
          //else????
        }
        // if (topStep && topStep === this.step) {
        //   this.step = this.screenStack.pop();
        // }
        actionDone = true;
      }
      console.log("Login: Go Back: B: " + this.step, this.screenStack)
      if (this.screenStack.length == 0) {
        this.screenStack.push(this.step);
      }
      console.log("Login: Go Back: C: " + this.step, this.screenStack)
      console.log("Reg: DisplayedStep ", this.step)
    }
    return actionDone;

  }

  nextStep(stepNo: number, resetPreviousStep?: number) {
    console.log("Login nextStep A step:" + this.step + " resetPrevious:" + resetPreviousStep + " stack:", this.screenStack);
    if (resetPreviousStep) {
      let previousStepFound = false;
      let topStep = this.screenStack.pop();
      while (topStep && topStep != resetPreviousStep) {
        topStep = this.screenStack.pop();
      }
      previousStepFound = topStep == resetPreviousStep;
      if (previousStepFound || !topStep) {
        this.screenStack.push(resetPreviousStep);
      }
    }
    this.step = stepNo;
    console.log("Login nextStep B step:" + this.step + " resetPrevious:" + resetPreviousStep + " stack:", this.screenStack);
    if (stepNo == this.LOGIN_STEP.LOGIN) {
      this.screenStack = []
    }
    else {
      let topStep = this.screenStack.pop();
      if (topStep && topStep != stepNo) {
        this.screenStack.push(topStep);
      }
    }
    this.screenStack.push(this.step);
    console.log("Login nextStep C step:" + this.step + " resetPrevious:" + resetPreviousStep + " stack:", this.screenStack);
  }

  onModalDismissed(event: any, step: any) {
    console.log("onModalDismissed: " + step + " :", event);
    if (step == -1) {
      this.isCountryModalOpen = false;
    }
  }

  getChangeNumberEmailButtonLabel() {
    return this.step === this.LOGIN_STEP.PHONE_OTP ? "Change Phone number" : "Change email";
  }

  sendOTPOnEmail(event: any) {
    console.log("sendOTPOnEmail", event);
    this.emailOTPCode = 0;
    this.regService.commonService.showLoader();
    let body = {
      Email: this.emailForm.value.email,
    }
    this.regService.apiService.sendOTPOnEmail(body)
      .subscribe({
        next: response => {
          console.log("sendOTPOnEmail: Response: ", response);
          this.regService.commonService.hideLoader();
          if (this.regService.apiService.isAPISuccessfull(response)) {
            this.emailOTPCode = response.ResponseData.EmailOTPCode;
            this.nextStep(this.LOGIN_STEP.EMAIL_OTP)
            this.regService.commonService.presentToast("OTP sent to entered email.. Kindly check");
            this.setOTPTimer();

          }
          else {
            this.emailOTPCode = 0;
            this.emailForm.controls['email'].setErrors({ 'incorrect': true });
            let errorMsg = "Sorry, the entered email is not registered...";
            this.errorMsgGrp.emailForgotPwd = errorMsg;
            this.regService.commonService.presentToast(errorMsg);
          }
        },
        error: errorMsg => {
          this.emailOTPCode = 0;
          console.log("sendOTPOnEmail: Response error: ", errorMsg);
          this.regService.commonService.hideLoader();
          this.regService.commonService.presentToast(errorMsg);
          this.errorMsgGrp.emailForgotPwd = errorMsg;
          this.emailForm.controls['email'].setErrors({ 'incorrect': true });
        }
      });
  }

  verifyOTPSentOnMail(event: any) {
    this.validEmailOTP = "";
    // console.log("changePasswordViaEmailOTP", event);
    if (event && event.length == 6) {
      this.errorMsgGrp.emailOTP = "";
      this.regService.commonService.showLoader();
      let body = {
        OTP: event,  // Code
        Email: this.emailForm.value.email,
      }
      this.regService.apiService.verifyOTPSentOnMail(body)
        .subscribe({
          next: response => {
            console.log("verifyOTPSentOnMail: Response: ", response);
            this.regService.commonService.hideLoader();
            // if (this.regService.apiService.isAPISuccessfull(response) && response.ResponseData === 1) {
            if (response.Success) {
              this.validEmailOTP = event;
              this.nextStep(this.LOGIN_STEP.PASSWORD, this.LOGIN_STEP.EMAIL);
              this.regService.commonService.presentToast("OTP Verified Successfully!");
            }
            else {
              //SHOW ERROR of Invalid OTP //TODO
              // this.regService.commonService.presentToast("Invalid OTP!");
              // this.emailForm.controls['email'].setErrors({ 'incorrect': true });
              let errorMsg = "Invalid OTP!";
              this.errorMsgGrp.emailOTP = errorMsg;
              this.regService.commonService.presentToast(errorMsg);
            }
            // this.regService.commonService.hideLoader();
          },
          error: errorMsg => {
            console.log("changePasswordViaEmailOTP: Response error: ", errorMsg);
            this.regService.commonService.hideLoader();
            this.regService.commonService.presentToast(errorMsg);
            this.errorMsgGrp.emailOTP = errorMsg;
            // this.emailForm.controls['email'].setErrors({ 'incorrect': true });
          }
        });
    }
  }

  changePassword(event: any) {
    console.log("changePassword", event);
    this.regService.commonService.showLoader();
    let body = {
      Email: this.emailForm.value.email,
      OTP: this.validEmailOTP,
      EmailCode: this.emailOTPCode,
      NewPassword: this.passwordForm.value.password1,
      ConfirmNewPassword: this.passwordForm.value.password2
    }
    this.regService.apiService.changePasswordViaEmailOTP(body)
      .subscribe({
        next: response => {
          console.log("changePassword: Response: ", response);
          this.regService.commonService.hideLoader();
          if (this.regService.apiService.isAPISuccessfull(response) && response.ResponseData.Success) {
            this.nextStep(this.LOGIN_STEP.LOGIN)
            this.regService.commonService.presentToast("Password changed successfully!");
            this.resetFormValues();

          }
          else {
            this.passwordForm.controls['password1'].setErrors({ 'incorrect': true });
            let errorMsg = (response.ResponseData && response.ResponseData.Error && response.ResponseData.Error.length > 0) ? response.ResponseData.Error : "Invalid OTP!";
            this.errorMsgGrp.password = errorMsg;
            this.regService.commonService.presentToast(errorMsg);
          }
        },
        error: errorMsg => {
          console.log("sendOTPOnEmail: Response error: ", errorMsg);
          this.regService.commonService.hideLoader();
          this.regService.commonService.presentToast(errorMsg);
          this.errorMsgGrp.password = errorMsg;
          this.passwordForm.controls['password1'].setErrors({ 'incorrect': true });
        }
      });
  }
}
