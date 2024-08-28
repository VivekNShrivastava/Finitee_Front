import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Announcement } from 'src/app/core/models/announcement/announcement';
import { Product } from 'src/app/core/models/product/product';
import { User, UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PlacesService } from 'src/app/core/services/places.service';

@Component({
  selector: 'app-business-user-canvas-test',
  templateUrl: './business-user-canvas-test.component.html',
  styleUrls: ['./business-user-canvas-test.component.scss'],
})
export class BusinessUserCanvasTestComponent extends BasePage implements OnInit {
  userProfile: UserProfile = new UserProfile();
  isAnnouncmentModalOpen: boolean = false;
  
  userId: string = "";
  products: Array<Product> = [];
  announcements: Array<Announcement> = [];
  product1 : Product = new Product();
  product2 : Product = new Product();
  product3 : Product = new Product();
  loaded: boolean = false;
  ShowMoreProfileDetails: boolean = false;
  CountryName: string = "";
  StateName: string = "";
  CityName: string = "";

  
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
  ) {super(authService);}

  ngOnInit() {
    this.userProfile.user = new User();
    this.userProfile.user.DisplayName = 'John Doe';
    this.userProfile.user.ProfileImage = 'dev/50c88907-c043-e272-353e-6f651c5cb1da/290201d4-3a6c-4d0e-9404-4f2917a1fe17.webp';
    this.userProfile.user.About = 'A brief about John Doe.';
    this.userProfile.user.Email = 'johndoe@example.com';
    this.userProfile.user.Phone = '123-456-7890';
    this.userProfile.user.Website = 'https://johndoe.com';
    this.userProfile.user.Address.AddressLine1 = '123 Main St';
    this.userProfile.user.Address.AddressLine2 = 'Apt 4B';
    this.userProfile.user.Address.ZipCode = '12345';
    this.userId = "123";
    this.product1.Id='1';
    this.product1.Title='food';
    this.product1.TitleDescription = 'any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth';
    this.product1.ProductImages = ['dev/50c88907-c043-e272-353e-6f651c5cb1da/2c30fd91-fa54-4615-a7be-d53aa47f704a.jpeg'];
    this.product2.Id='2';
    this.product2.Title='car';
    this.product2.TitleDescription = 'any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth';
    this.product2.ProductImages = ['dev/24c88907-b2ba-704b-71bb-7ddd75347cb2/289b52b8-c22c-409a-8f02-3101133bfe06.jpeg'];
    this.product3.Id='3';
    this.product3.Title='holiday';
    this.product3.TitleDescription = 'any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth';
    this.product3.ProductImages = ['dev/24c88907-b2ba-704b-71bb-7ddd75347cb2/85ff3d8c-1176-4319-80ec-be73b7ca5adc.jpeg'];
    this.products = [this.product1, this.product2, this.product3];
    this.loaded = true;


  }



 

  announcementAction() {
    if (this.userId === "123") {
      if (this.announcements.length > 0) {
        this.isAnnouncmentModalOpen = true;
      } else {
        this.addAnnouncement();
      }
    } else {
      this.isAnnouncmentModalOpen = true;
    }
  }

  async editAnnouncement() {
    this.closeAnnouncement();
    setTimeout(() => {
      this.router.navigate(['business/add-edit-announcement'], { state: { data: this.announcements[0] } });
    }, 500);
  }

  closeAnnouncement() {
    this.isAnnouncmentModalOpen = false;
  }

  modalDismiss() {
    this.closeAnnouncement();
  }

  addAnnouncement() {
    this.router.navigate(['business/add-edit-announcement'], { state: { data: new Announcement() } });
  }

  async enableDisableAnnouncement() {
    this.isAnnouncmentModalOpen = false;
    const announcement = this.announcements[0];
    announcement.IsActive = !announcement.IsActive;
    await this.businessCanvasService.enableDisableAnnouncement(announcement.Id, announcement.IsActive);
  }

  editMenuItem() {
    this.router.navigateByUrl('business/edit-menu-items');
  }

  addProduct() {
    this.router.navigate(['business/add-edit-product'], { state: { data: new Product() } });
  }

  editProduct(product: Product, index: number) {
    this.router.navigate(['business/add-edit-product'], { state: { data: product, extraParams: index } });
  }

  productScreen(product: Product, index: number) {
    this.router.navigate([`business/view-product/${product.Id}`], { state: { data: product, extraParams: index } });
  }

  editPrivacy(productId: any) {
    this.router.navigate([`business/edit-privacy/${productId}`]);
  }

  startChat() {
    const selectedUser = {
      UserId: this.userId,
      DisplayName: this.userProfile.DisplayName,
      ProfilePhoto: this.userProfile.ProfileImage ?? null,
      groupId: ""
    };
    this.chatService.openChat(selectedUser);
  }

  async openProductOption(product: Product, index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: [
        { text: 'Edit privacy', icon: 'privacy', data: 'edit privacy' },
        { text: 'Edit product', icon: 'edit-product', data: 'edit product' },
        { text: 'Delete', icon: 'delete-product', cssClass: 'red-text', data: 'delete' }
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data === 'delete') {
      this.deleteProduct(product, index);
    } else if (result.data === 'edit product') {
      this.editProduct(product, index);
    } else if (result.data === 'edit privacy') {
      this.editPrivacy(product.Id);
    }
  }

  async deleteProduct(product: Product, index: number) {
    const alert = await this.alertController.create({
      header: 'Delete post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'confirm', handler: async () => {
          await this.businessCanvasService.deleteProduct(product.Id);
          this.products.splice(index, 1);
        }}
      ],
    });
    await alert.present();
  }

  async presentMenuModalForOther() {
    const actionButtons = [
      { text: 'View Donation Request', icon: 'right-menu-eprofile', data: 'donationRequest' },
      { text: 'eProfile', icon: 'right-menu-eprofile', data: 'eProfile' },
      { text: 'Recommend', icon: 'business-recommend', data: 'Recommend' },
      { text: 'Report', icon: 'report-business', data: 'Report' },
      { text: 'Block', icon: 'business-block', data: 'Block' }
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'three-dot-action-sheet',
      buttons: actionButtons,
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data === 'donationRequest') {
      this.router.navigate(['donation'], { state: { userId: this.userId } });
    } else if (result.data === 'eProfile') {
      this.router.navigate([`e-profile/${this.userId}`]);
    } else if (result.data === 'Recommend') {
      this.recommendUser();
     } 
    //  else if (result.data === 'inflows') {
    //   const response = await this._inflowService.startStopReceivingInflows(this.userId, !this.userProfile.IsInflowsStarted);
    //   if (response) {
    //     this.userProfile.IsInflowsStarted = !this.userProfile.IsInflowsStarted;
    //     this.userProfile.InflowsCount += this.userProfile.IsInflowsStarted ? 1 : -1;
    //   }
    // }
  }

  async sendConnectionReqPopup() {
    if (!this.userProfile.IsConnected && !this.userProfile.IsRequestExits) {
      const alert = await this.alertController.create({
        header: `Add a note to the connection request to ${this.userProfile.user.DisplayName}?`,
        inputs: [{ name: 'note', type: 'textarea', placeholder: 'Type your note here..' }],
        buttons: [
          { text: 'Send', role: 'send', handler: data => this.sendConnectionRequest(data.note) },
          { text: 'Send without note', role: 'send-without-note', handler: data => this.sendConnectionRequest(data.note) },
          { text: 'X', role: 'cancel' }
        ],
      });

      await alert.present();
    } else {
      this.commonService.presentToast('Connection request already sent');
    }
  }

  editProfile() {
    this.router.navigate(['business/edit-business-user-profile'], { state: { data: this.userProfile } });
  }

  recommendUser() {
    this.router.navigate(['recommend-user'], { state: { data: this.userProfile } });
  }

  viewConnectedMembers() {
    this.navCtrl.navigateForward('connected-members', { state: { data: this.userId } });
  }

  async sendConnectionRequest(note: any) {
    const res = await this.connectionService.sendConnectionRequest(this.userId, note);
    if (res) {
      this.userProfile.IsRequestExits = true;
      this.getConnectionIcon();
    }
  }

  getConnectionIcon() {
    if (this.userProfile.IsConnected) {
      return 'b-request-accepted';
    } else if (this.userProfile.IsRequestExits) {
      return 'b-request-sent';
    }
    return 'b-connect-with-business';
  }

  endorseBusiness() {
    if (this.userId) {
      this.businessCanvasService.endorsementAction(this.userId);
    }
  }

  productPrivacy(product: Product) {
    if (this.userId !== "123") {
      if (product.Privacy === 'O') return false;
      if (product.Privacy === 'C' && !this.userProfile.IsConnected) return false;
    }
    return true;
  } 
}
