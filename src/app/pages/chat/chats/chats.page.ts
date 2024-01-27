import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
} from '@ionic/angular';

import * as lodash from 'lodash';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { NewChatComponent } from 'src/app/pages/chat/component/new-chat/new-chat.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  readonly appConstants: any = AppConstants;
  chatsList: any[] = [];
  logInfo!: FiniteeUser;
  searchshow = false;
  showNoMsg = false;
  refreshScreenSubscription: Subscription;
  constructor(
    private menu: MenuController,
    public authService: AuthService,
    public chatsService: ChatsService,
    public modalController: ModalController,
    private nav: NavController,
    public zone: NgZone,
    private alertController: AlertController
  ) {
    this.refreshScreenSubscription = this.chatsService.isRefersh.subscribe(
      (data) => {
        this.zone.run(() => {
          //setTimeout(() => {
          this.loadChats();
          //}, 5000);
        });
      }
    );
  }

  async ngOnInit() {
    this.logInfo = await this.authService.getUserInfo();
    this.loadChats();
  }

  loadChats() {
    var allChats = lodash.cloneDeep(this.chatsService.messages);
    if (allChats.length > 0) {
      allChats = lodash.sortBy(allChats, ['timestamp']);
      allChats = allChats.reverse();
      this.chatsList = allChats;
      console.log(this.chatsList);
    }
    /*  var filterchatList = lodash.filter(this.chatsList, { deleted: true });
     if (filterchatList.length == 0)
       this.showNoMsg = true;
     else
       this.showNoMsg = false; */
  }

  handleChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.chatsList = lodash
      .cloneDeep(this.chatsService.messages)
      .filter(
        (d: any) => d.otherPartyUserName.toLowerCase().indexOf(query) > -1
      );
  }

  toggleMenu() {
    this.menu.toggle();
  }

  closeSearch() {
    this.searchshow = false;
    this.chatsList = lodash.cloneDeep(this.chatsService.messages).filter((d: any) => d.otherPartyUserName.toLowerCase().indexOf('') > -1);
  }

  async presentNewChatModal() {
    const modal = await this.modalController.create({
      component: NewChatComponent,
      componentProps: {
        event: 'New Chat',
      },
    });
    modal.onDidDismiss().then(async (user: any) => {
      if (user.data) this.openChatDetailPage(user.data);
    });
    return await modal.present();
  }

  openChatDetailPage(chatOrUser: any) {
    if (chatOrUser.groupId) {
      var chat = chatOrUser;
      var selectedUser = {
        UserId: chat.otherPartyUserId,
        DisplayName: chat.otherPartyUserName,
        ProfilePhoto: chat.ProfilePhoto,
        groupId: chat.groupId,
      };
      this.chatsService.openChat(selectedUser);
    } else {
      var user = chatOrUser;
      this.chatsService.openChat(user);
    }
  }

  longPressAction(chatGroup: any) {
    console.log('event', chatGroup);
    if (this.chatsService.selectedChatGroups == '')
      this.chatsService.selectedChatGroups = [];

    var index = lodash.findIndex(this.chatsService.selectedChatGroups, {
      groupId: chatGroup.groupId,
    });
    //alert(index);
    if (index == -1) {
      this.chatsService.selectedChatGroups.push(chatGroup);
      this.chatsService.selctedChatGroupsJSONString = JSON.stringify(
        this.chatsService.selectedChatGroups
      );
    } else {
      this.chatsService.selectedChatGroups.splice(index, 1);
      this.chatsService.selctedChatGroupsJSONString = JSON.stringify(
        this.chatsService.selectedChatGroups
      );
    }
    console.log('selectedChatGroups', this.chatsService.selectedChatGroups);
  }

  async deleteChatGroup() {
    const alert = await this.alertController.create({
      header: 'Delete thread',
      message: 'Are you sure you want to delete this thread?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: () => {
            this.clearSelectedItem();
          },
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: () => {
            this.chatsService.deleteChatGroupAndChatCollection();
          },
        },
      ],
    });
    await alert.present();
  }

  async muteChatGroup() {
    await this.chatsService.muteChatGroup();
  }

  navigateUserToCanvas() {
    this.chatsService.goToViewConnection(
      this.chatsService.selectedChatGroups[0].otherPartyUserId
    );
    this.clearSelectedItem();
  }

  navigateUserToHome() {
    this.clearSelectedItem();
    //add btab canvas page link
    //this.nav.navigateForward(['/tabs/tab1']);
  }

  clearSelectedItem() {
    this.chatsService.selectedChatGroups = [];
    this.chatsService.selctedChatGroupsJSONString = '';
  }

  markAsRead() {
    if (this.chatsService.selectedChatGroups[0].chats.length > 0) {
      this.chatsService.selectedChatGroups[0].chats.forEach((chat: any) => {
        if (chat.fromid != this.logInfo.UserId && chat.status != 'r')
          this.chatsService.updateChatStatus(
            this.chatsService.selectedChatGroups[0].groupId,
            chat.chatId,
            'r'
          );
      });
      var chatGroupg = lodash.filter(this.chatsList, {
        groupId: this.chatsService.selectedChatGroups[0].groupId,
      });
      chatGroupg[0].noOfUnreadMsg = 0;
      this.clearSelectedItem();
    }
  }

  exportChat() {
    this.chatsService.exportChat();
  }

  ngOnDestroy(): void {
    this.clearSelectedItem();
  }

  openVidePage() {
    this.nav.navigateForward([`/video-cover-selection`]);
  }
}
