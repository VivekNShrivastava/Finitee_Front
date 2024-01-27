import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { UserProfile, getUserProfileAsPerPrivacy } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { PlacesService } from 'src/app/core/services/places.service';

import { DatePipe } from '@angular/common';
import { Education } from 'src/app/core/models/user/WorkExperience';
import { CommonService } from 'src/app/core/services/common.service';
import { DateError } from 'src/app/core/models/common';


@Component({
  selector: 'app-edit-education-page',
  templateUrl: './edit-education.page.html',
  styleUrls: ['./edit-education.page.scss'],
})
export class EditeducationPage extends BasePage implements OnInit, OnDestroy {
  getUserProfileAsPerPrivacy: getUserProfileAsPerPrivacy = new getUserProfileAsPerPrivacy();
  userProfile: UserProfile = new UserProfile();

  dateError = new DateError;
  loaded: boolean = false;

  isList: boolean = true;
  isEdit: boolean = false;
  isCreate: boolean = false;

  pageTitle: string = 'Education';
  buttonText: string = 'Add New';

  fromDateInputError = false;
  toDateInputError = false;
  valueInputError = false;

  constructor(
    private router: Router,

    public profileService: ProfileService, public commonService: CommonService,
    private authService: AuthService,
    public placeService: PlacesService, private datePipe: DatePipe,
    private navCtrl: NavController,
    private alertController: AlertController,
  ) {
    super(authService);
    this.getUserProfileAsPerPrivacy = this.router!.getCurrentNavigation()!.extras.state!['data'];
  }

