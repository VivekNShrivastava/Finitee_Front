import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Announcement } from 'src/app/core/models/announcement/announcement';
import { Product } from 'src/app/core/models/product/product';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PlacesService } from 'src/app/core/services/places.service';


@Component({
  selector: 'app-business-screen-own',
  templateUrl: './business-canvas.page.html',
  styleUrls: ['./business-canvas.page.scss'],
})
export class BusinessCanvasPage extends BasePage implements OnInit {
  userProfile: UserProfile = new UserProfile();
  products: Array<Product> = [];
  menuItemList: Array<string> = [];
  announcements: Array<Announcement> = [];
  isAnnouncmentModalOpen: boolean = false;
  loaded: boolean = false;
  ShowMoreProfileDetails: boolean = false;
  CountryName: string = "";
  StateName: string = "";
  CityName: string = "";
  navParams: any;
  userId: string = "";
  constructor(
    private router: Router,
    private _userProfileService: ProfileService,
    public businessCanvasService: BusinessCanvasService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private navCtrl: NavController,
    public placeService: PlacesService,
    private chatService: ChatsService,
    private alertController: AlertController,
    private connectionService: ConnectionsService,
    private commonService: CommonService,
    private _inflowService: InflowsService
  ) {
    super(authService);
    if (this.router!.getCurrentNavigation()!.extras.state) {
      this.navParams = this.router!.getCurrentNavigation()!.extras.state!['data'];
      console.log("this.navParams", this.navParams);
      if (this.navParams.UserId)
        this.userId = this.navParams.UserId;
      if (this.navParams.Id)
        this.userId = this.navParams.Id;
    }
    else {
      this.userId = this.logInfo.UserId;
    }
    this.subscribeSubject();
  }

  subscribeSubject() {
    this.businessCanvasService.businessData.subscribe({
      next: (result: any) => {
        console.log(`observerA: ${result}`);
        if (result.type == "add_product")
          this.products.unshift(result.data);
        else if (result.type == "edit_product")
          this.products[result.index] = result.data;
        else if (result.type == "add_menulist")
          this.menuItemList = result.data;
      }
    });
  }

  ionViewWillEnter() {
    var p1 = this._userProfileService.getUserProfile(this.userId, this.logInfo.UserId);
    var p2 = this.businessCanvasService.getAnnouncement(this.userId, this.logInfo.UserId);
    var p3 = this.businessCanvasService.getProductList(this.userId, this.logInfo.UserId);
    var p4 = this.businessCanvasService.getMenuItemList(this.userId, this.logInfo.UserId);
    Promise.all([p1, p2, p3, p4]).then(async (values) => {
      console.log(values);
      this.userProfile = values[0];
      this.announcements = values[1];
      this.products = values[2];
      this.menuItemList = values[3];
      try {
        var country = await this.placeService.findCountry({ id: this.userProfile.user.Address.CountryId });
        if (country) {
          this.CountryName = country?.CountryName;
          var state = await this.placeService.findState(country!.id, { id: this.userProfile.user.Address.StateId });
          if (state) {
            this.StateName = state?.StateName;
            var city = await this.placeService.findCity(state!.id, { id: this.userProfile.user.Address.CityId });
            if (city) {
              this.CityName = city?.CityName;
            }
          }
        }
      }
      catch (e) {

      }
      this.loaded = true;
    });
  }

  async ngOnInit() {

  }

  announcementAction() {
    if (this.userId == this.logInfo.UserId) {//own
      if (this.announcements.length > 0)
        this.isAnnouncmentModalOpen = true;
      else
        this.addAnnouncement();
    }
    else {//other
      this.isAnnouncmentModalOpen = true;
    }
  }

  editAnnouncement() {
    this.closeAnnouncement();
    setTimeout(() => {
      this.navEx!.state!['data'] = this.announcements[0];
      this.router.navigateByUrl('business/add-edit-announcement', this.navEx);
    }, 500);
  }

  closeAnnouncement() {
    this.isAnnouncmentModalOpen = false;
  }
  modalDismiss() {
    this.closeAnnouncement();
  }

  addAnnouncement() {
    this.navEx!.state!['data'] = new Announcement();
    this.router.navigateByUrl('business/add-edit-announcement', this.navEx);
  }

  async enableDisableAnnouncement() {
    this.isAnnouncmentModalOpen = false;
    if (this.announcements[0].IsActive)
      this.announcements[0].IsActive = false;
    else
      this.announcements[0].IsActive = true;
    await this.businessCanvasService.enableDisableAnnouncement(this.announcements[0].Id, this.announcements[0].IsActive);
  }



  editMenuItem() {
    this.router.navigateByUrl('business/edit-menu-items');
  }

  addProduct() {
    this.navEx!.state!['data'] = new Product();
    this.router.navigateByUrl('business/add-edit-product', this.navEx);
  }

  editProduct(product: Product, index: number) {
    this.navEx!.state!['data'] = product;
    this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl('business/add-edit-product', this.navEx);
  }

  productScreen(product: Product, index: number) {
    this.navEx!.state!['data'] = product;
    this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl(`business/view-product/${product.Id}`, this.navEx);
  }

  editPrivacy(productId: any) {
    this.router.navigateByUrl(`business/edit-privacy/${productId}`);
  }

  startChat() {
    //var existingChatGroupId = this.chatService.getGroupIdIfChatThreadAlreadyStarted(this.userId);
    var selctedUser: any = {
      UserId: this.userId,
      DisplayName: this.navParams.DisplayName,
      ProfilePhoto: this.navParams.ProfilePhoto == undefined ? null : this.navParams.ProfilePhoto,
      groupId: ""
    }
    this.chatService.openChat(selctedUser);
  }



