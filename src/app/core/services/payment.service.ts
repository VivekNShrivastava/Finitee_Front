import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Payment } from '../models/Payment';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BasePage {
  payment: Payment = new Payment();

  constructor(private commonService: CommonService,private authService: AuthService) {
    super(authService);
  }
 

  async makePayment() {
    return new Promise(async (resolve, reject) => {
      var razopPayOption = {
        "key": environment.RAZORPAY_KEY,
        "amount": this.payment.amount * 100,
        "currency": this.payment.currencyCode,
        "name": this.payment.name,
        "description": this.payment.description,
        "order_id": this.payment.orderId,
        "handler": function (response: any) {
          var event = new CustomEvent("payment.success",
            {
              detail: response,
              bubbles: true,
              cancelable: true
            }
          );
          window.dispatchEvent(event);
        },
        "prefill": {
          "name": this.payment.name,
          "email": this.payment.email,
          "contact": this.payment.contact,
        },
        "notes": {
          "address": this.payment.address,
        },
        "theme": {
          "color": this.payment.themColor,
        }
      };

      var pay = new Razorpay(razopPayOption);
 
      pay.on('payment.failed', (response: any) => {
        this.commonService.presentToast('Payment Failed.');
        reject(response);
      });

      pay.on('payment.cancel', () => {
        this.commonService.presentToast('Payment Cancelled.');
        reject('Payment Cancelled');
      });

      pay.open();
      pay.on('payment.success', (response: any) => {
        resolve(response);
      });
    });
  }

 
  
}
