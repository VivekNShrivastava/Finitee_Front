import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { UserProfile, getUserProfileAsPerPrivacy } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { DatePipe } from '@angular/common';
import { WorkExperience } from 'src/app/core/models/user/WorkExperience';
import { CommonService } from 'src/app/core/services/common.service';
import { DateError } from 'src/app/core/models/common';

@Component({
  selector: 'app-edit-work-page',
  templateUrl: './edit-work.page.html',
  styleUrls: ['./edit-work.page.scss'],
})
export class EditworkPage extends BasePage implements OnInit {

  getUserProfileAsPerPrivacy: getUserProfileAsPerPrivacy = new getUserProfileAsPerPrivacy();
  userProfile: UserProfile = new UserProfile();
  dateError = new DateError;
  @ViewChild('popover') popover!: IonPopover;
  isOpen = false;
  // subscription!: any;
  isList: boolean = true;
  isEdit: boolean = false;
  isCreate: boolean = false;
  pageTitle: string = 'Work';
  buttonText: string = 'Add New';

  constructor(
    private router: Router, public commonService: CommonService,
    public businessCanvasService: BusinessCanvasService,
    private authService: AuthService,
    public placeService: PlacesService,
    private navCtrl: NavController,
    public profileService: ProfileService,
    private alertController: AlertController
  ) {
    super(authService);
    this.getUserProfileAsPerPrivacy = this.router!.getCurrentNavigation()!.extras.state!['data'];
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;    
  }

  async ngOnInit() {
    if (!this.getUserProfileAsPerPrivacy.userProfile.WorkExperience) {
      this.getUserProfileAsPerPrivacy.userProfile.WorkExperience = new WorkExperience;
    }
  }

  inputDateChange() {
    this.dateError = new DateError()
  }

  async onSubmit() {
    var { WorkingMonthFrom, WorkingYearFrom, WorkingMonthToDate, WorkingYearToDate, IsCurrentWorking } = this.userProfile.user.WorkExperience;
    if(this.getUserProfileAsPerPrivacy.userProfile.WorkExperience.Privacy === 1) console.log("all-1")
    if (this.isValidDateRange(WorkingMonthFrom, WorkingYearFrom, WorkingMonthToDate, WorkingYearToDate, IsCurrentWorking)) {
      try {
        if(IsCurrentWorking){
          this.getUserProfileAsPerPrivacy.userProfile.WorkExperience.WorkingMonthToDate = '';
          this.getUserProfileAsPerPrivacy.userProfile.WorkExperience.WorkingYearToDate = '';
        }
        const result = await this.profileService.AddUserWork(this.getUserProfileAsPerPrivacy.userProfile.WorkExperience);
        if (result) {
          this.isCreate = false;
          this.isEdit = false;
          this.isList = true;
          this.pageTitle = 'Work';
          this.buttonText = 'Add New';
          this.navCtrl.pop();
        } else {
           this.commonService.presentToast('Unable to add/update work experience.');
        }
      } catch (error) {
        // Handle any errors that occurred during the API call.
        console.error('Error while adding/updating work experience:', error);
        this.commonService.presentToast('Something went wrong. Please try again later.');
      }
    }
  }

  async deleteWork(obj: any) {
    const alert = await this.alertController.create({
      header: 'Delete Work',
      cssClass: 'fi-delete-alert',
      message: `Are you sure you want to delete this Work?  <div class="alert-close">
      <ion-icon name="close"></ion-icon>
    </div>`,
      buttons: [
        {
          text: 'YES',
          cssClass: 'alert-yes-button',
          role: 'confirm',
          handler: async () => {
            try {
              await this.profileService.DeleteUserWork(obj.Id);
              this.navCtrl.pop();
            } catch (error) {
            }
          },
        },
        {
          text: 'NO',
          cssClass: 'alert-no-button',
          role: 'cancel',
          handler: async () => {
            // Handle cancel action if needed.
          },
        },
      ],
    });

    await alert.present();
  }

  button() {
    if(this.getUserProfileAsPerPrivacy.userProfile.WorkExperiences?.length === 25){
      console.log("Cannot add more than 25 Experience");
      this.commonService.presentToast('Maximum Limit Reached');
    }else{
      this.isList = false;
      this.isCreate = true;
      this.pageTitle = 'Create Work';
      this.buttonText = 'Save';
    }
    
  }

  editWork(experience: any) {
    this.isEdit = true;
    this.isList = false;
    this.pageTitle = 'Edit Work';
    this.buttonText = 'Save';
    this.getUserProfileAsPerPrivacy.userProfile.WorkExperience = experience;
  }

  isValidDateRange(
    month_from: string,
    year_from: string,
    month_to: string,
    year_to: string,
    is_working: boolean
  ): boolean {
    this.dateError = new DateError();

    // Check if all four fields are missing
    if (!is_working && !month_from && !year_from && !month_to && !year_to) {
      return true;
    } if (is_working && !month_from && !year_from && !month_to && !year_to) {
      this.dateError.is_date_from_error = true;

      return false;
    }

    // Check if either 'month_from' or 'year_from' is missing
    if (!month_from && !year_from) {
      if (!is_working && (month_to || year_to)) {
        this.dateError.is_date_from_error = true;
        return false;
      }
    }

    // If is_working is true, only check month_from and year_from
    if (is_working && month_from && year_from) {
      return true;
    }

    // Check if 'month_to' or 'year_to' is missing
    if (!is_working && (!month_to || !year_to)) {
      this.dateError.is_date_to_error = true;
      return false;
    }
    const parsedMonthFrom = parseInt(month_from, 10);
    const parsedYearFrom = parseInt(year_from, 10);
    const parsedMonthTo = parseInt(month_to, 10);
    const parsedYearTo = parseInt(year_to, 10);
    if (
      !isNaN(parsedMonthFrom) &&
      !isNaN(parsedYearFrom) &&
      (!is_working || (is_working && !isNaN(parsedMonthTo) && !isNaN(parsedYearTo)))
    ) {
      const fromDate = new Date(parsedYearFrom, parsedMonthFrom - 1); // Months are 0-based in JavaScript Date

      if (is_working || (!isNaN(parsedMonthTo) && !isNaN(parsedYearTo))) {
        const toDate = new Date(parsedYearTo, parsedMonthTo - 1);

        if (toDate >= fromDate) {
          return true;
        }
      } else {
        return true; // When is_working is true and month_to and year_to are missing, consider it as a valid range.
      }
    }
    this.dateError.is_date_to_error = true;
    return false;
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
 
}
