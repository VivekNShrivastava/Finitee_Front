import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Post } from 'src/app/core/models/post/post';
import { UserTrait, UserTraitWithPost } from 'src/app/core/models/post/userTrait';
import { UserCanvasProfile, UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { FreeUserCanvasService } from 'src/app/core/services/canvas-home/freeuser-canvas.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PostService } from 'src/app/core/services/post.service';
import { ReportService } from 'src/app/core/services/report.service';
import { userReport } from 'src/app/core/models/report';


@Component({
  selector: 'app-free-user-canvas',
  templateUrl: './free-user-canvas.page.html',
  styleUrls: ['./free-user-canvas.page.scss'],
})
export class FreeUserCanvasPage extends BasePage implements OnInit {


  traitInput: any = "";
  editTraitInput: any = "";

  userProfile: UserProfile = new UserProfile();
  postList: Array<Post> = [];
  beamedpostList: Array<Post> = [];
  userTraitList: Array<UserTrait> = [];
  userTraitPostList: Array<UserTraitWithPost> = [];

  userCanvasProfile : UserCanvasProfile = new UserCanvasProfile();
  userPrivate: any = '';
  loadPrivateUser: boolean = false;
  selectedTraitObj: any = "";
  selectedTab: any = 'all'
  isTraitModalOpen: boolean = false;
  isEditTraitModalOpen: boolean = false;
  loaded: boolean = false;
  navParams: any;
  userId: string = "";
  constructor(private router: Router,
    private connectionsService: ConnectionsService,
    private authService: AuthService,
    private _userProfileService: ProfileService,
    public _userService: FreeUserCanvasService,
    private _postService: PostService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private connectionService: ConnectionsService,
    private commonService: CommonService,
    private chatService: ChatsService,
    private _inflowService: InflowsService,
    private reportService: ReportService) {
    super(authService);
    // console.log(this.router!.getCurrentNavigation()!.extras.state, "constructor"); // should log out 'bar'

    console.log("routed to free-user-canvas", this.router!.getCurrentNavigation()!.extras.state)
    if (this.router!.getCurrentNavigation()!.extras.state) {
      this.navParams = this.router!.getCurrentNavigation()!.extras.state!['data'];

      console.log("this.navParams", this.navParams);
      this.userId = this.navParams.UserId || this.logInfo.UserId;
      if (this.navParams.UserId)
        this.userId = this.navParams.UserId;
      if (this.navParams.Id)
        this.userId = this.navParams.Id;
    }
    else {
      this.userId = this.logInfo.UserId;
    }
    console.log("free-user-canvas");
    this.subscribePostSubject();
    this.subscribeTraitPostSubject();
  }
  async subscribePostSubject() {
    this._postService.traitList.subscribe({
      next: (result: any) => {
        if (result.event == "ADD"){
          // result.data.Thumbnail = null;
          this.userTraitPostList.unshift(result.data);
          this.loaded=false;
          this.getUserTraitsWithPost();
        }
      }
    });
  }

  navigateToConnections() {
    this.navCtrl.navigateRoot('/tabs/connections');
  }
  
  async subscribeTraitPostSubject() {
    this._postService.postDataSbj.subscribe({
      next: (result: any) => {
        if (result.event == "ADD"){
       
          this.postList.unshift(result.data.post);
          console.log("posList",this.postList)
          if(result.isTraitPost)
          {
            // this.loaded=false;
            // this.getUserPost();
            // this.getUserTraitsWithPost();
          }
        }
        else if (result.event == "DELETE") {
          var deletedPostId = result.data;
          var deletedPostIndex = _.findIndex(this.postList, { Id: deletedPostId });
          if(deletedPostIndex != -1){
            this.postList.splice(deletedPostIndex, 1);
          }
          
        }
      }
    });
  }

  updateFontSize(PostDescription: any) {
    // const maxLength = 2000; // Your character limit
    // const currentLength = PostDescription.length;
    // const fontSizePercentage = (currentLength / maxLength) * 100;
    // const newSize = 15 - fontSizePercentage * 0.05; // Adjust the factor as needed
    return `${14}px`;
  }

  truncateText(text: string, limit: number): string {
    if (text.length <= limit) {
      return text;
    } else {
      return text.substring(0, limit);
    }
  }

  

  async ionViewDidEnter(){
    console.log("ionViewDidEnter");
  }

  ngOnInit() {
    
    this._userProfileService.updateUserStats(this.userId);
    console.log("oninit")
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    await this.getUserProfileData();
    // console.log("freeUserProfile", this.userCanvasProfile)
    await this.getUserPost();
  }

  // ngOnDestroy() {
  //   console.log('OnDestroy called');
  //   // Unsubscribe from the observable to avoid memory leaks
  //   // this.subscription.unsubscribe();
  // }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getUserProfileData();
      event.target.complete();
    }, 2000);
  }

  segmentChange(data: any) {
    console.log(data);
    this.loaded = false;
    switch (data.detail.value) {
      case 'all':
        this.getUserPost();
        break;
      case 'traits':
        this.getUserTraitsWithPost(true);
        break;
      case 'beams':
        this.getUserBeams();
    }
  }


  async getUserProfileData() {
    this.userCanvasProfile = await this._userProfileService.getUserCanvas(this.userId, this.logInfo.UserId);
    // this.userProfile = await this._userProfileService.getUserProfile(this.userId, this.logInfo.UserId);
    
    this.userTraitList = await this._postService.getUserTrait(this.userId);
    // console.log("traitlist", this.userTraitList)
    this.userPrivate = this.userTraitList;
    if(this.userPrivate.user === "Private"){
      this.loadPrivateUser = true;
      this.loaded = true;
    }

    
  }

  async getUserPost() {
    this.postList = await this._postService.getPostByUserId(this.userId, AppConstants.POST_TYPE.ALL);
    this.loaded = true;
  }

  async getUserTraitsWithPost(traitSection?: boolean) {
    this.userTraitPostList = await this._postService.getUserTraitWithPost(this.userId);
    console.log("userTrait", this.userTraitPostList);
    this.loaded = true;
    if(!traitSection) this.openTraitList();
  }

  async getUserBeams() {
    this.beamedpostList = await this._postService.getPostByUserId(this.userId, AppConstants.POST_TYPE.BEAM_POST);
    this.loaded = true;
  }

  /* connection releated function */
  async sendConnectionReqPopup() {
    if (!this.userCanvasProfile.IsConnected && !this.userCanvasProfile.IsRequestExits) {
      const alert = await this.alertController.create({
        header: `Add a note to the connection request to ${this.userCanvasProfile.canvasProfile.DisplayName}?`,
        cssClass: 'add-user-alert',
        inputs: [
          {
            name: 'note',
            type: 'textarea',
            placeholder: 'Type your note here..',
            cssClass: 'add-user-alert-textarea',
          },
        ],
        buttons: [
          {
            text: 'Send',
            role: 'send',
            cssClass: 'add-user-alert-send-button',
            handler: (data: any) => {
              this.sendConnectionRequest(data.note);
              alert.dismiss();
            }
          },
          {
            text: 'Send without note',
            role: 'send-without-note',
            cssClass: 'add-user-alert-send-without-button',
            handler: (data: any) => {
              this.sendConnectionRequest(data.note);
              alert.dismiss();
            }
          },
          {
            text: 'X',
            role: 'cancel',
            cssClass: 'add-user-alert-close-button',
          },
        ],
      });

      await alert.present();
    }else if(this.userCanvasProfile.IsRequestTo && this.userCanvasProfile.IsRequestTo){
      // this.router.navigate(['tabs/connections'], { state: { key: 'requests' } })
      const alert = await this.alertController.create({
        header: `You Have A Connection Request!`,
        cssClass: 'add-user-alert',
        buttons: [
          {
            text: 'Decline',
            role: 'reject',
            cssClass: 'add-user-alert-send-button',
            handler: (data: any) => {
              this.requestAction(false, this.userId);
            }
          },
          {
            text: 'Accept',
            role: 'confirm',
            cssClass: 'add-user-alert-send-without-button',
            handler: (data: any) => {
              this.requestAction(true, this.userId);
              alert.dismiss();
            }
          },
          {
            text: 'X',
            role: 'close',
            cssClass: 'add-user-alert-close-button',
            handler: (data: any) => {
              alert.dismiss();
            }
          },
        ],
      });

      await alert.present(); 
    
    }
    else if(this.userCanvasProfile.IsRequestExits && !this.userCanvasProfile.IsRequestTo){
      // this.commonService.presentToast(this.appConstants.TOAST_MESSAGES.CON_REQ_ALR_SENT);

      const alert = await this.alertController.create({
        header: `Do you want to cancel the request ?`,
        cssClass: 'add-user-alert',
        buttons: [
          {
            text: 'Cancel',
            role: 'reject',
            cssClass: 'add-user-alert-send-button',
            handler: (data: any) => {
              alert.dismiss();
            }
          },
          {
            text: 'Confirm',
            role: 'confirm',
            cssClass: 'add-user-alert-send-without-button',
            handler: (data: any) => {
              this.cancelConnectionReq(false, this.userId)
              alert.dismiss();
            }
          },
          {
            text: 'X',
            role: 'close',
            cssClass: 'add-user-alert-close-button',
            handler: (data: any) => {
              console.log("cancel")
              alert.dismiss();
            }
          },
        ],
      });

      await alert.present(); 
    }
  }

  async cancelConnectionReq(reqAcceptOrDecline: boolean, UserId: string){
    var res = await this.connectionService.cancelConnectionRequest(reqAcceptOrDecline, UserId);
    console.log("request cancelled!!", res);
    if(res){
      this.userCanvasProfile.IsRequestExits = false;
      this.getConnectionIcon();
    }
  }

  async requestAction(reqAcceptOrDecline: boolean, UserId: string) {

    
    var res = await this.connectionsService.actionConnectionRequest(reqAcceptOrDecline, UserId);
    if(res){
      if(!reqAcceptOrDecline){
        this.userCanvasProfile.IsRequestExits = false;
        this.userCanvasProfile.IsRequestTo = false;
        this.getConnectionIcon();
      }else{
        this.userCanvasProfile.IsConnected = true;
        this.getConnectionIcon();
      }
      
    }
  }

  async sendConnectionRequest(note: any) {
    var res = await this.connectionService.sendConnectionRequest(this.userId, note);
    if (res) {
      this.userCanvasProfile.IsRequestExits = true;
      this.getConnectionIcon();
    }
  }

  getConnectionIcon() {
    var iconName = 'free-user-request-white-icon';
    if (this.userCanvasProfile.IsConnected)
      return iconName = 'free-user-connected-white-icon';
    else if (this.userCanvasProfile.IsRequestTo === true)
      iconName = 'free-user-recieved-white-icon';
    else if (this.userCanvasProfile.IsRequestExits)
      iconName = 'free-user-pending-white-icon';
      
    return iconName
  }

  viewConnectedMembers() {
    this.navEx!.state!['data'] = this.userId;
    this.router.navigateByUrl(`tabs/free-user-canvas/connected-members/${this.userId}`, this.navEx);
    // this.navCtrl.navigateForward('connected-members');

    /*     this.router.navigate(['connected-members'], this.navEx); */
  }


  startChat() {
    //var existingChatGroupId = this.chatService.getGroupIdIfChatThreadAlreadyStarted(this.userId);
    var selctedUser: any = {
      UserId: this.userId,
      DisplayName: this.navParams.UserName,
      ProfilePhoto: this.navParams.ProfileImage == undefined ? null : this.navParams.ProfileImage,
      groupId: ""
    }
    console.log('start-chatting...', selctedUser);
    this.chatService.openChat(selctedUser);
  }


  async CreatePostAction(DisplayName: string) {
    
    if (this.userId == this.logInfo.UserId) {
      const actionSheet = await this.actionSheetCtrl.create({
        cssClass: 'product-option-action-sheet',
        buttons: [
          {
            text: 'Post',
            icon: 'free-user-post',
            cssClass: 'product-option-action-sheet-button',
            data: 'Post',
          },
          {
            text: 'Trait Post',
            icon: 'free-user-trait-post',
            cssClass: 'product-option-action-sheet-button fi-extra-margin',
            data: 'TraitPost',
          }
        ],
      });

      await actionSheet.present();
      const result = await actionSheet.onDidDismiss();
      if (result.data == 'Post') {
        this.addPost(DisplayName);
      } else if (result.data == 'TraitPost') {

        this.addPostTest(DisplayName);
        //removed for testing
        // this.traitInput = "";
        // this.isTraitModalOpen = true;
        // this.userTraitList = await this._postService.getUserTrait(this.userId);
      }
    }
    else {
      // this.addPost();S
    }
  }

  async openTraitList(){
    this.traitInput = "";
    this.isTraitModalOpen = true;
    this.userTraitList = await this._postService.getUserTrait(this.userId);
  }

  openPostScreen(post: any) {
    this.navEx!.state!['postlist'] = this.postList;
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
    this.navEx!.state!['event'] = "POSTLIST";
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  openBeamPostScreen(post: any) {
    this.navEx!.state!['postlist'] = this.beamedpostList;
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  traitTextChange(e: any) {
    if (this.traitInput != "")
      this.selectedTraitObj = "";
  }

  selectedUserTrait(data: any) {
    var obj = _.find(this.userTraitList, { Id: data.detail.value });
    if (obj) {
      this.traitInput = "";
      this.selectedTraitObj = obj;
    }
  }


  async saveUserTrait(action: any) {
    if (action == "EDIT") {
      this.editUserTrait.Trait = this.editTraitInput;
      var res = await this._postService.saveUserTrait(this.editUserTrait);
      if (res) {
        this.userTraitPostList.every((element: any) => {
          if (element.UserTrait.Id == this.editUserTrait?.Id) {
            element = this.editUserTrait;
            return false;
          }
          return true;
        });
        this.isEditTraitModalOpen = false;
      }
    }
    else {
      if (this.traitInput != "" && this.userTraitList.length > 0) {
        var t = this.traitInput;
        var traitIndex = _.findIndex(this.userTraitList, function (o) { return o.Trait.toLowerCase() == t.toLowerCase(); });
        if (traitIndex != -1) {
          this.commonService.presentToast("You have already created trait for same name");
          return;
        }
      }
      this.isTraitModalOpen = false;
      
      console.log("selectedTrait -", this.selectedTraitObj);
      console.log("inpit -", this.traitInput);
      if(this.traitInput != "" || this.selectedTraitObj != ""){
        setTimeout(() => {
          if (this.traitInput != "") {
            this.navEx.state!['traitInput'] = this.traitInput;
            this.router.navigateByUrl('create-trait', this.navEx);
            // var userTrait: UserTrait = new UserTrait();
            // userTrait.Trait = this.traitInput;
            // this.addPost(userTrait);
  
  
          } else {
            this.addPost(this.selectedTraitObj);
          }
        }, 200);
      }else{
        this.isTraitModalOpen = true;
        this.commonService.presentToast('Choose a Trait, or create new one');
      }
      
      
    }
  }

  editPersonal() {
    this.navEx!.state!['data'] = this.userCanvasProfile;
    // this.router.navigateByUrl('edit-personal', this.navEx);
    this.navCtrl.navigateForward(`edit-personal`, this.navEx);

  }


  async presentMenuModalForOther() {
    var btns = [
      {
        text: 'Profile',
        icon: 'right-menu-profile',
        cssClass: 'product-option-action-sheet-button',
        data: 'profile',
      },
      {
        text: 'eCard',
        icon: 'right-menu-ecard',
        cssClass: 'product-option-action-sheet-button',
        data: 'eCard',
      },
      {
        text: 'Start receiving inflows',
        icon: 'inflowset',
        cssClass: 'product-option-action-sheet-button',
        data: 'inflows',
      },
      {
        text: 'Refer User',
        icon: 'referuser',
        cssClass: 'product-option-action-sheet-button',
        data: 'Recommend',
      },
      {
        text: 'Report',
        icon: 'user-report',
        cssClass: 'product-option-action-sheet-button',
        data: 'Report',
      },
      {
        text: 'Block User',
        icon: 'user-block',
        cssClass: 'product-option-action-sheet-button',
        data: 'Block',
      },
    ];
    if (this.userCanvasProfile.IsInflowsStarted) {
      btns[2].text = "Stop receiving inflows";
      btns[2].icon = "inflowsred";
    }
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'three-dot-action-sheet',
      buttons: btns
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'profile') {
      console.log("Navigating to the user----->", this.navParams)
      this.navEx!.state!['data'] = this.navParams;
      this.navCtrl.navigateForward(`fr-profile/${this.userId}`, this.navEx);
    }
    else if (result.data == 'eCard') {
      this.router.navigateByUrl(`e-card/${this.userId}`);
    }
    else if (result.data == 'Recommend') {
      this.recommendUser();
    }
    else if (result.data == 'inflows') {
      var response = await this._inflowService.startStopRecivingInflows(this.userId, !this.userCanvasProfile.IsInflowsStarted);
      if (response) {
        this.userCanvasProfile.IsInflowsStarted = !this.userCanvasProfile.IsInflowsStarted;
        if (this.userCanvasProfile.IsInflowsStarted)
          this.userCanvasProfile.InflowsCount++;
        else
          this.userCanvasProfile.InflowsCount--;
      }
    }else if (result.data == 'Report') {
      this.presentRadioAlert();
    }
  }

  async presentRadioAlert() {
    const alert = await this.alertController.create({
      header: 'Report User',
      inputs: [
        {
          name: 'option1',
          type: 'radio',
          label: 'I disagree with this user',
          value: 'I disagree',
          checked: true, // Set this to true for the default selected option
        },
        {
          name: 'option2',
          type: 'radio',
          label: 'Targeted harassment - posted or...',
          value: 'Targeted harassment',
        },
        {
          name: 'option3',
          type: 'radio',
          label: 'Spam',
          value: 'Spam',
        },{
          name: 'option4',
          type: 'radio',
          label: 'Inappropriate name',
          value: 'Inappropriate name',
        },{
          name: 'option5',
          type: 'radio',
          label: 'Threatening content',
          value: 'Threatening content',
        },{
          name: 'option6',
          type: 'radio',
          label: 'Impersonation',
          value: 'Impersonation',
        },{
          name: 'option7',
          type: 'radio',
          label: 'Private information',
          value: 'Private information',
        },
      ],
      buttons: [
        {
          text: 'Send Report',
          handler: (selectedValue) => {
            // Handle the selected value here
            var user_Report = new userReport();
            user_Report.nodeId = this.userId;
            user_Report.report = selectedValue;
            console.log('Selected Value:', selectedValue);
            this.reportService.userReport(user_Report)
          },
        },
      ],
    });

    await alert.present();
  }


  recommendUser() {
    this.navEx!.state!['data'] = this.userCanvasProfile;
    this.router.navigateByUrl('recommend-user', this.navEx);
  }

  //testing
  addPostTest(DisplayName:string){
    this.navEx!.state!['data'] = { belongsToId: this.userId, Type: this.appConstants.POST_TYPE.USER, DisplayName: DisplayName };
    this.router.navigateByUrl(`post/add-post-test`, this.navEx);
    }

  addPost(DisplayName:string, trait?: UserTrait) {
    if (trait)
      this.navEx!.state!['data'] = { belongsToId: trait.Id, Type: this.appConstants.POST_TYPE.TRAIT, DisplayName: DisplayName ,TraitRequest: trait };
    else
      this.navEx!.state!['data'] = { belongsToId: this.userId, Type: this.appConstants.POST_TYPE.USER, DisplayName: DisplayName };
    this.router.navigateByUrl(`post/add-post`, this.navEx);
    this.traitInput = "";
  }

  traitPostsSection(userTrait: UserTraitWithPost) {
    this.navEx!.state!['value'] = { belongsToId: userTrait.UserTrait.Id, Type: this.appConstants.POST_TYPE.TRAIT, TraitRequest: userTrait.UserTrait };

    this.navEx!.state!['data'] = userTrait.UserTrait;
    this.router.navigateByUrl('free-user-canvas/trait-section', this.navEx);
  }

  async openTraitOption(userTraitWithPost: UserTraitWithPost) {
    var btns = [
      {
        text: 'Edit Trait',
        icon: 'edit-product',
        cssClass: 'product-option-action-sheet-button',
        data: 'edit'
      },
      {
         text: 'Delete Trait',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'delete'
      }
    ];

    if (userTraitWithPost.LastPostData && userTraitWithPost.LastPostData.image == "") {
      var obj: any = {
        text: 'Delete Trait',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'delete'
      };
      btns.push(obj);
    }


    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: btns,
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data == 'delete') {
      // this.deleteTrait(userTraitWithPost.UserTrait.Id);
      this.confirmDeleteTrait(userTraitWithPost.UserTrait.Id);
    } else if (result.data == 'edit') {
      // this.editTraitPopup(userTraitWithPost.UserTrait);
      console.log(userTraitWithPost.UserTrait);
      this.navEx!.state!['data'] = userTraitWithPost.UserTrait;
      this.router.navigateByUrl('edit-trait', this.navEx)
    }
  }

  async confirmDeleteTrait(id: string) {


    const alert = await this.alertController.create({
      header: 'Are you sure you want to Delete the trait, as deleting the trait will delete all the posts associated with the trait?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: async () => {
          },
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',
          role: 'delete',
          handler: async () => {
            this.deleteTrait(id);

            // await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Photos);
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteTrait(traitId: any) {
    var res = await this._postService.deleteUserTrait(traitId);
    if (res) {
      this.userTraitPostList.every((element: any, index) => {
        if (element.UserTrait.Id == traitId) {
          this.userTraitPostList.splice(index, 1);
          return false;
        }
        return true;
      });
    }
  }

  editUserTrait: UserTrait = new UserTrait();
  editTraitPopup(userTrait: UserTrait) {
    this.isEditTraitModalOpen = true;
    this.editTraitInput = userTrait.Trait;
    this.editUserTrait = userTrait;
  }

  ngDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this._postService.postDataSbj) {
      this._postService.postDataSbj.unsubscribe();
    }
  }

  openImage(imagePath: any) {
    this.navEx!.state!['data'] = imagePath;
    this.router.navigateByUrl('media-viewer', this.navEx);
  }
}


/* async filterUserTraitPost() {
  this.userTraitPostList = [];
  this.userTraitList.forEach(async (userTrait) => {
    var userTraitWithPost = new UserTraitWithPost();
    var traitPost = await _.filter(this.postList, { BelongsToId: userTrait.Id.toString() })
    var lastPostData = { desc: "", image: "" };
    if (traitPost.length > 0) {
      lastPostData.desc = traitPost[(traitPost.length - 1)].PostDescription;
      if (traitPost[(traitPost.length - 1)].PostImages && traitPost[(traitPost.length - 1)].PostImages.length > 0)
        lastPostData.image = traitPost[(traitPost.length - 1)].PostImages[traitPost[(traitPost.length - 1)].PostImages.length - 1];
    }
    var userTraitWithPost = new UserTraitWithPost();
    userTraitWithPost.UserTrait = userTrait;
    userTraitWithPost.TraitPosts = traitPost;
    userTraitWithPost.LastPostData = lastPostData;
    this.userTraitPostList.push(userTraitWithPost);
  });
} */