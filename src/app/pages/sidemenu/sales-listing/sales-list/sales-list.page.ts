import { Component, OnInit, ViewChild } from '@angular/core';
import { EventItem } from 'src/app/core/models/event/event';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';
import { Router } from '@angular/router';
import { SalesItem } from 'src/app/core/models/sales-item/sales-item';
import { AlertController, IonMenu } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { LocationService } from 'src/app/core/services/location.service';
@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.page.html',
  styleUrls: ['./sales-list.page.scss'],
})
export class SalesListPage extends BasePage implements OnInit {
  currencySymbol?:string;
  loading?: boolean;
  isShowAddButton: boolean = true;
  constructor( private locationService: LocationService,
    private router: Router,
    public salesListingService: SalesListingService,
    private authService: AuthService,
    private alertCtrl: AlertController, private commonService: CommonService
  ) {
    super(authService);

  }

  ngOnInit() {

  }
 
  ionViewWillEnter() {

    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol
    this.getAllSalesItem();

  }

  // get all active, expired items.
  async getAllSalesItem() {
    this.loading = true;
    try {
      var res = await this.salesListingService.getAllSalesItemByUser();
      if (res) {
        const activeItemCount = this.salesListingService.salesItemList.filter(a => a.IsActive).length;
        this.isShowAddButton = activeItemCount < 5;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        this.salesListingService.salesItemList.forEach(element => {
          const expiryDate = new Date(element.ExpireOn);
          expiryDate.setHours(0, 0, 0, 0);
          const timeDiff = expiryDate.getTime() - currentDate.getTime();
          element.daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        });
        this.loading = false;
      }
    } catch (error) {
      console.error('Error while adding/updating sales item:', error);
      this.loading = false;
    }
  }

  // navigate to item view page
  viewItem(slId: any) {
    this.salesListingService.id = slId;
    this.router.navigateByUrl(`/sales-listing/sales-item-view/${slId}`);
  }

  // navigate to create item page
  createItem() {
    this.navEx!.state!['data'] = new SalesItem();
    this.router.navigateByUrl('sales-listing/create-edit-sales-item', this.navEx);
  }

  // edit item
  editItem(obj: any, index: number) {
    this.navEx!.state!['data'] = obj;
    this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl('sales-listing/create-edit-sales-item', this.navEx);
  }

  // item delete section 
  async deleteItem(obj: any) {
    const alert = await this.alertCtrl.create({
      header: "Delete",
      message: "Are you sure you want to delete this sales listing?",
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
              const res = await this.salesListingService.deleteSLItem(obj.Id);
              if (res) {
                this.removeDeletedItemFromList(obj);
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

  // remove item from itemList when we deleted 
  removeDeletedItemFromList(deletedItem: any) {
    this.salesListingService.salesItemList = this.salesListingService.salesItemList.filter(item => item !== deletedItem);

    const activeItemCount = this.salesListingService.salesItemList.filter(a => a.IsActive).length;
    this.isShowAddButton = activeItemCount < 5;
  }
  // temp
  // for side bar

  @ViewChild('menu') menu!: IonMenu;

  menuAction(pagelink: any) {
    this.closeMenu();
    if (pagelink)
      this.router.navigateByUrl(pagelink);
  }

  closeMenu() {
    this.menu.close().then((r) => r);
  }
  
  openMenu() {
    this.menu.open();
  }

  async logoutConfirmation() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to logout',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Logout:');
            this.authService.logout();
            // this.authService.logoutUser("Home");
          }
        }
      ]
    });
    await alert.present();
  }
}