  async openProductOption(product: Product, index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: [
        {
          text: 'Edit privacy',
          icon: 'privacy',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit privacy',
        },
        {
          text: 'Edit product',
          icon: 'edit-product',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit product',
        },
        {
          text: 'Delete',
          icon: 'delete-product',
          cssClass: ['product-option-action-sheet-button', 'red-text'],
          data: 'delete',
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'delete') {
      this.deleteProduct(product, index);
    } else if (result.data == 'edit product') {
      this.editProduct(product, index);
    } else if (result.data == 'edit privacy') {
      this.editPrivacy(product.Id);
    }
  }

  async deleteProduct(product: Product, index: number) {
    const alert = await this.alertController.create({
      header: 'Delete post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: async () => {

          },
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: async () => {
            await this.businessCanvasService.deleteProduct(product.Id);
            this.products.splice(index, 1);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentMenuModalForOther() {

    var actionButtons = [
      {
        text: 'View Donation Request',
        icon: 'right-menu-eprofile',
        cssClass: 'product-option-action-sheet-button',
        data: 'donationRequest',
      },
      {
        text: 'eProfile',
        icon: 'right-menu-eprofile',
        cssClass: 'product-option-action-sheet-button',
        data: 'eProfile',
      },
     /*  {
        text: 'Start receiving all inflows',
        icon: 'stop-inflows',
        cssClass: 'product-option-action-sheet-button',
        data: 'inflows',
      }, */
      {
        text: 'Recommend',
        icon: 'business-recommend',
        cssClass: 'product-option-action-sheet-button',
        data: 'Recommend',
      },
      {
        text: 'Report',
        icon: 'report-business',
        cssClass: 'product-option-action-sheet-button',
        data: 'Report',
      },
      {
        text: 'Block',
        icon: 'business-block',
        cssClass: 'product-option-action-sheet-button',
        data: 'Block',
      },
    ];

 /*    if (this.userProfile.IsInflowsStarted) {
      actionButtons[2].text = "Stop receiving all inflows";
    } */


    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'three-dot-action-sheet',
      buttons: actionButtons,
    });


    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'donationRequest') {
      this.navEx!.state!['userId'] = this.userId;
      this.router.navigateByUrl(`donation`, this.navEx);
    }
    else if (result.data == 'eProfile') {
      this.router.navigateByUrl(`e-profile/${this.userId}`);
    }
    else if (result.data == 'Recommend') {
      this.recommendUser();
    }
    else if (result.data == 'inflows') {
      var response = await this._inflowService.startStopRecivingInflows(this.userId, !this.userProfile.IsInflowsStarted);
      if (response) {
        this.userProfile.IsInflowsStarted = !this.userProfile.IsInflowsStarted;
        if (this.userProfile.IsInflowsStarted)
          this.userProfile.InflowsCount++;
        else
          this.userProfile.InflowsCount--;
      }
    }
  }

  /* connection releated function */
  async sendConnectionReqPopup() {
    if (!this.userProfile.IsConnected && !this.userProfile.IsRequestExits) {
      const alert = await this.alertController.create({
        header: `Add a note to the connection request to ${this.userProfile.user.DisplayName}?`,
        cssClass: 'add-user-alert',
        inputs: [
          {
            name: 'note',
            type: 'textarea',
            placeholder: 'Type your note here..',
            cssClass: 'add-user-alert-textarea',
          },
        ],
        buttons: [
          {
            text: 'Send',
            role: 'send',
            cssClass: 'add-user-alert-send-button',
            handler: (data: any) => {
              this.sendConnectionRequest(data.note);
              alert.dismiss();
            }
          },
          {
            text: 'Send without note',
            role: 'send-without-note',
            cssClass: 'add-user-alert-send-without-button',
            handler: (data: any) => {
              this.sendConnectionRequest(data.note);
              alert.dismiss();
            }
          },
          {
            text: 'X',
            role: 'cancel',
            cssClass: 'add-user-alert-close-button',
          },
        ],
      });

      await alert.present();
    }
    else {
      this.commonService.presentToast(this.appConstants.TOAST_MESSAGES.CON_REQ_ALR_SENT);
    }
  }


  editProfile() {
    this.navEx!.state!['data'] = this.userProfile;
    this.router.navigateByUrl('business/edit-business-user-profile', this.navEx);
  }

  recommendUser() {
    this.navEx!.state!['data'] = this.userProfile;
    this.router.navigateByUrl('recommend-user', this.navEx);
  }


  viewConnectedMembers() {
    this.navEx!.state!['data'] = this.userId;
    this.navCtrl.navigateForward('connected-members', this.navEx);
    /*     this.router.navigate(['connected-members'], this.navEx); */
  }

  async sendConnectionRequest(note: any) {
    var res = await this.connectionService.sendConnectionRequest(this.userId, note);
    if (res) {
      this.userProfile.IsRequestExits = true;
      this.getConnectionIcon();
    }
  }

  getConnectionIcon() {
    var iconName = 'b-connect-with-business';
    if (this.userProfile.IsConnected)
      iconName = 'b-request-accepted';
    else if (this.userProfile.IsRequestExits)
      iconName = 'b-request-sent';
    return iconName
  }

  //endoresement related functions
  endorseBusiness() {
    if (this.userId)
      this.businessCanvasService.endorsementAction(this.userId)
  }

  productPrivacy(product: Product) {
    var res = true;
    if (this.userId != this.logInfo.UserId && product.Privacy == 'O')
      res = false;
    else if (this.userId != this.logInfo.UserId && product.Privacy == 'C' && !this.userProfile.IsConnected)
      res = false
    return res;
  }
}
