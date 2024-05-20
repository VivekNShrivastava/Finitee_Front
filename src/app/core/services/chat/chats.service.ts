import { EventEmitter, Injectable } from '@angular/core';
//firbase for chat
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { NavigationExtras } from '@angular/router';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { addDoc, CACHE_SIZE_UNLIMITED, collection, deleteDoc, doc, enableIndexedDbPersistence, Firestore, getDoc, getDocs, getFirestore, initializeFirestore, onSnapshot, orderBy, Query, query, setDoc, terminate, updateDoc, where, writeBatch } from "firebase/firestore";
import * as lodash from 'lodash';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { environment } from 'src/environments/environment';
import * as config from 'src/app/core/models/config/ApiMethods';
import { Chat } from 'src/app/core/models/chat/chat';
import { ChatGroup } from 'src/app/core/models/chat/chat-group';
import { AttachmentHelperService } from '../attachment-helper.service';
import { CommonService } from '../common.service';
import { AppConstants } from '../../models/config/AppConstants';

import { FirestoreService } from '../firestore.service';


@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  readonly appConstants: any = AppConstants;
  FCM_TOKEN: any = "";
  selectedGroupId: any = "";
  selectedChats: any = [];
  selctedChatsJSONString = "";
  selectedChatGroups: any = [];
  selctedChatGroupsJSONString = "";
  firechatdb: any;
  logInfo: any;
  limit: any = 1000;
  isActiveCode: any = null;
  isSFUCount: any = 0
  progressBar: any = true;
  connectUserLst: any = [];
  uploadPhotoInprogress: any = false;
  messages: any = [];
  auth: any;
  private firestoreInstance: Firestore;
  public isRefersh: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public httpService: HttpClient,
    private nav: NavController,
    private toastCtrl: ToastController,
    private file: File,
    public socialSharing: SocialSharing,
    public commonService: CommonService,
    public attachmentService: AttachmentHelperService,
    private firestoreService: FirestoreService
  ) {
    this.firestoreInstance = firestoreService.getFirestoreInstance();

  }



  async terminateFireStore() {
    try {
      const app = await initializeApp(environment.firebaseConfig);
      this.firechatdb = await initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      });
      // this.firechatdb = getFirestore();
      await terminate(this.firechatdb);
      console.log("terminate firestore success");
      return true;
    }
    catch (e) {
      console.log("terminate firestore fail", e);
      return true;
    }
  }
  async initializeChatModule(logData: FiniteeUser) {
    return new Promise<any>(async (resolve, reject) => {
      // await this.terminateFireStore();
      // console.log("start intialiize firestore");
      // const app = await initializeApp(environment.firebaseConfig);
      // this.firechatdb = this.firestoreService.getFirestoreInstance();

      this.auth = await getAuth();
      // console.log("this.auth - ", this.auth);
      if (logData != null) {
        this.logInfo = logData;
        //this.attachmentService.user = logData;
        var serverResponse = await this.getFCMAuthToken();//calling server api to generate custom fcm token
        if (serverResponse) {
          var signInRes = await this.authenticateUserFromFCM(this.FCM_TOKEN);
          if (signInRes) {
            this.userVerifyLister();
            
            this.firechatdb = getFirestore();
            // this.firechatdb = this.firestoreService.getFirestoreInstance();
            // await this.enableOfflieModeInfirebase(this.firechatdb);
            // this.firechatdb = await initializeFirestore(app, {
            //   cacheSizeBytes: CACHE_SIZE_UNLIMITED
            // });
            await this.getChats(logData);
            resolve(true);
          }
          else
            reject(false);
        }
        else
          reject(false);
      }
    });
  }



  async authenticateUserFromFCM(FCM_TOKEN: any) {
    return new Promise<any>((resolve, reject) => {
      signInWithCustomToken(this.auth, FCM_TOKEN)
        .then(async (userCredential) => {
          // alert("Signed in pass")
          const user = userCredential.user;
          // console.log("user - authenticateUserFromFCM", user);
          resolve(true);
        })
        .catch((error) => {
          //alert("Signed in failed")
          console.log("error", error);
          resolve(false);
        });
    })
  }

  userVerifyLister() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        //alert(uid + "  user sign in");
        //alert(uid);
        // ...
      } else {
        //alert("user sign out");
        await this.getFCMAuthToken();//calling server api to generate custom fcm token
        await this.authenticateUserFromFCM(this.FCM_TOKEN);
        // User is signed out
        // ...
      }
    });
  }

  async enableOfflieModeInfirebase(db: any) {
    await enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });
  }

  getFCMAuthToken() {
    return new Promise<any>((resolve, reject) => {
      const params = {
      }
      this.progressBar = true;
      const method = config.FCM_TOKEN_API;
      this.httpService.post(method, params)
        .subscribe(async (result: any) => {
          this.progressBar = false;
          if (result != null) {
            this.FCM_TOKEN = result.token;
            // console.log("fcm token recieved", this.FCM_TOKEN);
            resolve(true);
          }
        },
          (error) => {
            console.log("abc error", error.error.text);
            this.progressBar = false;
            resolve(false)
          }
        );
    })
  }

  getAllConn() {
    return new Promise<any>((resolve, reject) => {
      const params = {
        "SearchKey": "",
        "Latitude": 19.2493769,
        "Longitude": 72.8666839
      }
      this.progressBar = true;
      const method = config.GET_USER_CONN;
      this.connectUserLst = [];
      this.httpService.post(method, params).subscribe(
        (result: any) => {
          this.progressBar = false;
          if (result.ResponseData != null) {
            // console.log(config.GET_USER_CONN, result.ResponseData);
            resolve(this.parseAllConnectionResponse(result.ResponseData));
          }
        },
        () => {
          this.progressBar = false;
          resolve(false)
        }
      );
    })
  }

  parseAllConnectionResponse(connectionList: any) {
    connectionList.forEach((element: any) => {
      //console.log(element);
      var user = { "UserId": element.UserId, "DisplayName": element.DisplayName, "ProfilePhoto": element.ProfilePhoto }
      //var user = { "UserId": "d6c3f2e6-02b7-4184-80ee-d9cab14f687f", "FullName": element.FirstName, "ProfilePhoto": element.ProfilePhoto }


      this.connectUserLst.push(user);
    });
    return connectionList;
  }


  updateProfileDataInFireBase(chatGroup: any[], otherPartyUserId: any) {
    return new Promise<any>((resolve, reject) => {
      const params = {
        "UserIds": [otherPartyUserId],
        "SearchKey": ""
      }
      this.progressBar = true;
      const method = config.GET_USER_PRO;
      this.connectUserLst = [];
      this.httpService.post(method, params).subscribe(
        (result: any) => {
          this.progressBar = false;
          if (result.ResponseData != null) {
            this.updateChatGroupProfiles(chatGroup[0], otherPartyUserId, result.ResponseData);
            resolve(true);
          }
        },
        () => {
          this.progressBar = false;
          resolve(false)
        }
      );
    })
  }


  // Get a list of cities from your database
  async getChats(loginInfo: any) {
    this.messages = [];
    const messageCollectionQuery = await query(collection(this.firechatdb, "messages"), where('users', 'array-contains-any', [loginInfo.UserId]));
    this.addGroupQueryListener(messageCollectionQuery, loginInfo);
    return this.messages;
  }

  addGroupQueryListener(messageCollectionQuery: any, loginInfo: any) {
    // Start listening to the group query.
    onSnapshot(messageCollectionQuery, { includeMetadataChanges: true }, (snapshot: { docChanges: () => any[]; }) => {

      snapshot.docChanges().forEach(async (change: { type: string; doc: { id: any; data: () => { (): any; new(): any; users: any; userProfiles: any; }; }; }) => {
        //console.log("addGroupQueryListener", change.type);
        if (change.type === 'added') {
          var chatGroups = lodash.filter(this.messages, { groupId: change.doc.id });
          if (chatGroups.length == 0) {
            var chatGroup = new ChatGroup();
            chatGroup.groupId = change.doc.id;
            chatGroup.users = change.doc.data().users;
            chatGroup.userProfiles = change.doc.data().userProfiles;
            var otherPatyDetails: any = await this.getOtherPartyDetails(change.doc.data().userProfiles, loginInfo);
            chatGroup.otherPartyUserId = otherPatyDetails.UserId;
            chatGroup.otherPartyUserName = otherPatyDetails.dn;
            chatGroup.otherPartyProfilePhoto = otherPatyDetails.dp;
            chatGroup.mute = otherPatyDetails.mute;
            chatGroup.endchat = otherPatyDetails.endchat;
            chatGroup.noOfUnreadMsg = 0;
            chatGroup.deleted = await this.checkChatDeletedOrNot(change.doc.data().userProfiles, loginInfo);
            let chatCollectionRef = await collection(this.firechatdb, `messages/${change.doc.id}/chats`); //chats is my sub-collection name
            let chatCollectionQuery = await query(chatCollectionRef, orderBy("timestamp", "asc"))
            this.messages.push(chatGroup);
            this.addChatQueryListener(chatCollectionQuery);
          }
        }
        else if (change.type === 'modified') {
          var chatGroups = lodash.filter(this.messages, { groupId: change.doc.id });
          var otherPatyDetails: any = await this.getOtherPartyDetails(change.doc.data().userProfiles, loginInfo);
          chatGroups[0].mute = otherPatyDetails.mute;
          chatGroups[0].endchat = otherPatyDetails.endchat;
          chatGroups[0].userProfiles = change.doc.data().userProfiles;
          var otherPatyDetails: any = await this.getOtherPartyDetails(change.doc.data().userProfiles, loginInfo);
          chatGroups[0].otherPartyUserId = otherPatyDetails.UserId;
          chatGroups[0].otherPartyUserName = otherPatyDetails.dn;
          chatGroups[0].otherPartyProfilePhoto = otherPatyDetails.dp;
          chatGroups[0].mute = otherPatyDetails.mute;
          chatGroups[0].endchat = otherPatyDetails.endchat;
          chatGroups[0].deleted = await this.checkChatDeletedOrNot(change.doc.data().userProfiles, loginInfo);
          this.isRefersh.emit(chatGroups[0].endchat);
        }
        else if (change.type === 'removed') {
          var itemIndex = this.messages.findIndex((i: { groupId: any; }) => i.groupId == change.doc.id);
          this.messages.splice(itemIndex, 1);
          this.initializeChatModule(this.logInfo);
        }
      });
    });
  }

  addChatQueryListener(chatCollectionQuery: any) {
    // Start listening to the group query.
    onSnapshot(chatCollectionQuery, { includeMetadataChanges: true }, (snapshot: { metadata: { hasPendingWrites: any; }; docChanges: (arg0: { includeMetadataChanges: boolean; }) => any[]; }) => {
      // console.log("snapshot", snapshot);
      //console.log("addChatQueryListener");
      const source = snapshot.metadata.hasPendingWrites;
      snapshot.docChanges({ includeMetadataChanges: true }).forEach((change: { doc: { data: () => any; id: any; metadata: { hasPendingWrites: any; }; }; type: string; }) => {
        //console.log("hasPendingWrites 1", change.doc.metadata);
        var queryData: any = JSON.stringify(chatCollectionQuery);
        var groupId = JSON.parse(queryData)._query.path.segments[1];
        var chatGroups = lodash.filter(this.messages, { groupId: groupId });

        if (chatGroups.length > 0) {
          var newChatMsg = change.doc.data();
          if (change.type === 'added') {
            //console.log("chatItem",newChatMsg);
            let chatItem = new Chat();
            chatItem.chatId = change.doc.id;
            chatItem.fromid = newChatMsg.fromid;
            chatItem.mediatype = newChatMsg.mediatype;
            chatItem.txt = newChatMsg.txt.trim();
            chatItem.path = newChatMsg.path;
            chatItem.timestamp = newChatMsg.timestamp.toDate();
            chatItem.deleted = newChatMsg.deleted;
            chatItem.pdeleted = newChatMsg.permanentDeteledFor && newChatMsg.permanentDeteledFor.includes(this.logInfo.UserId);
            if (change.doc.metadata.hasPendingWrites)
              chatItem.status = "p";
            else
              chatItem.status = newChatMsg.status;
            if (newChatMsg.fromid == this.logInfo.UserId && newChatMsg.path && newChatMsg.path.indexOf("localhost") != -1 && this.uploadPhotoInprogress == false) {
              this.deletePhoto(groupId, chatItem.chatId);
              return;
            }

            if (newChatMsg.replyOfChatId) {
              chatItem.replyOfChatId = newChatMsg.replyOfChatId;
              chatItem.replyOfChatMsg = newChatMsg.replyOfChatMsg;
            }

            chatGroups[0].chats.push(chatItem);
            if (newChatMsg.txt)
              chatGroups[0].lastmessage = newChatMsg.txt.trim();
            else
              chatGroups[0].lastmessage = "New Image";

            chatGroups[0].lastmessagestatus = newChatMsg.status;
            //alert(newChatMsg.deleted)
            if (newChatMsg.deleted)
              chatGroups[0].lastmessagesdeleted = newChatMsg.deleted;
            else
              chatGroups[0].lastmessagesdeleted = false;

            chatGroups[0].timestamp = newChatMsg.timestamp.toDate();

            if (newChatMsg.fromid != this.logInfo.UserId && chatItem.status != "r")
              chatGroups[0].noOfUnreadMsg++;


            if (newChatMsg.fromid != this.logInfo.UserId && newChatMsg.status == "s") {//s means sent
              this.updateChatStatus(groupId, change.doc.id, "d");
            }

          }
          else if (change.type === 'modified') {
            //console.log("chatGroup chats", chatGroups[0].chats);
            var chatMsg = lodash.filter(chatGroups[0].chats, { chatId: change.doc.id });
            //console.log("chatMsg", chatMsg);
            chatMsg[0].fromid = newChatMsg.fromid;
            chatMsg[0].mediatype = newChatMsg.mediatype;
            chatMsg[0].txt = newChatMsg.txt.trim();
            chatMsg[0].path = newChatMsg.path;
            if (change.doc.metadata.hasPendingWrites)
              chatMsg[0].status = "p";
            else
              chatMsg[0].status = newChatMsg.status;

            chatMsg[0].timestamp = newChatMsg.timestamp.toDate();
            chatMsg[0].deleted = newChatMsg.deleted;
            chatMsg[0].pdeleted = newChatMsg.permanentDeteledFor && newChatMsg.permanentDeteledFor.includes(this.logInfo.UserId);
            if (!newChatMsg.permanentDeteledFor || newChatMsg.permanentDeteledFor.length == 0) {
              chatGroups[0].lastmessagestatus = newChatMsg.status;
              if (newChatMsg.deleted)
                chatGroups[0].lastmessagesdeleted = newChatMsg.deleted;
              else
                chatGroups[0].lastmessagesdeleted = false;
            }

            if (newChatMsg.replyOfChatId) {
              chatMsg[0].replyOfChatId = newChatMsg.replyOfChatId;
              chatMsg[0].replyOfChatMsg = newChatMsg.replyOfChatMsg;
            }
          }
          else if (change.type === 'removed') {
            var itemIndex = chatGroups[0].chats.findIndex((i: { chatId: any; }) => i.chatId == change.doc.id);
            chatGroups[0].chats.splice(itemIndex, 1);
          }
          this.isRefersh.emit(false);
        }
      });
    });
  }

  async getOtherPartyDetails(groupUsers: any[], loginInfo: { UserId: any; }) {
    var otherPartyDetail = {};
    if (groupUsers?.length > 0) {
      groupUsers.forEach((user: { UserId?: any; }) => {
        //console.log("user", user + " " + Number(loginInfo.UserId));
        if (user.UserId != loginInfo.UserId)
          otherPartyDetail = user;
      });
    }
    return otherPartyDetail;
  }

  async checkChatDeletedOrNot(groupUsers: any[], loginInfo: { UserId: any; }) {
    var deleted = false;
    if (groupUsers?.length > 0) {
      groupUsers.forEach((user: { UserId: string; deleted: boolean; }) => {
        if (user.UserId == loginInfo.UserId)
          deleted = user.deleted;
      });
    }
    return deleted;
  }

  async createChatGroup(newGroupId: string, users: string[], userProfiles: { UserId: string; dn: any; dp: any; mute: boolean; deleted: boolean; }[]) {
    try {
      const groupRef = await setDoc(doc(this.firechatdb, "messages", newGroupId), {
        users: users,
        userProfiles: userProfiles
      });
      return groupRef;
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
      return "error";
    }
  }

  async createChatMessage(groupId: any, msgObj: Chat) {
    try {
      const messageRef: any = await addDoc(collection(this.firechatdb, `messages/${groupId}/chats`),
        {
          fromid: msgObj.fromid,
          mediatype: msgObj.mediatype,
          txt: msgObj.txt,
          path: msgObj.path,
          status: msgObj.status,
          timestamp: new Date(),
          replyOfChatId: msgObj.replyOfChatId,
          replyOfChatMsg: msgObj.replyOfChatMsg,
        }
      );
      return messageRef.id;
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
      return "error";
    }

  }

  async updatePhotoPath(selectedGroupId: any, chatId: string, path: any) {
    const docRef = doc(this.firechatdb, `messages/${selectedGroupId}/chats`, chatId);
    await updateDoc(docRef, {
      path: path
    });
    return true;
  }

  async deletePhoto(selectedGroupId: any, chatMsgId: string,) {
    const docRef = doc(this.firechatdb, `messages/${selectedGroupId}/chats`, chatMsgId);
    await deleteDoc(docRef);
    return true;
  }


  async updateChatStatus(selectedGroupId: any, chatId: string, status: string) {
    const docRef = doc(this.firechatdb, `messages/${selectedGroupId}/chats`, chatId);
    await updateDoc(docRef, {
      status: status
    });
    return true;
  }

  async deleteChatMessage(selectedGroupId: any, meOrEveryone: string) {
    await this.selectedChats.forEach(async (chatMsg: { chatId: string; }) => {
      const docRef = doc(this.firechatdb, `messages/${selectedGroupId}/chats`, chatMsg.chatId);
      var deleted = this.logInfo.UserId;
      if (meOrEveryone == "e")
        deleted = true;
      else if (meOrEveryone == "m") {
        const docSnap = await getDoc(docRef);
        var data: any = docSnap.data();
        //console.log("data", data);
        if (data.deleted && data.deleted != true)
          deleted = true;
      }
      //alert(deleted);
      await updateDoc(docRef, {
        deleted: deleted
      });
    });
    return true;
  }

  async deleteChatGroupAndChatCollection() {
    //this.httpService.showLoader(true);
    await this.selectedChatGroups.forEach(async (group: { groupId: any; }) => {
      await this.deleteChatGroup(group.groupId, true);
      await this.deleteChatCollection(group);
    });
    //this.httpService.hideLoader(true);
    this.selectedChatGroups = [];
    this.selctedChatGroupsJSONString = "";
    return true;
  }

  async deleteChatGroup(groupId: string, deleted: boolean) {
    const docRef = await doc(this.firechatdb, `messages`, groupId);
    const docSnap: any = await getDoc(docRef);
    if (docSnap.exists()) {
      var userProfiles = [...docSnap.data().userProfiles];
      userProfiles.forEach(user => {
        if (deleted && user.UserId == this.logInfo.UserId)
          user.deleted = deleted;

        if (!deleted)
          user.deleted = deleted;
      });
      console.log("Document data:", userProfiles);
      var res = await updateDoc(docRef, {
        userProfiles: userProfiles
      });
      console.log("aabb", res);
    }
  }

  async deleteChatCollection(group: { groupId: any; }) {
    const chatCollectionRef = await collection(this.firechatdb, `messages/${group.groupId}/chats`);
    const chatquery = await query(chatCollectionRef, orderBy("timestamp", "asc"))

    return new Promise((resolve: any, reject: any) => {
      this.deleteQueryBatch(this.firechatdb, chatquery, resolve).catch(reject);
    });
  }

  async deleteQueryBatch(db: Firestore, query: Query<unknown>, resolve: { (value: unknown): void; (): void; }) {
    const snapshot = await getDocs(query);
    // Delete documents in a batch
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      console.log("ap", doc.data());
      var data: any = doc.data();
      var permanentDeteledFor = [];
      if (data.permanentDeteledFor) {
        permanentDeteledFor = data.permanentDeteledFor;
      }
      if (!permanentDeteledFor.includes(this.logInfo.UserId))
        permanentDeteledFor.push(this.logInfo.UserId);

      batch.update(doc.ref, { permanentDeteledFor: permanentDeteledFor });
    });
    await batch.commit();
    resolve();
  }


  async muteChatGroup() {
    await this.selectedChatGroups.forEach(async (group: { groupId: string; }) => {
      const docRef = doc(this.firechatdb, `messages`, group.groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        var userProfiles = [...docSnap.data()['userProfiles']];
        userProfiles.forEach(user => {
          if (user.UserId != this.logInfo.UserId) {
            if (user.mute)
              user.mute = false;
            else
              user.mute = true;
          }
        });
        //console.log("mute userProfiles", userProfiles);
        await updateDoc(docRef, {
          userProfiles: userProfiles
        });
      }
    });

    this.selectedChatGroups = [];
    this.selctedChatGroupsJSONString = "";
    return true;
  }

  async updateChatGroupProfiles(group: { groupId: string; }, otherPartyUserId: any, apiresponse: {
    FullName: any; UserProfileImage: any;
  }[]) {
    const docRef = doc(this.firechatdb, `messages`, group.groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var userProfiles = [...docSnap.data()['userProfiles']];

      userProfiles.forEach(user => {
        if (user.UserId == otherPartyUserId) {
          user.dn = apiresponse[0].FullName;
          user.dp = apiresponse[0].UserProfileImage;
        }
      });
      //console.log("mute userProfiles", userProfiles);
      await updateDoc(docRef, {
        userProfiles: userProfiles
      });
    }

    return true;
  }

  async exportChat() {
    this.commonService.showLoader();
    var stringToWrite: any = await this.prepareDataForExportChat();

    console.log("stringToWrite", stringToWrite);
    if (stringToWrite != "") {
      var blob = new Blob([stringToWrite], { type: "text/plain" });
      var filename = "Whatsapp Chat Msg " + this.selectedChatGroups[0].otherPartyUserName + ".txt"
      this.file.writeFile(this.file.dataDirectory, filename, blob, { replace: true, append: false }).then((file: FileEntry) => {
        console.log("ap", file);
        this.commonService.hideLoader();
        var options = {
          message: 'share this', // not supported on some apps (Facebook, Instagram)
          subject: file.name, // fi. for email
          files: [file.nativeURL], // an array of filenames either locally or remotely
        };
        this.selectedChatGroups = [];
        this.selctedChatGroupsJSONString = "";
        this.socialSharing.shareWithOptions(options).then(() => {
          // Sharing via email is possible
        }).catch(() => {
          // Sharing via email is not possible
        });;
      })
    }
    else {
      this.showtoast("No chats found!")
    }
  }

  async prepareDataForExportChat() {
    return new Promise<any>(async (resolve) => {
      var data = "";
      if (this.selectedChatGroups.length > 0) {
        await this.selectedChatGroups[0].chats.forEach((chat: { mediatype: number; pdeleted: any; fromid: any; timestamp: moment.MomentInput; txt: string; }, index: number) => {
          if (chat.mediatype == 1 && !chat.pdeleted) {
            var user = lodash.filter(this.selectedChatGroups[0].userProfiles, { UserId: chat.fromid });
            var innerdata = moment(chat.timestamp).format('YYYY-MM-DD HH:mm:ss') + " - " + user[0].dn + " - " + chat.txt + "\n";
            data += innerdata;
            //console.log("data", data);
          }
          if (index == (this.selectedChatGroups[0].chats.length - 1)) {
            resolve(data);
          }
        });
      }
      else {
        resolve(data);
      }

    })
  }

  async endChat(val: boolean) {
    if (this.selectedGroupId) {
      //var chatGroups = lodash.filter(this.messages, { groupId: this.selectedGroupId });
      const docRef = doc(this.firechatdb, `messages`, this.selectedGroupId);
      //var userProfiles = chatGroups[0].userProfiles;
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        var userProfiles = [...docSnap.data()['userProfiles']];
        userProfiles.forEach(user => {
          if (user.UserId == this.logInfo.UserId)
            user.endchat = val;
        });
        //console.log("mute userProfiles", userProfiles);
        await updateDoc(docRef, {
          userProfiles: userProfiles
        });
      }
    }
    return true;
  }

  async uploadPhotos(photoUploadData: any) {
    this.uploadPhotoInprogress = true;
    console.log("photoUploadData", photoUploadData);
    const formData = new FormData();
    photoUploadData.forEach((res: { blob: any; photoName: any; }) => {
      formData.append('file', res.blob, res.photoName);
    });

    const response: any = await this.attachmentService.uploadFileToServerv2(formData);
    if (response != "error") {
      //console.log("🚀 ~ setPost ~ response", response);
      var responseData = response.ResponseData;
      responseData.forEach(async (photo: { filepath: any; }, index: number) => {
        await this.updatePhotoPath(photoUploadData[index].groupId, photoUploadData[index].chatId, photo.filepath);
        if (index == (photoUploadData.length - 1)) {
          this.uploadPhotoInprogress = false;
        }
      });
    }
    else {
      this.showtoast('Photo upload failed Please try again later');
      photoUploadData.forEach((photo: any, index: any) => {
        this.deletePhoto(photo.groupId, photo.chatId);
      });
      this.uploadPhotoInprogress = false;
    }
  }

  async openChat(selctedUser: { UserId: any; DisplayName: any; ProfilePhoto: any; groupId: any; }, isModal?: boolean ) {
    console.log("chatOrUser", selctedUser);
    var groupId: any = "";
    if (selctedUser.groupId)
      groupId = selctedUser.groupId;
    else
      groupId = await this.getGroupIdIfChatThreadAlreadyStarted(selctedUser.UserId);

    console.log("ashish groupId" + groupId)
    const navigationExtras: NavigationExtras = {
      state: {
        data: {
          UserId: selctedUser.UserId,
          DisplayName: selctedUser.DisplayName,
          ProfilePhoto: selctedUser.ProfilePhoto
        },
        groupId : groupId
      }
    };
    if(isModal){
      return Promise.resolve(navigationExtras)
      // return navigationExtras;
    }else{
      if (groupId != "")
        this.nav.navigateForward([`/chat-detail/${groupId}`], navigationExtras);
      else
        this.nav.navigateForward([`/chat-detail/new`], navigationExtras);  
        return Promise.resolve(navigationExtras);
    }
    
  }

  async getGroupIdIfChatThreadAlreadyStarted(otherPartyUserId: any) {
    var group1 = "Group#" + this.logInfo.UserId + "_" + otherPartyUserId;
    var groupId: any = await this.getGroupDocByDocId(group1);
    if (groupId == "") {
      var group2 = "Group#" + otherPartyUserId + "_" + this.logInfo.UserId;
      groupId = await this.getGroupDocByDocId(group2);
    }
    return groupId;
  }

  async getGroupDocByDocId(docId: string) {
    const docRef = doc(this.firechatdb, "messages", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docId;//{ "docid": docId, data: docSnap.data() }
    } else {
      // doc.data() will be undefined in this case
      return "";
    }
  }

  async showtoast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 700,
      cssClass: 'custom-toast',
    });
    toast.present();
  }


  goToViewConnection(UserId: any) {
    const navEx: NavigationExtras = {
      state: {
        data: {
          id: UserId
        }
      }
    };
    console.log('view ', navEx);
    this.nav.navigateForward(['view-connection'], navEx);
  }
}