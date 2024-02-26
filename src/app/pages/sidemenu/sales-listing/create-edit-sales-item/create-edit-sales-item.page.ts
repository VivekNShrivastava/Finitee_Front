import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, PickerController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { SalesItem } from 'src/app/core/models/sales-item/sales-item';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { PlacesService } from 'src/app/core/services/places.service';
import { APIService } from 'src/app/core/services/api.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { LocationService } from 'src/app/core/services/location.service';
 
@Component({
  selector: 'app-create-edit-sales-item',
  templateUrl: './create-edit-sales-item.page.html',
  styleUrls: ['./create-edit-sales-item.page.scss'],
})
export class CreateEditSalesItemPage extends BasePage implements OnInit {
  currencySymbol?: string;
  salesItem: SalesItem = new SalesItem();
  isEdit: boolean = false;
  salesItemIndex!: number;
  saveClicked: boolean = false;
  conditionList = ['New', 'Like new', 'Refurbished', 'Used', 'Not working']
  disableFrom: boolean = false;

  userProfile: any;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private pickerCtrl: PickerController, private locationService: LocationService,
    private salesListingService: SalesListingService,
    private commonService: CommonService,
    private authService: AuthService,
    private alertCtrl: AlertController, private apiService: APIService, private paymentService: PaymentService
  ) {
    super(authService);
    this.salesItem = this.router!.getCurrentNavigation()!.extras!.state!['data'];

    this.userProfile = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('userData'))))
    this.salesItem.UserId = this.userProfile.UserId;
    if (this.salesItem.Id) {

      this.salesItemIndex = this.router!.getCurrentNavigation()!.extras!.state!['extraParams'];
      this.isEdit = true;
      this.salesItem.VisibleTo = this.commonService.getPrivacyFullValue(this.salesItem.VisibleTo);
      this.disableFrom = true;
      
    }
    else {
      if (this.logInfo.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
        this.appConstants.GeneralPivacy.unshift({ key: 'AI', value: 'All Individuals, Businesses/Nonprofits', })
      }
      this.salesItem.VisibleTo = this.appConstants.GeneralPivacy[0].value;
      this.disableFrom = false;
    }
    this.getLatlng();
  }

  currency: any = {
    country: '',
    currency_code: ''
  }
  async ionViewWillEnter() {
      
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol
  }

  privacyTypes: any = [
    {
      title: 'All Individuals, Businesses/Nonprofits'
    },
    {
      title: 'All Individual Finitee users'
    },
    {
      title: 'Connections only'
    }
  ]

  ngOnInit() {
    this.initiliazeForm();
    //this.buyRazorPay();
    // this.razorpayService.lazyLoadLibrary(this.salesListingService.checkoutURL).subscribe();
  }

  initiliazeForm() {
    this.saveClicked = false;
  }

  getLatlng() {
    this.locationService.getLatLngFromAddressType(this.salesItem.Location)
      .then((latLng) => {
       this.salesItem.Latitude = latLng.lat
       this.salesItem.Longitude = latLng.lng
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  async onSubmit() {
     
    if (this.isEdit) {
      var result = await this.salesListingService.updateSLItem(this.salesItem);
      if (result) {
        this.router.navigateByUrl('/sales-listing')
      }
    } else {
      if (this.salesItem.SalesItemImages.length > 5) {
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
      this.salesItem.ExpiredOn = new Date(today.setDate(today.getDate() + 30));
      const result = await this.salesListingService.createSLItem(this.salesItem);
      if (result) {
        this.router.navigateByUrl('/sales-listing')
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

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.salesItem.SalesItemImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.salesItem.SalesItemImages.push(filePath);
    else
      this.salesItem.SalesItemImages[this.salesItem.SalesItemImages.length - 1] = filePath;
  }

}
