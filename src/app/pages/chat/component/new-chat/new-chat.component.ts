import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ModalController, NavParams } from '@ionic/angular';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';

@Component({
  standalone: true,
  selector: 'app-new-chats',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewChatComponent implements OnInit {
  readonly appConstants: any = AppConstants;
  connectUserLst: any = [];
  chatsList: any = [];
  logInfo!: FiniteeUser;
  inProgress: any = true;
  searchshow: any = false;
  pageevent: any = "New Chat";
  constructor(
    private menu: MenuController,
    public authService: AuthService,
    private modalController: ModalController,
    public chatService: ChatsService,
    private navParams: NavParams
  ) {
    this.pageevent = this.navParams.data['event'];
    if (this.pageevent != "New Chat") {
      this.chatsList = this.chatService.messages;
      console.log(this.chatsList, "chatList is@@");
    }
  }

  async ionViewDidEnter() {
    this.logInfo = await this.authService.getUserInfo();
    this.dataInit();
  }

  ngOnInit() {

  }


  async dataInit() {
    this.inProgress = true;
    await this.chatService.getAllConn();
    this.inProgress = false;
    this.connectUserLst = [...this.chatService.connectUserLst];
    console.log("abcd", this.connectUserLst);
  }

  handleChange(event: any) {
    if (this.pageevent != "New Chat") {
      const query = event.target.value.toLowerCase();
      this.chatsList = this.chatService.messages.filter((d: { otherPartyUserName: string; }) => d.otherPartyUserName.toLowerCase().indexOf(query) > -1);
    }
    const query = event.target.value.toLowerCase();
    this.connectUserLst = this.chatService.connectUserLst.filter((d: { DisplayName: string; }) => d.DisplayName.toLowerCase().indexOf(query) > -1);
  }

  closeSearch() {
    this.searchshow = false;
    if (this.pageevent != "New Chat") {
      this.chatsList = this.chatService.messages.filter((d: { otherPartyUserName: string; }) => d.otherPartyUserName.toLowerCase().indexOf("") > -1);
    }
    this.connectUserLst = this.chatService.connectUserLst.filter((d: { DisplayName: string; }) => d.DisplayName.toLowerCase().indexOf("") > -1);
  }


  toggleMenu() {
    this.menu.toggle();
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  forwardMsg(selectedChatGroup: {
    otherPartyUserName: any; otherPartyUserId: any;
  }) {
    console.log(selectedChatGroup, "list of user od chatlist");
    var user = { UserId: selectedChatGroup.otherPartyUserId, name: selectedChatGroup.otherPartyUserName }
    this.modalController.dismiss(user);
  }

  openNewChatWindow(user: any) {
    console.log(user, "list of user od chatlist");
    if (user.ProfilePhoto == undefined)
      user.ProfilePhoto = null;
    this.modalController.dismiss(user);
  }



  /* closeSearch() {
    this.searchshow = false;
  } */
}