  async ngOnInit() {

    this.loaded = false;
    if (!this.getUserProfileAsPerPrivacy.userProfile.Education) {
      this.getUserProfileAsPerPrivacy.userProfile.Education = new Education;
    }

  }
  @ViewChild('popover') popover!: IonPopover;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }


  getFormattedDate(month: string = '', year: string = ''): string {
    if (!month || !year) return '';

    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month);

    if (isNaN(parsedYear) || isNaN(parsedMonth)) return '';

    const date = new Date(parsedYear, parsedMonth - 1); // Subtract 1 from the month to get the correct date object
    const datePipe = new DatePipe('en'); // Replace 'en' with your desired locale

    return datePipe.transform(date, 'MMM yyyy') || '';
  }


  async onSubmit() {
    const { EducationMonthFrom, EducationYearFrom, EducationMonthToDate, EducationYearToDate } = this.getUserProfileAsPerPrivacy.userProfile.Education;
    if (this.isValidDateRange(EducationMonthFrom, EducationYearFrom, EducationMonthToDate, EducationYearToDate)) {
      var result = await this.profileService.saveEducationProfile(this.getUserProfileAsPerPrivacy.userProfile.Education);
      if (result) {
        this.navCtrl.pop();
        this.isCreate = false;
        this.isEdit = false;
        this.isList = true;
        this.pageTitle = 'Education';
        this.buttonText = 'Add New';
      }
    }

  }
  inputDateChange() {
    this.dateError = new DateError
  }

  // isValidDateRange(
  //   month_from: string,
  //   year_from: string,
  //   month_to: string,
  //   year_to: string
  // ): boolean {
  //   this.dateError = new dateError;

  //   if (!month_from || !year_from) {
  //     if (month_to && year_to) {
  //       this.dateError.is_date_from_error = true;
  //       return false;
  //     }
  //     return true;
  //   }

  //   const parsedMonthFrom = parseInt(month_from, 10);
  //   const parsedYearFrom = parseInt(year_from, 10);
  //   const parsedMonthTo = parseInt(month_to, 10);
  //   const parsedYearTo = parseInt(year_to, 10);

  //   if (!isNaN(parsedMonthFrom) && !isNaN(parsedYearFrom) && !isNaN(parsedMonthTo) && !isNaN(parsedYearTo)) {
  //     const fromDate = new Date(parsedYearFrom, parsedMonthFrom - 1); // Months are 0-based in JavaScript Date
  //     const toDate = new Date(parsedYearTo, parsedMonthTo - 1);

  //     if (toDate >= fromDate) {
  //       return true;
  //     }
  //   }

  //   this.dateError.is_date_to_error = true;
  //   return false;
  // }



  isValidDateRange(
    month_from: string,
    year_from: string,
    month_to: string,
    year_to: string
  ): boolean {
    this.dateError = new DateError;

    // Check if all four fields are missing
    if (!month_from && !year_from && !month_to && !year_to) {
      return true;
    }
    // Check if either 'month_from' or 'year_from' is missing
    if (!month_from && !year_from) {
      if (month_to && year_to) {
        this.dateError.is_date_from_error = true;
        return false;
      }
    }
    // Check if 'month_to' or 'year_to' is missing
    if (!month_to && !year_to) {
      this.dateError.is_date_to_error = true;
      return false;
    }

    const parsedMonthFrom = parseInt(month_from, 10);
    const parsedYearFrom = parseInt(year_from, 10);
    const parsedMonthTo = parseInt(month_to, 10);
    const parsedYearTo = parseInt(year_to, 10);

    if (!isNaN(parsedMonthFrom) && !isNaN(parsedYearFrom) && !isNaN(parsedMonthTo) && !isNaN(parsedYearTo)) {
      const fromDate = new Date(parsedYearFrom, parsedMonthFrom - 1); // Months are 0-based in JavaScript Date
      const toDate = new Date(parsedYearTo, parsedMonthTo - 1);

      if (toDate >= fromDate) {
        return true;
      }
    }
    this.dateError.is_date_to_error = true;
    return false;
  }




  viewChangeButton() {
    if(this.getUserProfileAsPerPrivacy.userProfile.Educations?.length === 25){
      this.commonService.presentToast('Maximum Limit Reached');
    }else{
      this.isList = false;
      this.isCreate = true;
      this.pageTitle = 'Create Education';
      this.buttonText = 'Save';
    }
    
  }

  editEducation(education: any) {
    this.isEdit = true;
    this.isList = false;
    this.pageTitle = 'Edit Education';
    this.buttonText = 'Save';
    this.getUserProfileAsPerPrivacy.userProfile.Education = education;
  }

  async deleteEducation(obj: any) {
    const alert = await this.alertController.create({
      header: 'Delete Education',
      cssClass: 'fi-delete-alert',
      message: `Are you sure you want to delete this Education? <div class="alert-close">
      <ion-icon name="close"></ion-icon>
    </div>`,
      buttons: [
        {
          text: 'YES',
          cssClass: 'alert-yes-button',
          role: 'confirm',
          handler: async () => {
            await this.profileService.DeleteUserEducation(obj.Id);
            this.navCtrl.pop();
          },
        },
        {
          text: 'NO',
          cssClass: 'alert-no-button',
          role: 'cancel',
          handler: async () => {

          },
        },
      ],
    });
    await alert.present();
  }

  // onChangeStartDate(event: any, type: string) {

  //   // let isValidStartDate = false;//Manoj see if can remove
  //   this.inputStartDate.showStartDateError = 0;
  //   this.inputStartDate.errorMsg = "Please enter a valid date";
  //   console.log("OnChangeStartDate: " + type + " val:" + event.detail.value + " StartDate:", this.inputStartDate);
  //   if (type === "MM") {
  //     if (this.inputStartDate.month) {
  //       if (this.inputStartDate.month.toString().length >= 2  && (!this.inputStartDate.year || this.inputStartDate.year.toString().length == 0)) {
  //         this.inputStartYear.setFocus();
  //       }
  //     }
  //   }


  //   if (this.inputStartDate.month && this.inputStartDate.year) {
  //     if (this.inputStartDate.year.toString().length == 4 && this.inputStartDate.month.toString().length > 0) {

  //       this.inputStartDate.enteredStartDateFormatted = this.inputStartDate.month.toString() + "-" + this.inputStartDate.year.toString();
  //       console.log("onChangeStartDate: enteredDate: ", this.inputStartDate.enteredStartDateFormatted);
  //     }
  //   }

  //   if (this.inputStartDate.enteredStartDateFormatted.length > 0) {
  //     let startDate = "";
  //     try {
  //       startDate = formatDate(this.inputStartDate.enteredStartDateFormatted, AppConstants.DATE_FORMAT.YYYYMMDD, "en-US");
  //       let entertedDate = new Date(startDate);
  //       this.userProfile.user.Education.StartDate=startDate;
  //     } catch (error) {
  //       // this.currentUser.DateOfBirth = ""
  //       this.inputStartDate.showStartDateError = 1;
  //     }

  //     console.log("onChangeStartDate: birthdate: ", this.userProfile.user.Education.StartDate);
  //   }
  //   else {
  //     this.inputStartDate.showStartDateError = 1;
  //   }


  // }
  // onChangeEndDate(event: any, type: string) {

  //   // let isValidStartDate = false;//Manoj see if can remove
  //   this.inputEndDate.showEndDateError = 0;
  //   this.inputEndDate.errorMsg = "Please enter a valid date";
  //   console.log("OnChangeEndDate: " + type + " val:" + event.detail.value + " EndDate:", this.inputEndDate);
  //   if (type === "MM") {
  //     if (this.inputEndDate.month) {
  //       if (this.inputEndDate.month.toString().length >= 2  && (!this.inputEndDate.year || this.inputEndDate.year.toString().length == 0)) {
  //         this.inputEndYear.setFocus();
  //       }
  //     }
  //   }


  //   if (this.inputEndDate.month && this.inputEndDate.year) {
  //     if (this.inputEndDate.year.toString().length == 4 && this.inputEndDate.month.toString().length > 0) {

  //       this.inputEndDate.enteredEndDateFormatted = this.inputEndDate.month.toString() + "-" + this.inputEndDate.year.toString();
  //       console.log("onChangeEndDate: enteredDate: ", this.inputEndDate.enteredEndDateFormatted);
  //     }
  //   }

  //   if (this.inputEndDate.enteredEndDateFormatted.length > 0) {
  //     let EndDate = "";
  //     try {
  //       EndDate = formatDate(this.inputEndDate.enteredEndDateFormatted, AppConstants.DATE_FORMAT.YYYYMMDD, "en-US");
  //       let entertedDate = new Date(EndDate);
  //       this.userProfile.user.Education.EndDate=EndDate;
  //     } catch (error) {
  //       // this.currentUser.DateOfBirth = ""
  //       this.inputEndDate.showEndDateError = 1;
  //     }

  //     console.log("onChangeEndDate: EndDate: ", this.userProfile.user.Education.EndDate);
  //   }
  //   else {
  //     this.inputEndDate.showEndDateError = 1;
  //   }


  // }


  // delete this.userProfile.user.Id;

  // SAVE_USER_EDUCATION


  // async saveEducation() {


  //   // if (this.EducationForm.valid) {
  //   // Do something with the form data
  //   console.log(this.EducationForm.value);
  //   this.userProfile.user.Education.Degree = this.EducationForm.value.degree;
  //   this.userProfile.user.Education.EndDate = this.EducationForm.value.endDateMonth + "-" + this.EducationForm.value.endDateYear;
  //   this.userProfile.user.Education.FieldOfStudy = this.EducationForm.value.fieldOfStudy;
  //   this.userProfile.user.Education.SchoolName = this.EducationForm.value.schoolName
  //   this.userProfile.user.Education.StartDate = this.EducationForm.value.startDateMonth + "-" + this.EducationForm.value.startDateYear;

  //   var result = await this.profileService.saveEducationProfile(this.userProfile.user.Education);
  //   if (result) {
  //     // this.businessCanvasService.businessData.next(this.userProfile);
  //     this.navCtrl.pop();
  //   }
  //   // }
  // }


  checkValueInputError(): boolean {
    const fromYear = this.getUserProfileAsPerPrivacy.userProfile.Education.EducationYearFrom;
    const fromMonth = this.getUserProfileAsPerPrivacy.userProfile.Education.EducationMonthFrom;
    const toYear = this.getUserProfileAsPerPrivacy.userProfile.Education.EducationYearToDate;
    const toMonth = this.getUserProfileAsPerPrivacy.userProfile.Education.EducationMonthToDate;

    this.fromDateInputError = !this.isValidMonth(parseInt(fromMonth)) || !this.isValidYear(parseInt(fromYear));

    this.toDateInputError = !this.isValidMonth(parseInt(toMonth)) || !this.isValidYear(parseInt(toYear));


    this.valueInputError = (
      fromYear > toYear ||
      (fromYear === toYear && fromMonth >= toMonth) ||
      this.fromDateInputError ||
      this.toDateInputError
    );
    return this.fromDateInputError ||
      this.toDateInputError ||
      this.valueInputError
  }



  isValidYear(year: number): boolean {
    return /^\d{4}$/.test(year.toString());
  }

  isValidMonth(month: number): boolean {
    return /^\d{1,2}$/.test(month.toString()) && parseInt(month.toString(), 10) >= 1 && parseInt(month.toString(), 10) <= 12;
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
