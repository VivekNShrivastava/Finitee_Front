import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { EventItem } from 'src/app/core/models/event/event';
import { SalesItem } from 'src/app/core/models/sales-item/sales-item';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { EventsService } from 'src/app/core/services/events.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';

declare var Razorpay: any;

@Component({
  selector: 'app-sales-item-view',
  templateUrl: './sales-item-view.page.html',
  styleUrls: ['./sales-item-view.page.scss'],
})
export class SalesItemViewPage extends BasePage implements OnInit {
  itemId!: number;
  salesItem: SalesItem = new SalesItem;
  currencySymbol?:string;
  createdById: any;
  constructor(
    private route: ActivatedRoute, private alertController: AlertController,
    private router: Router,
    private salesListingService: SalesListingService,
    private authService: AuthService,
    public commonService: CommonService, public paymentService: PaymentService
  ) {
    super(authService);
    this.route.params.subscribe((params: any) => {
      this.itemId = params.id;
    });
  }
  ngOnInit() {

  }

  ionViewWillEnter() {
    // this.salesItem = this.salesListingService.salesItemList.filter(a => a.Id == this.salesListingService.id)[0];.
    this.salesItemById().then(() => {
      this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      const expiryDate = new Date(this.salesItem.ExpireOn);
      expiryDate.setHours(0, 0, 0, 0);
      const timeDiff = expiryDate.getTime() - currentDate.getTime();
      this.salesItem.daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    })
  }

  async salesItemById(){
    var result = await this.salesListingService.getSalesItemBySlId(this.itemId);
    this.salesItem = result;
    this.createdById = this.salesItem.CreatedBy.Id
  }

  edit() {
    this.navEx!.state!['data'] = this.salesItem;
    // this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl('sales-listing/create-edit-sales-item', this.navEx);
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
      const today = new Date;
            this.salesItem.ExpireOn = new Date;
            this.salesItem.ExpireOn.setDate(today.getDate() + 30);
            var res = await this.salesListingService.updateSLItem(this.salesItem);
      if (res) {
        this.router.navigateByUrl('/sales-listing');
        const alert = await this.alertController.create({
          header: "Alert",
          message: 'Your payment was successful. The listing is now active.',
          backdropDismiss: false, // Disables background interaction
          buttons: [
            {
              text: "Dismiss",
              cssClass: "dismiss",
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

  @HostListener('window:payment.failed', ['$event'])
  onPaymentFeild() {
  }
 

}
