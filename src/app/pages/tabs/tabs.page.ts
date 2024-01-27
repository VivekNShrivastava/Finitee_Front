import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { PushNotificationActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { AlertController, IonMenu, IonTabs, ModalController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { PrivacySettingService } from 'src/app/core/services/privacy-setting.service';
import { StorageService } from 'src/app/core/services/storage.service';

import {
  ActionPerformed,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage extends BasePage implements OnInit {
  @ViewChild('menu') menu!: IonMenu;
  @ViewChild('tabs', { static: false }) tabs!: IonTabs;
  //userType: any;
  selectedTab: any;
  backPressTimeStamp!: any;
  constructor(
    private chatService: ChatsService,
    private router: Router,
    private privacySettingService: PrivacySettingService,
    private authService: AuthService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public _commonService: CommonService,
    private _storageService: StorageService
  ) {
    super(authService);
  }

  async ngOnInit() {
    await this.chatService.initializeChatModule(this.logInfo);
    if (Capacitor.isNativePlatform()) {
      this.addListeners();
      this.registerNotifications();
    }
    this.initAppBackButton();
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

  openMenu() {
    this.menu.open();
  }

  closeMenu() {
    this.menu.close().then((r) => r);
  }

  menuAction(pagelink: any) {
    this.closeMenu();
    if (pagelink)
      this.router.navigateByUrl(pagelink);
  }

  async logoutConfirmation() {
    const alert = await this.alertController.create({
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


  async addListeners() {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      this._commonService.updatePushNotificationToken(token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
      this._storageService.saveNotification(notification, this._commonService.getTodayDate());

      if (notification.data && notification.data.title === 'Post Favor') {
        console.log('Navigating to another page...');
        // Use the Router service to navigate to the desired path
        // this.router.navigate(['post/view-post']);
      } else {
        // Default action when the notification body is tapped
        console.log('Default action when notification body is tapped');
        // Add any additional handling or navigate to a default page
      }
    });

    // await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    //   console.log('Push notification action performed--', notification.actionId, notification.inputValue);

    //   if (notification.actionId === 'navigateToAnotherPage') {
    //     // Use the Router service to navigate to the desired path
    //     this.router.navigate(['/another']);
    //   }
    // });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log("performing the action...", notification);

      if(notification.notification.data.title === "Post Favor"){
        this.router.navigateByUrl('post/view-post', this.navEx);//have to add a route which routes to a single post
      }
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  /*   async getDeliveredNotifications() {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    } */

  initAppBackButton() {
    App.addListener('backButton', async ({ canGoBack }) => {
      if (await this.modalCtrl.getTop()) {
        const modal = await this.modalCtrl.getTop();
        if (modal) {
          this.modalCtrl.dismiss();
          return;
        }
      }

      if (await this.menu.isOpen()) {
        this.closeMenu();
        return;
      }

      let exitApp = false;
      let pathArray = window.location.pathname.split("/");
      exitApp = pathArray[1] == "tabs";// && pathArray.length <= 3;//TODO Manoj : Handle for modal closings as well
      if (exitApp) {
        let currentTime = new Date();
        if (this.backPressTimeStamp && currentTime.getTime() - this.backPressTimeStamp.getTime() < AppConstants.PRE_APP_EXIT_DURATION) {
          App.exitApp();
        }
        else {
          this.backPressTimeStamp = new Date();
          this._commonService.presentToast("Press back again to exit");
        }
      }


    });
  }

}
