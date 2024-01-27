import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import {
  AlertController,
  IonContent,
  IonicModule,
  IonItemSliding,
  ModalController,
  NavController,
} from '@ionic/angular';
import * as lodash from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NewChatComponent } from 'src/app/pages/chat/component/new-chat/new-chat.component';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { Chat } from 'src/app/core/models/chat/chat';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';

import { ChatItemComponent } from '../chat-item/chat-item.component';

@Component({
  standalone: true,
  selector: 'app-chat-detail-cmp',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ChatItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatDetailComponent implements OnInit, OnDestroy {
  @Input() otherPartyUser: any;
  replyMsg: any = null;
  message: any = '';
  chatGroup: any;
  chats: any = [];

  logInfo!: FiniteeUser;
  //photos = [];
  photoInfo: any = null;
  chatEndedByLoggedinUser: any = false;
  messageControl: FormControl = new FormControl('', [Validators.required]);

  isPageScrolling = false;
  isAllowScrollEvents = false;
  isAllowScroll = true;
  scrolling: BehaviorSubject<boolean> = new BehaviorSubject(false);
  subscription!: Subscription;
  refreshScreenSubscription: Subscription;
  mediaOptionClicked: boolean = false;
  firstTimeCapital: boolean = true;
  //@ViewChild('content') private content: any;
  @ViewChild(IonContent, { read: IonContent, static: false })
  myContent!: IonContent;
  constructor(
    public router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    public attachmentService: AttachmentHelperService,
    public chatsService: ChatsService,
    public zone: NgZone,
    private location: Location,
    public modalController: ModalController,
    private alertController: AlertController,
    public navCtrl: NavController
  ) {
    this.mediaOptionClicked = false;
    this.firstTimeCapital = true;
    this.chats = [];
    this.message = '';
    this.unsubscribeEvent();

    this.subscription = this.attachmentService
      .getMediaSaveEmitter()
      .subscribe((data) => {
        if (data != null) {
          this.photoInfo = data;
          this.saveDataInFirebase();
        }
      });

    this.refreshScreenSubscription = this.chatsService.isRefersh.subscribe(
      (data) => {
        this.zone.run(() => {
          this.ScrollToBottom();
          if (data) {
            this.message = '';
          }
          this.dataInit();
        });
      }
    );
  }

  async ngOnInit() {
    this.logInfo = await this.authService.getUserInfo();
    this.dataInit();
    this.updateProfileDataInFireBase();
  }

  get appConstants() {
    return AppConstants;
  }

  doBack() {
    this.navCtrl.pop();
  }

  ScrollToBottom() {
    this.zone.run(() => {
      setTimeout(() => {
        this.myContent.scrollToBottom();
      }, 300);
    });
  }

  async dataInit() {
    if (this.chatsService.selectedGroupId != 'new') {
      this.chatGroup = await lodash.filter(this.chatsService.messages, {
        groupId: this.chatsService.selectedGroupId,
      });
      this.otherPartyUser.DisplayName = this.chatGroup[0].otherPartyUserName;
      this.otherPartyUser.ProfilePhoto = this.chatGroup[0].ProfilePhoto;
      if (this.chatGroup.length > 0) {
        this.chats = this.chatGroup[0].chats;
        var myprofile = lodash.filter(this.chatGroup[0].userProfiles, {
          UserId: this.logInfo.UserId,
        });
        if (myprofile[0].endchat)
          this.chatEndedByLoggedinUser = true;
        else
          this.chatEndedByLoggedinUser = false;
      }

      if (this.chats.length > 0) {
        this.updateAllChatStatus();
        this.chatGroup[0].noOfUnreadMsg = 0;
      }
      //console.log("ashis",this.chatGroup);
      this.ScrollToBottom();
      console.log("chats", this.chats);
    }
  }

  async updateProfileDataInFireBase() {
    if (this.chatsService.selectedGroupId != 'new') {
      this.chatGroup = await lodash.filter(this.chatsService.messages, {
        groupId: this.chatsService.selectedGroupId,
      });
      this.chatsService.updateProfileDataInFireBase(
        this.chatGroup,
        this.otherPartyUser.UserId
      );
    }
  }

  ionViewDidEnter() {
    this.ScrollToBottom();
  }

  ionViewWillLeave() {
    this.chatsService.selectedGroupId = '';
  }

  async ngOnDestroy() {
    this.clearSelectedChats();
    await this.unsubscribeEvent();
    this.chatsService.isRefersh.emit(false);
  }

  async unsubscribeEvent() {
    try {
      await this.subscription.unsubscribe();
      await this.refreshScreenSubscription.unsubscribe();
    } catch (e) { }
  }

  /**
   * Send message
   */
  async sendMessage(event?: any) {
    event.preventDefault();
    event.stopPropagation();
    //console.log("abc", this.message);
    //console.log("this.chatsService.selectedGroupId", this.chatsService.selectedGroupId);
    if (this.message != '') {
      await this.saveDataInFirebase();
    }
  }

  async saveDataInFirebase() {
    if (this.chatsService.selectedGroupId == 'new') {
      //create group of two people
      var newGroupId = await this.createChatGroup(this.otherPartyUser);

      //create chat message or photo
      if (this.photoInfo != null) {
        await this.createChatPhoto(newGroupId);
      } else await this.createChatMessage(newGroupId);
      this.chatsService.selectedGroupId = newGroupId;
      this.dataInit();
    } else {
      //create chat message
      //create chat message or photo
      if (this.photoInfo != null) {
        await this.createChatPhoto(this.chatsService.selectedGroupId);
      } else this.createChatMessage(this.chatsService.selectedGroupId);
    }
  }

  async createChatGroup(otherPartyUser: any) {
    var users = [this.logInfo.UserId, otherPartyUser.UserId];
    var currentUser = { UserId: this.logInfo.UserId, dn: this.logInfo.DisplayName, dp: this.logInfo.UserProfilePhoto, mute: false, deleted: false };
    var otherUser = { UserId: otherPartyUser.UserId, dn: otherPartyUser.DisplayName, dp: otherPartyUser.ProfilePhoto, mute: false, deleted: false };
    var userProfiles = [currentUser, otherUser];
    //console.log("userProfiles", userProfiles);
    var newGroupId = "Group#" + this.logInfo.UserId + "_" + otherPartyUser.UserId;
    let res: any = await this.chatsService.createChatGroup(newGroupId, users, userProfiles);
    if (res != "error") {
      return newGroupId;
    }
    return res;
  }

  async createChatMessage(selectedGroupId: any, chatMsg?: any) {
    var selectedChatGroup = await lodash.filter(this.chatsService.messages, {
      groupId: selectedGroupId,
    });
    if (selectedChatGroup && selectedChatGroup.length > 0) {
      var myprofile = lodash.filter(selectedChatGroup[0].userProfiles, { UserId: this.logInfo.UserId });
      if (myprofile[0].endchat)
        this.chatsService.endChat(false);
      if (selectedChatGroup[0].userProfiles[0].deleted || selectedChatGroup[0].userProfiles[1].deleted)
        this.chatsService.deleteChatGroup(selectedGroupId, false);
    }

    var newMsg = new Chat();
    newMsg.fromid = this.logInfo.UserId;
    newMsg.mediatype = 1;
    if (chatMsg) newMsg.txt = chatMsg;
    else newMsg.txt = this.message;
    newMsg.status = 's';
    newMsg.timestamp = new Date();
    if (this.replyMsg != null) {
      newMsg.replyOfChatId = this.replyMsg.chatId;
      newMsg.replyOfChatMsg = this.replyMsg.txt;
    }

    //console.log("new message data", this.chatsService.selectedGroupId + " " + newMsg);
    this.message = '';
    this.replyMsg = null;
    var saveMsgRes = await this.chatsService.createChatMessage(
      selectedGroupId,
      newMsg
    );
    if (saveMsgRes != 'error') {
    } else alert('error');
  }

  async createChatPhoto(selectedGroupId: any) {
    //alert('a ' + this.photoInfo.data);
    var photoUploadData: any = [];
    var newMsg = new Chat();
    newMsg.fromid = this.logInfo.UserId;
    newMsg.mediatype = 2;
    newMsg.path = this.photoInfo.data;
    newMsg.status = 's';
    newMsg.timestamp = new Date();
    if (this.replyMsg != null) {
      newMsg.replyOfChatId = this.replyMsg.chatId;
      newMsg.replyOfChatMsg = this.replyMsg.txt;
    }
    console.log('new message data', newMsg);
    this.chatsService.uploadPhotoInprogress = true;
    var createdDocId = await this.chatsService.createChatMessage(
      selectedGroupId,
      newMsg
    );
    console.log('createdDocId', createdDocId);
    if (createdDocId != 'error') {
      this.replyMsg = null;
      photoUploadData.push({
        groupId: selectedGroupId,
        chatId: createdDocId,
        blob: this.photoInfo.blob,
        photoName: this.photoInfo.name,
      });
      this.chatsService.uploadPhotos(photoUploadData);
      this.photoInfo = null;
    } else {
      this.photoInfo = null;
      alert('error');
    }
  }
  async createChatPhotoForForwaredMsg(selectedGroupId: any, path: any) {
    var newMsg = new Chat();
    newMsg.fromid = this.logInfo.UserId;
    newMsg.mediatype = 2;

    newMsg.path = path;
    newMsg.status = 's';
    newMsg.timestamp = new Date();
    if (this.replyMsg != null) {
      newMsg.replyOfChatId = this.replyMsg.chatId;
      newMsg.replyOfChatMsg = this.replyMsg.txt;
    }
    console.log('new message data', newMsg);
    this.chatsService.uploadPhotoInprogress = true;
    await this.chatsService.createChatMessage(selectedGroupId, newMsg);
  }

  updateAllChatStatus() {
    this.chats.forEach((chat: any) => {
      chat.showNoOfChar = 768;
      if (chat.fromid != this.logInfo.UserId && chat.status != "r")
        this.chatsService.updateChatStatus(this.chatsService.selectedGroupId, chat.chatId, "r");
    });
  }

  async captuerMedia(event: any, MediaType: Number, SourceType: Number) {
    event.stopPropagation();
    event.preventDefault();
    this.checkInputAllowed();
    //alert(MediaType + "" + SourceType);
    if (this.mediaOptionClicked == false) {
      this.mediaOptionClicked = true;
      if (
        this.chatsService.selectedGroupId == 'new' ||
        !this.chatGroup[0].endchat
      ) {
        await this.attachmentService.captureMedia(MediaType, SourceType);
        this.mediaOptionClicked = false;
      }
    }
  }

  goBack() {
    this.location.back();
  }

  async copyChatMessage() {
    if (this.chatsService.selectedChats[0].mediatype == 1) {
      await Clipboard.write({
        string: this.chatsService.selectedChats[0].txt,
      });
      //this.clipboard.copy(this.chatsService.selectedChats[0].txt);
      this.chatsService.showtoast('Message copied');
    }
    this.clearSelectedChats();
  }

  async forwardChatMessages() {
    const modal = await this.modalController.create({
      component: NewChatComponent,
      componentProps: {
        event: 'Forward Message',
      },
    });
    modal.onDidDismiss().then(async (user: any) => {
      if (user.data) await this.sendForwardedMessageToNewUser(user.data);
    });
    return await modal.present();
  }

  async sendForwardedMessageToNewUser(selctedUser: any) {
    this.chatsService.selectedChats.forEach(
      async (chat: any, index: number) => {
        var groupId: any = '';
        var group1 = 'Group#' + this.logInfo.UserId + '-' + selctedUser.UserId;
        groupId = await this.chatsService.getGroupDocByDocId(group1);
        if (groupId == false) {
          var group2 =
            'Group#' + selctedUser.UserId + '-' + this.logInfo.UserId;
          groupId = await this.chatsService.getGroupDocByDocId(group2);
        }

        console.log('abir groupId', groupId);
        if (groupId != '') {
          if (chat.mediatype == 2) {
            await this.createChatPhotoForForwaredMsg(groupId, chat.path);
          } else this.createChatMessage(groupId, chat.txt);
        } else {
          var otherPartyUser = {
            UserId: selctedUser.UserId,
            name: selctedUser.FullName,
            avatar: selctedUser.ProfilePhoto,
          };
          var newGroupId = await this.createChatGroup(otherPartyUser);
          //create chat message or photo
          if (chat.mediatype == 2) {
            await this.createChatPhotoForForwaredMsg(newGroupId, chat.path);
          } else await this.createChatMessage(newGroupId, chat.txt);
        }
        if (index == this.chatsService.selectedChats.length - 1) {
          /*  if (this.chatsService.selectedChats.length == 1)
           this.chatsService.showtoast("Message sent");
         else
           this.chatsService.showtoast("Messages sent"); */

          this.clearSelectedChats();
        }
      }
    );
  }

  replyChatMessages(chatmsg: any) {
    this.replyMsg = chatmsg;
    //console.log("ab chatmsg", this.chatsService.selectedChats[0].txt);
    this.clearSelectedChats();
  }

  removeReplyMsg() {
    this.replyMsg = null;
    //console.log("ab chatmsg", this.chatsService.selectedChats[0].txt);
    this.clearSelectedChats();
  }

  async showBreakLinkPopup() {
    const alert = await this.alertController.create({
      header: 'End Chat',
      message: 'Are you sure you want to end this chat?',
      buttons: [
        {
          text: 'End Chat',
          cssClass: 'alert-button-cancel',
          role: 'confirm',
          handler: () => {
            this.chatsService.endChat(true);
          },
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-confirm',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });

    await alert.present();
  }

  async deleteMessagesPopup() {
    var exist = await this.checkOtherUserMsgSelected();
    var ecss = exist ? 'alert-button-confirm1-1' : 'alert-button-confirm1';
    var msgSuffix = 'message';
    if (this.chatsService.selectedChats.length > 1) msgSuffix = 'messages';
    const alert = await this.alertController.create({
      header: 'Delete Message?',
      cssClass: 'fi-alert-header',
      // message: 'Are you sure you want to delete ' + this.chatsService.selectedChats.length + ' ' + msgSuffix + '?',
      buttons: [
        {
          text: 'Delete for everyone',
          cssClass: ecss,
          role: 'confirm',
          handler: async () => {
            await this.chatsService.deleteChatMessage(
              this.chatsService.selectedGroupId,
              'e'
            );
            this.clearSelectedChats();
          },
        },

        {
          text: 'Delete for Me',
          cssClass: 'alert-button-confirm2',
          role: 'confirm',
          handler: async () => {
            await this.chatsService.deleteChatMessage(
              this.chatsService.selectedGroupId,
              'm'
            );
            this.clearSelectedChats();
          },
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel1',
          role: 'cancel',
          handler: () => {
            /*   this.clearSelectedChats(); */
          },
        },
      ],
    });

    await alert.present();
  }

  checkOtherUserMsgSelected() {
    var exist = false;
    this.chatsService.selectedChats.forEach((chat: any) => {
      if (chat.fromid == this.otherPartyUser.UserId)
        exist = true;
    });
    return exist;
  }

  navigateUserToCanvas() {
    this.chatsService.goToViewConnection(this.otherPartyUser.UserId)
  }

  navigateUserToHome() { }

  clearSelectedChats() {
    this.chatsService.selectedChats = [];
    this.chatsService.selctedChatsJSONString = '';
  }
  onTextInput(event: any) {
    if (event.target.value == '') this.message = '';
    event.target.getInputElement().then((textArea: HTMLTextAreaElement) => {
      textArea.style.height = '46px';
      if (event.target.value == '') textArea.style.height = '46px';
      else textArea.style.height = `${textArea.scrollHeight}px`;
    });
  }

  onTextChange(event: any) {
    event.target.getInputElement().then((textArea: HTMLTextAreaElement) => {
      if (this.pasteevent) {
        textArea.style.height = '46px';
        this.pasteevent = false;
        textArea.style.height = `${textArea.scrollHeight}px`;
        textArea.scrollTop = 0;
      } else {
        if (event.target.value == '') textArea.style.height = '46px';
        else textArea.style.height = `${textArea.scrollHeight}px`;
      }
    });
  }

  pasteevent: boolean = false;
  onPaste() {
    this.pasteevent = true;
  }

  checkInputAllowed() {
    if (this.chatGroup && this.chatGroup[0].endchat) {
      this.message = '';
      this.chatsService.showtoast(
        this.otherPartyUser.DisplayName + ' has ended the chat'
      );
      return;
    }
  }

  /* private setFirstLetterToUppercase(string: string): string {
    // https://dzone.com/articles/how-to-capitalize-the-first-letter-of-a-string-in
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
  } */
}
