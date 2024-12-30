import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { userConnection } from 'src/app/core/models/connection/connection';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { StorageService } from 'src/app/core/services/storage.service';
//import
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Router, NavigationExtras } from '@angular/router';
import { EventItemResponse, FiniteeUserOnMap, PostResponse, SalesItemResponse, ServiceResponse } from '../map/models/MapSearchResult';
import { User, UserProfile, CanvasProfile } from 'src/app/core/models/user/UserProfile';

import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';

@Component({
  selector: 'app-connections',
  templateUrl: 'connections.page.html',
  styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage extends BasePage implements OnInit {
  loaded: boolean = false;
  valueFromState: any;
  selectedTab: any = 'connections'
  userConnections: Array<userConnection> = [];
  userConnectionsRequests: Array<userConnection> = [];
  userBlockList: Array<userConnection> = [];
  isSearchEnabled = false;
  searchQuery: string = '';
  searchQueryBlocked: string = '';
  filteredConnections: userConnection[] = [];
  searchQueryRequests: string = '';
  filteredRequests: userConnection[] = [];
  filteredBlockList: userConnection[] = [];
  userProfile: UserProfile = new UserProfile();
  canvasProfile: CanvasProfile = new CanvasProfile();

  userList: Array<User> = [];
  freeUserList: Array<FiniteeUserOnMap> = [];
  businessUserList: Array<FiniteeUserOnMap> = [];
  nonProfitUserList: Array<FiniteeUserOnMap> = [];

  constructor(
    private _userProfileService: ProfileService,

    private connectionsService: ConnectionsService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    private router: Router,
    private chatService: ChatsService, 
    private authService: AuthService) {
    super(authService);
    
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras.state as { key: string };

    // if (state) {
    //   this.valueFromState = state.key;
    // }
  }

   // Add this method to go back
   goBack() {
    this.router.navigateByUrl('/tabs/free-user-canvas');
  }
  

  
  // Toggle the search bar
  toggleSearch() {
    this.isSearchEnabled = !this.isSearchEnabled;

    if (!this.isSearchEnabled) {
      this.filteredConnections = [...this.userConnections]; // Reset connections
      this.filteredRequests = [...this.userConnectionsRequests]; // Reset requests
      this.filteredBlockList = [...this.userBlockList]; // Reset blocked users
    }
  }

  // Filter connections based on the search query
  filterConnections(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredConnections = this.userConnections.filter(user =>
        user.DisplayName.toLowerCase().includes(query) ||
        user.UserName.toLowerCase().includes(query)
      );
    } else {
      // Reset to all connections if the search bar is empty
      this.filteredConnections = [...this.userConnections];
    }
  }
  // New search functions
  filterRequests(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredRequests = this.userConnectionsRequests.filter(request =>
        request.DisplayName.toLowerCase().includes(query) ||
        request.UserName.toLowerCase().includes(query)
      );
    } else {
      this.filteredRequests = [...this.userConnectionsRequests];
    }
  }
  filterBlockedUsers(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredBlockList = this.userBlockList.filter(blockedUser =>
        blockedUser.DisplayName.toLowerCase().includes(query) ||
        blockedUser.UserName.toLowerCase().includes(query)
      );
    } else {
      this.filteredBlockList = [...this.userBlockList];
    }
  }


  ngOnInit() {
    this.getUserConnections();
    // this.segmentChange(this.valueFromState);
    this.getConnectionRequests();
    this.getUserBlockList();
    this.filteredConnections = [...this.userConnections]; 
    this.filteredRequests = [...this.userConnectionsRequests];
    this.filteredBlockList = [...this.userBlockList];
  }

  async ionViewWillEnter(){
    console.log("ionViewWillEnter");
  }

  // segmentChange(data: any) {
  //   console.log(data);
  //   this.loaded = false;
  //   switch (data.detail.value) {
  //     case 'requests':
  //       this.getConnectionRequests();
  //       break;
  //     case 'blocked':
  //       this.getUserBlockList();
  //       break;
  //     case 'connections':
  //       this.getUserConnections();
  //   }
  // }
  segmentChange(data: any) {
    this.loaded = false;
    switch (data.detail.value) {
      case 'requests':
        this.getConnectionRequests();
        break;
      case 'blocked':
        this.getUserBlockList();
        break;
      case 'connections':
        this.getUserConnections();
    }
  }

  openUser(data: userConnection) {
    console.log("openUser ", data);

    const navigationExtras1s: NavigationExtras = {
      state: {
        data: data
      }
    };
    if (data.UserTypeId == AppConstants.USER_TYPE.BN_USER)
      this.router.navigateByUrl('business-user-canvas-other', navigationExtras1s);
    else if (data.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.router.navigateByUrl('free-user-canvas', navigationExtras1s);
  }

  // async getUserConnections() {
  //   this.userConnections = await this.connectionsService.getUserConnections();
  //   this.loaded = true;
  // }
  async getUserConnections() {
    try {
      this.userConnections = await this.connectionsService.getUserConnections();
      this.filteredConnections = [...this.userConnections]; // Set filteredConnections
    } catch (error) {
      console.error("Error fetching user connections", error);
    } finally {
      this.loaded = true;
    }
  }
  

  async getConnectionRequests() {
    this.userConnectionsRequests = await this.connectionsService.getConnectionRequest();
    this.filteredRequests = [...this.userConnectionsRequests];
    this.loaded = true;
  }
  async getUserBlockList() {
    this.userBlockList = await this.connectionsService.getUserBlockList();
    this.filteredBlockList = [...this.userBlockList];
    this.loaded = true;
  }

  async requestAction(reqAcceptOrDecline: boolean, UserId: string, index: number) {
    var res = await this.connectionsService.actionConnectionRequest(reqAcceptOrDecline, UserId);
    if (res)
      this.userConnectionsRequests.splice(index, 1);
  }

  async presentConnectionMenu(UserId: string, i: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'three-dot-action-sheet',
      buttons: [
        {
          text: 'Refer connection',
          icon: 'right-menu-eprofile',
          cssClass: 'product-option-action-sheet-button',
          data: 'Refer',
        },
        {
          text: 'Remove connection',
          icon: 'business-report',
          cssClass: 'product-option-action-sheet-button',
          data: 'Remove',
        },
        {
          text: 'Block connection',
          icon: 'business-block',
          cssClass: 'product-option-action-sheet-button',
          data: 'Block',
        }
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data == 'Block') {
      this.blockUnblockUser("BLOCK", UserId, i);
    }
    else if (result.data == 'Remove') {
      this.disconnectFromUser(UserId, i);
    }
    else if (result.data == 'Refer') {
      // this.userProfile = await this._userProfileService.getUserProfile(UserId, this.logInfo.UserId);
      this.canvasProfile = await this._userProfileService.getUserCanvas(UserId, this.logInfo.UserId);
      this.navEx!.state!['data'] = this.canvasProfile;
      console.log("refer-->", this.navEx!.state!['data'])
      this.router.navigateByUrl('recommend-user', this.navEx);
    }

  }

  async blockUnblockUser(action: string, UserId: string, index: number) {
    var res = await this.connectionsService.blockOrUnblockUser(action, UserId);
    if (res) {
      if (action == "BLOCK")
        this.userConnections.splice(index, 1);
      else
        this.userBlockList.splice(index, 1);
    }
  }

  async disconnectFromUser(UserId: string, index: number) {
    var res = await this.connectionsService.disconnectFromUser(UserId);
    if (res)
      this.userConnections.splice(index, 1);
  }


  startChat(user: any) {
    console.log("data chat", user)
    var selctedUser: any = {
      UserId: user.UserId,
      DisplayName: user.DisplayName,
      ProfilePhoto: user.ProfilePhoto == undefined ? null : user.ProfilePhoto,
      groupId: ""
    }
    this.chatService.openChat(selctedUser);
  }

  async openNote(data: any) {
    const alert = await this.alertController.create({
      message: data.ConnectionRequestNotes,
      buttons: ['OK'],
    });
    await alert.present();

  }
}
