import { Component, OnInit } from '@angular/core';
import { EventItem } from 'src/app/core/models/event/event';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';
import { Router } from '@angular/router';
import { SalesItem } from 'src/app/core/models/sales-item/sales-item';
import { AlertController } from '@ionic/angular';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
  selector: 'app-service-available-list',
  templateUrl: './service-available-list.page.html',
  styleUrls: ['./service-available-list.page.scss'],
})
export class ServiceAvailableListPage extends BasePage implements OnInit {
  loading: boolean = false;
  currencySymbol?:string;
  constructor(
    private router: Router,
    private authService: AuthService, private alertCtrl: AlertController,
    public serviceRequiredService: FiniteeServicesService, private commonService: CommonService
  ) {
    super(authService);
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol;

    this.getAllServicesAvailableByUser();
  }

  // Get Active, Expired 'service required' by user.
  async getAllServicesAvailableByUser() {
    try {
      this.loading = true;
      let res = await this.serviceRequiredService.getServiceAvailableByUserForList();
      if (res) {
        
        this.loading = false;
      } else {
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
    }
  }
  // View details of 'service available'
  viewDetails(id: any) {
    this.router.navigateByUrl(`service-available/service-available-view/${id}`);
  }

  // Edit service available
  edit(id: any) {
    this.navEx!.state!['id'] = id;
    this.router.navigateByUrl(`service-available/create-edit-service-available`, this.navEx);
  }

  // Delete service available
  async delete(id: any) {
    const alert = await this.alertCtrl.create({
      header: "Delete",
      message: "Are you sure you want to delete this service available?",
      buttons: [
        {
          text: "Keep",
          cssClass: "info",
        },
        {
          text: "Delete",
          cssClass: "danger",
          handler: async () => {
            try {
              const res = await this.serviceRequiredService.deleteServiceAvailableById(id);
              if (res) {
                this.removeDeletedItemFromList(id);
              } else {
                // Handle deletion failure if needed
              }
            } catch (error) {
              // Handle errors if needed
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // Remove service required from services list when deleted
  removeDeletedItemFromList(id: number): void {
    const index = this.serviceRequiredService.serviceList.findIndex(item => item.Id === id);
    if (index !== -1) {
      this.serviceRequiredService.serviceList.splice(index, 1);
    }
  }

  // Create service available
  create() {
    if (this.navEx && this.navEx.state && 'id' in this.navEx.state) {
      delete this.navEx.state['id'];
    }
    this.navEx!.state!['data'] = new FiniteeService();
    this.router.navigateByUrl('service-available/create-edit-service-available', this.navEx);
  }

}
