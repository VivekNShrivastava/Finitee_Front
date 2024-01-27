import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import {AlertController, IonicModule, ModalController, NavController} from "@ionic/angular";
import { FiniteeUser } from "../../models/user/FiniteeUser";
import { AuthService } from "../../services/auth.service";
import { BuysellService } from "../../services/buysell/buysell.service";

@Component({
  standalone:true,
  selector: "app-buy-sell-item",
  templateUrl: "./buy-sell-item.component.html",
  styleUrls: ["./buy-sell-item.component.scss"],
   imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuySellItemComponent implements OnInit {
  @Input() data: any = null;
  @Input() showMedia:any = false;
  @Output() refreshList = new EventEmitter<boolean>();
  @Input() serviceType: string = "";
  @Output() rowClick = new EventEmitter();
  @Output() onEditClick = new EventEmitter();
  logInfo!: FiniteeUser;
  rupeesym = false;
  dollarsym = false;
  constructor(
    private modalController: ModalController,
    private _buysell: BuysellService,
    private nav: NavController,
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.logInfo = await this.authService.getUserInfo();
    this.symbolCheck();
  }
  symbolCheck() {
    this.rupeesym = false;
    this.dollarsym = false;
    if (this.logInfo.ccode == "IN") {
      this.rupeesym = true;
    } else {
      this.dollarsym = true;
    }
  }
  async deleteItem() {
    const alertCtrl = new AlertController();
    const alert = await alertCtrl.create({
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
          handler: () => {
            this._buysell.deleteSalesPost(this.data.id);
            this.refreshList.emit(true);
          },
        },
      ],
    });
    await alert.present();
  }

  async editItem(media?: any) {
    /*  if (this.serviceType == "serviceAvailable") {
       this.onEditClick.emit(true);
       return;
     }
 
     const modal = await this.modalController.create({
       component: EditSalesitemComponent,
       componentProps: {
         salesItem: { ...this.data },
       },
     });
     modal.onDidDismiss().then(async (result) => {
       if (result.data && result.data.isChanged) {
         // change price and visibility
         const modalData = result.data.data;
         // output event to refresh list
         this.refreshList.emit(true);
       }
     });
     return await modal.present(); */
  }

  goToDetail() {
    if (this.serviceType == "serviceAvailable") {
      this.rowClick.emit(true);
      return;
    }
    const navEx: NavigationExtras = {
      state: {
        data: this.data,
      },
    };
    this.nav.navigateForward([`/sales-item`], navEx);
  }
}
