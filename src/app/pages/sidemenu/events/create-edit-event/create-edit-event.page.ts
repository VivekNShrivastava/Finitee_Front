import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { EventItem } from 'src/app/core/models/event/event';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { EventsService } from 'src/app/core/services/events.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { DatePipe } from '@angular/common';
import { LocationService } from 'src/app/core/services/location.service';
import { ModalController } from '@ionic/angular';
import { MapLocation } from 'src/app/core/components/mapLocation/mapLocation.component';
import { AddressMap } from 'src/app/core/models/places/Address';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-edit-event',
  templateUrl: './create-edit-event.page.html',
  styleUrls: ['./create-edit-event.page.scss'],
})
export class CreateEditEventPage extends BasePage implements OnInit {
  @ViewChild('form') form!: NgForm;
  eventItem: EventItem = new EventItem();
  isEdit: boolean = false;
  editItemIndex!: number;
  saveClicked: boolean = false;
  invite = false;
  eventDuration: number = 0;
  eventLocation: any;
  startTime = {
    shh: '',
    smm: '',
    sampm: ''
  };
  endTime = {
    ehh: '',
    emm: '',
    eampm: ''
  };

  startTimeError: any = {
    message: '',
    is_show: false
  }
  endTimeError: any = {
    message: '',
    is_show: false
  }
  startDateError: any = {
    message: '',
    is_show: false
  }
  _startDate: any = {
    day: '',
    month: '',
    year: ''
  }
  _endDate: any = {
    day: '',
    month: '',
    year: ''
  }
  endDateError: any = {
    message: '',
    is_show: false
  }

  constructor(
    private router: Router,
    private navCtrl: NavController, 
    private datePipe: DatePipe,
    private eventService: EventsService,
    private authService: AuthService, 
    private locationService: LocationService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    public modalController: ModalController,
  ) {
    super(authService);
    this.eventItem = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    if (this.eventItem.Id) {
      this.editItemIndex = this.router!.getCurrentNavigation()!.extras!.state!['extraParams'];
      this.isEdit = true;
      // this.eventItem.VisibleTo = this.commonService.getPrivacyFullValue(this.eventItem.VisibleTo);
    } else {
      if (this.logInfo.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
        this.appConstants.GeneralPivacy.unshift({ key: 'All Individuals, Businesses/Nonprofits', value: 'All Individuals, Businesses/Nonprofits', })
      }
    }
    this.getLatlng();
  }

  ngOnInit() {
    this.initiliazeForm();
  }


  ionViewWillEnter() {

    if (this.isEdit) {
      const dateObject: any = new Date(this.eventItem.StartDate);
      const endDateObj: any = new Date(this.eventItem.EndDate)
      if (dateObject != "Invalid Date" && endDateObj != "Invalid Date") {
        this._startDate.day = dateObject.getDate(); // Get day (1-31)
        this._startDate.month = dateObject.getMonth() + 1; // Get full month name (e.g., "August")
        this._startDate.year = dateObject.getFullYear(); // Get full year (e.g., 2023)

        this._endDate.day = endDateObj.getDate(); // Get day (1-31)
        this._endDate.month = endDateObj.getMonth() + 1; // Get full month name (e.g., "August")
        this._endDate.year = endDateObj.getFullYear(); // Get full year (e.g., 2023)
      }

      // Format start time
      this.startTime.shh = this.datePipe.transform(this.eventItem.StartDate, 'hh') as string;
      this.startTime.smm = this.datePipe.transform(this.eventItem.StartDate, 'mm') as string;
      this.startTime.sampm = this.datePipe.transform(this.eventItem.StartDate, 'a') as 'AM' | 'PM';

      // Format end time
      this.endTime.ehh = this.datePipe.transform(this.eventItem.EndDate, 'hh') as string;
      this.endTime.emm = this.datePipe.transform(this.eventItem.EndDate, 'mm') as string;
      this.endTime.eampm = this.datePipe.transform(this.eventItem.EndDate, 'a') as 'AM' | 'PM';

    } else {
      // this.eventItem.VisibleTo = this.commonService.getPrivacyFullValue("A");
      this.startTime = {
        shh: '',
        smm: '',
        sampm: 'AM'
      }; this.endTime = {
        ehh: '',
        emm: '',
        eampm: 'AM'
      };
    }
  }

