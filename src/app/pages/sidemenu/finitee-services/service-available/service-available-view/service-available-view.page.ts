import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-service-available-view',
  templateUrl: './service-available-view.page.html',
  styleUrls: ['./service-available-view.page.scss'],
})
export class ServiceAvailableViewPage extends BasePage implements OnInit {
  id!: number;
  serviceObj: FiniteeService = new FiniteeService;
  currencySymbol?:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private finiteeService: FiniteeServicesService,
    private authService: AuthService,
    private alertController: AlertController, private paymentService: PaymentService, private commonService: CommonService
  ) {
    super(authService);
    this.route.params.subscribe((params: any) => {
      this.id = params.id;
    });

   
  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol;
    this.getServiceAvailableById().then(() => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(this.serviceObj.ExpiryOn);
      expiryDate.setHours(0, 0, 0, 0);
      const timeDiff = expiryDate.getTime() - currentDate.getTime();
      this.serviceObj.DaysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    });
  }

  async getServiceAvailableById() {
    try {
      var result = await this.finiteeService.getServiceAvailableById(this.id);
      this.serviceObj = result;
    } catch (error) {
    }
  }

  edit() {
    this.navEx!.state!['id'] = this.serviceObj.Id;
    this.router.navigateByUrl(`service-available/create-edit-service-available`, this.navEx);
  }
  renew(){
    try {
    this.paymentService.payment.amount = this.commonService.currentCurrency.Amount
      this.paymentService.makePayment();
    } catch (error) {
      
    }
  }

  @HostListener('window:payment.success', ['$event'])
  async onPaymentSuccess(event: any) {
    try {
      const today = new Date();
      this.serviceObj.ExpiryOn = new Date();
      this.serviceObj.ExpiryOn.setDate(today.getDate() + 30);
      const res = await this.finiteeService.updateServiceAvailable(this.serviceObj);
      if (res) {
        this.router.navigateByUrl('service-available');
        const alert = await this.alertController.create({
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
      console.error('An error occurred during the update:', error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
 
}
