import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, IonTabs } from '@ionic/angular';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { CommonService } from 'src/app/core/services/common.service';


@Component({
  selector: 'app-service-required-list',
  templateUrl: './service-required-list.page.html',
  styleUrls: ['./service-required-list.page.scss'],
})
export class ServiceRequiredListPage extends BasePage implements OnInit {
  loading: boolean = false;
  currencySymbol?: string;
  constructor(
    private router: Router,
    private authService: AuthService, private alertCtrl: AlertController,
    public serviceRequiredService: FiniteeServicesService, private commonService: CommonService
  ) {
    super(authService);
    this.getAllServicesByUser();
  } 

  ngOnInit() { }

  async ionViewWillEnter() {
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol;
   
  }

  // Get Active, Expired 'service required' by user.
  async getAllServicesByUser() {
 //   this.serviceRequiredService.serviceList = []
    try {
      this.loading = true;
      let res = await this.serviceRequiredService.getServiceRequiredByUserForList();
      if (res) {
        
        this.loading = false;
      } else {
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
    }
  }
  // View details of 'service required'
  viewDetails(id: any) {
    this.router.navigateByUrl(`service-required/service-required-view/${id}`);
  }

  // Edit service requiredl
  edit(id: any) {
    this.navEx!.state!['id'] = id;
    this.router.navigateByUrl(`service-required/create-edit-service-required`, this.navEx);
  }

  // Delete service required
  async delete(id: any) {
    const alert = await this.alertCtrl.create({
      header: "Delete",
      message: "Are you sure you want to delete this service required?",
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
              const res = await this.serviceRequiredService.deleteServiceRequiredById(id);
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

  // Create service required
  create() {
    if (this.navEx && this.navEx.state && 'id' in this.navEx.state) {
      delete this.navEx.state['id'];
    }
    
    this.navEx!.state!['data'] = new FiniteeService();
    this.router.navigateByUrl('service-required/create-edit-service-required', this.navEx);
  }

}
