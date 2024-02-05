import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import * as lodash from 'lodash';
import { LongPressDirective } from 'src/app/core/directives/long-press.directive';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';

@Component({
  standalone: true,
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, LongPressDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatItemComponent implements OnInit {
  @Output() slide = new EventEmitter();
  @Input() chats: any[] | undefined;
  @Input() otherPartyUser: any;
  @Input() logInfo: any;
  constructor(
    public chatsService: ChatsService,
    private commonService: CommonService
  ) {
    console.log('otherPartyUserId', this.otherPartyUser);
  }

  messageDraged(
    event: { detail: { amount: number } },
    slidingItem: IonItemSliding,
    message: any
  ) {
    //alert("a");
    //console.log("message", message);
    //console.log("event details", event.detail);
    if (event.detail.amount < -80) {
      slidingItem.closeOpened();
      this.slide.emit(message);
    }
    return false;
  }

  ngOnInit() {

  }  

  longPressActions(chatMsg: { deleted: boolean; chatId: any }, str: any) {
    if (chatMsg.deleted == true || chatMsg.deleted == this.logInfo.UserId) {
      this.chatsService.showtoast('You can not select deleted message');
    } else {
      if (this.chatsService.selectedChats == '')
        this.chatsService.selectedChats = [];
      var index = lodash.findIndex(this.chatsService.selectedChats, {
        chatId: chatMsg.chatId,
      });
      if (index == -1) {
        this.chatsService.selectedChats.push(chatMsg);
        this.chatsService.selctedChatsJSONString = JSON.stringify(
          this.chatsService.selectedChats
        );
      } else {
        this.chatsService.selectedChats.splice(index, 1);
        this.chatsService.selctedChatsJSONString = JSON.stringify(
          this.chatsService.selectedChats
        );
      }
    }
    console.log(
      'deletingChatMsgSelection',
      this.chatsService.selctedChatsJSONString
    );
  }

  /* highLightSelectedChat(message) {
    var index = lodash.findIndex(this.chatsService.selectedChats, { chatId: message.chatId });
    if (index > 0)
      return "message-item-background";
    else
      return "";
  } */

  getRepliedMsgFromUsername(replyOfChatId: any) {
    if (replyOfChatId && this.chatsService.logInfo) {
      var chat = lodash.filter(this.chats, { chatId: replyOfChatId });
      if (this.chatsService.logInfo.UserId == Number(chat[0].fromid))
        return 'You';
      else return this.otherPartyUser.DisplayName;
    }
  }

  readmore(msg: { showNoOfChar: number }) {
    msg.showNoOfChar += 3000;
    console.log('msg.showNoOfChar', msg.showNoOfChar);
  }

/*   openChatEndToast() {
    this.commonService.presentToast(AppConstants.TOAST_MESSAGES.CHAT_END);
  }
  openWrongFormatImage() {
    this.commonService.presentToast(
      AppConstants.TOAST_MESSAGES.WRONG_FORMAT_IMG
    );
  } */
}