  async openMap() {
    const modal = await this.modalController.create({
      component: MapLocation,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.location) {
      const { latitude, longitude } = data.location;
    }

    const latLng = {
      lat: data.location.latitude,
      lng: data.location.longitude
    }

    console.log("latnln", latLng)

    const res = await this.locationService.getAddressFromLatLng(latLng);

    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      if(address){
        this.eventLocation = address.FormattedAddress;
        const location: string = this.eventLocation;
        const add1 = location.slice(0,69);
        const add2 = location.slice(70, location.length);
        this.form.controls['AddressLine1'].setValue(add1);
        this.form.controls['AddressLine1'].markAsTouched(); // Optionally, mark the control as touched to trigger any associated validation messages
        this.form.controls['AddressLine1'].setErrors(null); // Clear any validation errors

        this.form.controls['AddressLine2'].setValue(add2);
        this.form.controls['AddressLine2'].markAsTouched();
        this.form.controls['AddressLine2'].setErrors(null);

        this.getLatlng(address);
      }     
    });
  }

  
  reversePrivacyType ( ){

  }

  privacyTypes: any = [
    {
      title: 'All Individuals/Businesses/Nonprofits'
    },
    {
      title: 'All Finitee users',
      value: 'A'
    },
    {
      title: 'Connected members',
      value: 'C'
    }
  ]

  selectedVisibleTo(data: any) {
    if(data.detail.value === "All Finitee users") this.eventItem.VisibleTo = 'A';
    else if(data.detail.value === "Connected members") this.eventItem.VisibleTo = 'C';
    else if(data.detail.value === "Only me") this.eventItem.VisibleTo = 'N';
  }

  isLeapYear(parsedYear: number): boolean {
    // const parsedYear = parseInt(year, 10);
    return (parsedYear % 4 === 0 && parsedYear % 100 !== 0) || (parsedYear % 400 === 0);
  }

  isStartDateGreaterOrEqualToToday() {
    this.startDateError.is_show = false;
    if (this._startDate || this._startDate.day || this._startDate.month || this._startDate.year) {
      const yearStr: string = this._startDate.year;
      if (yearStr.length == 4) {
        // Get the current date
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        const day: number = parseInt(this._startDate.day);
        const month: number = parseInt(this._startDate.month) - 1; // JavaScript months are 0-based
        const year: number = parseInt(yearStr);
        if ((day === 31 && (month === 1  || month === 3 || month === 5 || month === 8 || month === 10)) ||
          (day === 30 && month === 1) ||
          (day === 29 && month === 1 && !this.isLeapYear(year))) {
            this.startDateError.is_show = true;
            this.startDateError.message = "Invalid Date"
        }else{
          const startDateObj: Date = new Date(year, month, day);
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          if (!(startDateObj >= today)) {
            this.startDateError.is_show = true;
            this.startDateError.message = 'Event start date must be greater than or equal to today.';
          } else {
            if(!(startDateObj <= oneYearFromNow)){
              this.startDateError.is_show = true;
              this.startDateError.message = 'Event start date should not be more than one year from now.';
            }else this.startDateError.is_show = false;
          }
        }

        
        
      }
    }
    this.isStartTimeIsGreaterThanCurrentTime();
    this.isEndDateGreaterOrEqualToToday();
  }

  isStartTimeIsGreaterThanCurrentTime() {
    this.startTimeError.is_show = false;

    if (this.startTime.shh && this.startTime.smm && this._startDate.year && this._startDate.month && this._startDate.day) {

      if (this.isStartDateEqualToToday()) {

        const today = new Date();
        const currenTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;
        const startHours = this.convertTo24Hours(this.startTime.sampm, this.startTime.shh)

        const startTimeObj = `${startHours.toString().padStart(2, '0')}:${parseInt(this.startTime.smm).toString().padStart(2, '0')}:00`;
        if (!(startTimeObj > currenTime)) {
          this.startTimeError.is_show = true;
          this.startTimeError.message = 'Event start time must be greater than to current time.';
        } else {
          this.startTimeError.is_show = false;
        }
      } else {
        this.startTimeError.is_show = false;
      }
    }

    this.isEndTimeGreaterThanStartTime();
  }

  isEndDateGreaterOrEqualToToday(){
    this.endDateError.is_show = false;
    if(this._endDate || this._endDate.day || this._endDate.month || this._endDate.year){
      const yearStr: string = (this._endDate.year).toString();
      if(yearStr.length == 4){
        // Get the current date
        // const today: Date = new Date();
        // today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        const sday: number = parseInt(this._startDate.day);
        const smonth: number = parseInt(this._startDate.month) - 1; // JavaScript months are 0-based
        const syear: number = parseInt(this._startDate.year);
        const startDateObj: Date = new Date(syear, smonth, sday);
        const endDateObj : Date = new Date(this._endDate.year, this._endDate.month - 1, this._endDate.day);
        if (!(startDateObj <= endDateObj)) {
          this.endDateError.is_show = true;
          this.endDateError.message = 'Event End date must be greater than or equal to Start Date.';
        } else {
          const yearDiff = this._endDate.year - this._startDate.year;
          const monthDiff = this._endDate.month - this._startDate.month;
          const dayDiff = this._endDate.day - this._startDate.day;


          if(yearDiff > 0) this.eventDuration = 1;  
          else if(monthDiff > 0) this.eventDuration = 1;
          else if(dayDiff > 0) this.eventDuration = 1;
          else this.eventDuration = 0;
          const oneYearFromNow = new Date();
          oneYearFromNow.setDate(startDateObj.getDate());
          oneYearFromNow.setMonth(startDateObj.getMonth() + 1);
          oneYearFromNow.setFullYear(startDateObj.getFullYear());
          if(!(endDateObj < oneYearFromNow)){
            this.endDateError.is_show = true;
            this.endDateError.message = 'Event duration should not be more than One Month';
          }
        }
      }
    }
    this.isStartTimeIsGreaterThanCurrentTime();
    this.isEndTimeGreaterThanStartTime();
  }

  isEndTimeGreaterThanStartTime() {
    if (this.startTime.shh && this.startTime.smm && this.endTime.ehh && this.endTime.emm) {
      const startHours = this.convertTo24Hours(this.startTime.sampm, this.startTime.shh)
      const endHours = this.convertTo24Hours(this.endTime.eampm, this.endTime.ehh)

      const startTimeObj = `${startHours.toString().padStart(2, '0')}:${parseInt(this.startTime.smm).toString().padStart(2, '0')}:00`;
      const endTimeObj = `${endHours.toString().padStart(2, '0')}:${parseInt(this.endTime.emm).toString().padStart(2, '0')}:00`;
      if (!(startTimeObj < endTimeObj)) {
        if(this.eventDuration === 0){
          this.endTimeError.is_show = true;
          this.endTimeError.message = 'Event end time must be greater than to event start time.';
        }else this.endTimeError.is_show = false;
      } else {
        this.endTimeError.is_show = false;
      }
    }else this.endTimeError.is_show = false; 
    // this.isStartDateGreaterOrEqualToToday();
  }

  isStartDateEqualToToday() {
    if (
      this._startDate.day &&
      this._startDate.month &&
      this._startDate.year &&
      this.startTime.shh &&
      this.startTime.smm
    ) {
      const today = new Date();
      const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const day = parseInt(this._startDate.day);
      const month = parseInt(this._startDate.month) - 1; // JavaScript months are 0-based
      const year = parseInt(this._startDate.year);
      const startDateObj = new Date(year, month, day);

      if (
        startDateObj.getFullYear() === todayWithoutTime.getFullYear() &&
        startDateObj.getMonth() === todayWithoutTime.getMonth() &&
        startDateObj.getDate() === todayWithoutTime.getDate()
      ) {
        return true; // Return true when start date is the same as current date (without time)
      } else if (startDateObj > todayWithoutTime) {
        return false; // Return false when start date is greater than today
      } else {
        return false; // Return false when start date is earlier than today
      }
    }
    return false; // Return false if necessary data for comparison is missing
  }

  convertTo24Hours(ampm: any, hours: any): number {
    hours = parseInt(hours)
    if (ampm === 'PM') {
      hours += 12;
    }
    return hours;
  }

  async mergTimeDate() {

    try {

      this.eventItem.StartDate = new Date(`${this._startDate.year}-${this._startDate.month}-${this._startDate.day}`);
      this.eventItem.EndDate = new Date(`${this._endDate.year}-${this._endDate.month}-${this._endDate.day}`);

      if (this.startTime.shh) {
        let startHours = this.convertTo24Hours(this.startTime.sampm, parseInt(this.startTime.shh));
        this.eventItem.StartDate.setHours(startHours, parseInt(this.startTime.smm), 0, 0);
      } else {
        this.eventItem.StartDate.setHours(0, 0, 0, 0);
      }
      if (this.endTime.ehh) {
        let endtHours = this.convertTo24Hours(this.endTime.eampm, parseInt(this.endTime.ehh));
        this.eventItem.EndDate.setHours(endtHours, parseInt(this.endTime.emm), 0, 0);
      } else {
        this.eventItem.EndDate.setHours(0, 0, 0, 0);
      }
      // if(startHours){
      //   this.eventItem.StartDate = startDateTime;
      // }
      // if(endtHours){
      //   this.eventItem.EndDate = endDateTime;
      // }

    } catch (error) {
      console.error("An error occurred while merging time and date:", error);
      throw error;
    }
  }

  checkDateTimeAvailability() {

    const { shh, smm, sampm } = this.startTime;
    const { ehh, emm, eampm } = this.endTime;
    const { day, month, year } = this._startDate;

    if (day && month && year) {
      if (!(shh && smm)) {
        this.startTimeError.is_show = true;
        this.startTimeError.message = 'Start time is required.'
      } else {
        if (!(ehh && emm)) {
          this.endTimeError.is_show = true;
          this.endTimeError.message = 'End time is required.'
        }
      }
    }

    if ((shh && smm) && !(day && month && year)) {
      this.startDateError.is_show = true;
      this.startDateError.message = 'Start date is required.'
    }
    if ((ehh && emm) && !(shh && smm)) {
      this.startTimeError.is_show = true;
      this.startTimeError.message = 'Start time is required.'
    }
     
    if (day && !(month && year)) {
      this.startDateError.is_show = true;
      this.startDateError.message = 'Start date is invalid.'
    }
    if (month && !(day && year)) {
      this.startDateError.is_show = true;
      this.startDateError.message = 'Start date is invalid.'
    }
    if (year && !(month && day)) {
      this.startDateError.is_show = true;
      this.startDateError.message = 'Start date is invalid.'
    }
    if((shh && !smm) || (smm && !shh) ){
      this.startTimeError.is_show = true;
      this.startTimeError.message = 'Start time is invalid.'
    } 
       if((ehh && !emm ) || (emm && !ehh)){
      this.endTimeError.is_show = true;
      this.endTimeError.message = 'End time is invalid.'
    }
  }



  getLatlng(add?: any) {

    if(add){
      this.eventItem.Latitude = add.Latitude;
      this.eventItem.Longitude = add.Longitude;
    }else{
      var addrress = this.eventItem.AddressLine1 + this.eventItem.AddressLine2 + this.eventItem.AddressLine3;
      this.locationService.getLatLngFromAddressType('home', addrress)
        .then((latLng) => {
         this.eventItem.Latitude = latLng.lat
         this.eventItem.Longitude = latLng.lng
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    console.log("get", add, this.eventItem.Latitude, this.eventItem.Longitude)
  }

  async onSubmit() {

    this.isStartDateGreaterOrEqualToToday();
    this.checkDateTimeAvailability();
    if (this.startDateError.is_show || this.startTimeError.is_show || this.endTimeError.is_show) {

    } else {

      this.saveClicked = true;

      // delete this.eventItem.UserId;

      try {
        await this.mergTimeDate();

        console.log(this.eventItem)

        let result;
        if (this.isEdit) {
          result = await this.eventService.updateEvent(this.eventItem);
          if (result) {
            this.eventService.eventListData.next(this.editItemIndex);
          }
        } else {
          delete this.eventItem.Id;
          result = await this.eventService.createEvent(this.eventItem);
          if (result) {
            this.eventItem.Id = this.eventService.resEventID;
          }
        }

        this.eventService.eventListData.next(this.eventItem);
        this.navCtrl.pop();

      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  initiliazeForm() {
    this.saveClicked = false;
  }
  allTraits(traits: any) {
    this.eventItem.EventTraits = traits;
  }

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.eventItem.EventImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.eventItem.EventImages.push(filePath);
    else
      this.eventItem.EventImages[this.eventItem.EventImages.length - 1] = filePath;
  }
}


 