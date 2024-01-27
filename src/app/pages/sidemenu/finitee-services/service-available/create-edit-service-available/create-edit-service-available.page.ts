import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { LocationService } from 'src/app/core/services/location.service';
import { PaymentService } from 'src/app/core/services/payment.service';
declare var Razorpay: any;

@Component({
  selector: 'app-create-edit-service-available',
  templateUrl: './create-edit-service-available.page.html',
  styleUrls: ['./create-edit-service-available.page.scss'],
})
export class CreateEditServiceAvailablePage extends BasePage implements OnInit {
  id?: any;
  currencySymbol?: string;
  startDate: any = {
    day: '',
    month: '',
    year: ''
  };
  startDateError: any = {
    message: '',
    is_show: false
  }
  serviceObj: FiniteeService = new FiniteeService();
  isEdit: boolean = false;

  // temp
  GeneralPrivacy: any[] = [
    {
      value: 'All Individuals/Businesses/Nonprofits'
    },
    {
      value: 'All Individual users'
    },
    {
      value: 'All Finitee users'
    },
    {
      value: 'Connections only'
    },
    {
      value: 'Connected members only'
    },
    {
      value: 'No one'
    }
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private finiteeService: FiniteeServicesService,
    private commonService: CommonService,
    private authService: AuthService, private locationService: LocationService,
    private alertCtrl: AlertController, private paymentService: PaymentService
  ) {
    super(authService);
     
    this.id = this.router!.getCurrentNavigation()!.extras!.state!['id'];
    if (this.id != undefined) {
      this.isEdit = true;
    this.getServiceAvailableById();
    } else {
      this.serviceObj = new FiniteeService();
      this.isEdit = false;
      this.getTodaysDMY();
      this.getLatlng()

      this.serviceObj.VisibleTo = this.GeneralPrivacy[0].value
    }
    
    switch (this.logInfo.UserTypeId) {
      case AppConstants.USER_TYPE.FR_USER:
        this.GeneralPrivacy = this.GeneralPrivacy.filter((item, index) => [0, 1, 3, 5].includes(index));
        break;
      case AppConstants.USER_TYPE.BN_USER:
        this.GeneralPrivacy = this.GeneralPrivacy.filter((item, index) => [2, 4, 5].includes(index));
        break;
      case AppConstants.USER_TYPE.NF_USER:
        this.GeneralPrivacy = this.GeneralPrivacy.filter((item, index) => [2, 4, 5].includes(index));
        break;

      default:
        break;
    }
    
  }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol;
    
  }

  getTodaysDMY() {
    const currentDate = new Date();
    this.startDate = {
      day: currentDate.getDate().toString(),
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString()
    };
  }

  async getServiceAvailableById() {
    try {
       
      const result = await this.finiteeService.getServiceAvailableById(this.id);
      this.serviceObj = result;
      this.getLatlng()
    } catch (error) {
    }
  }

  getLatlng() {
    this.locationService.getLatLngFromAddressType(this.serviceObj.Location)
      .then((latLng) => {
       this.serviceObj.Latitude = latLng.lat
       this.serviceObj.Longitude = latLng.lng
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  async onSubmit() {
    if (this.isEdit) {
 
        var result = await this.finiteeService.updateServiceAvailable(this.serviceObj);
        if (result) {

          const expiryOn = new Date(this.serviceObj.ExpiryOn); // Assuming sr.ExpiryOn is a valid date string or Date object
          const today = new Date();
          const totalDays = Math.ceil((expiryOn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
         this.serviceObj.DaysLeft = totalDays;
          const index = this.finiteeService.serviceList.findIndex(obj => obj.Id === this.serviceObj.Id);
          if (index !== -1) {
            this.finiteeService.serviceList[index] = this.serviceObj;
          } else {
          } 
        this.router.navigateByUrl('/service-available');
        }
      
    } else {
      if (this.serviceObj.ImageList.length > 5) {
        this.commonService.presentToast('Select maximum 5 picture/videos.');
      } else {
        const alert = await this.alertCtrl.create({
          header: "Alert",
          message: "No changes except to price can be made to the listing " +
            "once it is active. Please ensure that your listing " +
            "is final before proceeding to payment?",
          buttons: [
            {
              text: "Continue",
              cssClass: "info",
              handler: async () => {
                try {
                  this.paymentService.payment.amount = this.commonService.currentCurrency.Amount;
                  this.paymentService.makePayment();

                } catch (error) {
                  
                }
              }
            },
            {
              text: "Cancel",
              cssClass: "danger",
              handler: () => {
              },
            },
          ],
        });
        await alert.present();
      }

    }
  }

  @HostListener('window:payment.success', ['$event'])
  async onPaymentSuccess(event: any) {
    try {
      const today = new Date();
      this.serviceObj.StartDate = new Date(`${this.startDate.year}-${this.startDate.month}-${this.startDate.day}`);
      this.serviceObj.ExpiryOn = new Date(today.setDate(today.getDate() + 30));
      this.serviceObj.DaysLeft = 30;
      const result = await this.finiteeService.AddServiceAvailable(this.serviceObj);
      if (result) {
        this.serviceObj.Id = result;
        this.finiteeService.serviceList.unshift(this.serviceObj)
        this.router.navigateByUrl('/service-available')
        const alert = await this.alertCtrl.create({
          header: "Alert",
          message: 'Your payment was successful. The listing is now active.',
          backdropDismiss: false, // Disables background interaction
          buttons: [ 
            {
              text: "Dismiss",
              cssClass: "danger",
              handler: async () => {
               
              },
            },
          ],
        });
        await alert.present();
      }
    } catch (error) {

    }
  }

  @HostListener('window:payment.failed', ['$event'])
  onPaymentFeild() {
  }

  // async submit(): Promise<void> {
  //   try {
  //     if (this.isEdit) {
  //       const result = await this.finiteeService.updateServiceAvailable(this.serviceObj);
  //       if (result) {
  //       }
  //     } else {

  //       const today = new Date();
  //       this.serviceObj.StartDate = new Date(`${this.startDate.year}-${this.startDate.month}-${this.startDate.day}`);
  //       this.serviceObj.ExpiryOn = new Date(new Date(today.getDate() + 30));

  //       const result = await this.finiteeService.AddServiceAvailable(this.serviceObj);
  //       if (result) {
  //       }
  //     }
  //     this.navCtrl.pop();
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // }

  addMedia(filePath: string) {


    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.serviceObj.ImageList.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      //  console.log()
      this.serviceObj.ImageList.push(filePath);
    else
      this.serviceObj.ImageList[this.serviceObj.ImageList.length - 1] = filePath;

    // console.log(this.serviceObj.ImageList)
  }


}
