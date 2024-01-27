import { Chat } from './chat';

export class ChatGroup {
  groupId: any = null;//docid
  userProfiles: Array<any> = [];
  users: Array<Number> = [];
  otherPartyUserId!: Number;
  otherPartyUserName: string = "";
  otherPartyProfilePhoto: string = "assets/dummy/avatar2.png";
  lastmessage: string = "";
  lastmessagestatus: string = "";
  lastmessagesdeleted: any = false;
  noOfUnreadMsg: number = 0;
  chats: Array<Chat> = [];
  timestamp: string = "";
  mute: any = false;
  endchat: any = false;
  deleted: any = false;
}
