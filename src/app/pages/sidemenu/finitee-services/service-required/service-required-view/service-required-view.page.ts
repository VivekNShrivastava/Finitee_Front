import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { EventItem } from 'src/app/core/models/event/event';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { environment } from 'src/environments/environment';
declare var Razorpay: any;

@Component({
  selector: 'app-service-required-view',
  templateUrl: './service-required-view.page.html',
  styleUrls: ['./service-required-view.page.scss'],
})
export class ServiceRequiredViewPage extends BasePage implements OnInit {
  id!: number;
  currencySymbol?: string;
  serviceObj: FiniteeService = new FiniteeService;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private finiteeService: FiniteeServicesService,
    private authService: AuthService,
    private alertController: AlertController, public commonService: CommonService, private paymentService: PaymentService,
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

    this.getServiceRequiredById().then(() => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(this.serviceObj.ExpiryOn);
      expiryDate.setHours(0, 0, 0, 0);
      const timeDiff = expiryDate.getTime() - currentDate.getTime();
      this.serviceObj.DaysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    });
  }

  async getServiceRequiredById() {
    try {
      var result = await this.finiteeService.getServiceRequiredById(this.id);
      this.serviceObj = result;
    } catch (error) {
    }
  }

  edit() {
    this.navEx!.state!['id'] = this.serviceObj.Id;
    this.router.navigateByUrl(`service-required/create-edit-service-required`, this.navEx);
  }

  renew() {
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
      const res = await this.finiteeService.updateServiceRequired(this.serviceObj);
      if (res) {
        this.router.navigateByUrl('service-required');
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
