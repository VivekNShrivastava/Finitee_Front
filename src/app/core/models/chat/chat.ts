export class Chat {
  chatId: any = null;//docid
  fromid: any;
  mediatype: any = 1;
  txt: string = "";
  path: string = "";
  seen: boolean = false;
  timestamp: any;
  deleted: boolean = false;
  pdeleted: boolean = false;
  replyOfChatId: any = "";
  replyOfChatMsg: any = "";
  status: any = "s";
  showNoOfChar: any = 768;
}
