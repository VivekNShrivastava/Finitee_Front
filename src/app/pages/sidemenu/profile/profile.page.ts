import * as _ from 'lodash';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { UserTrait, UserTraitWithPost } from 'src/app/core/models/post/userTrait';
import { UserProfile, getUserProfileAsPerPrivacy } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { PostService } from 'src/app/core/services/post.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActionSheetController, AlertController, NavController, Platform, } from '@ionic/angular';
import { UserContacvtDetailsService } from 'src/app/core/services/user-contact-details.service';
import { ContactDetail } from 'src/app/core/models/user/WorkExperience';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class profilePage extends BasePage implements OnInit {
  trait: any = '';
  getUserProfileAsPerPrivacy: getUserProfileAsPerPrivacy = new getUserProfileAsPerPrivacy();
  userProfile: UserProfile = new UserProfile();
  userPersonal: any;
  postList: Array<Post> = [];
  userTraitList: Array<UserTrait> = [];
  userTraitPostList: Array<UserTraitWithPost> = [];

  selectedTraitObj: any = '';
  selectedTab: any = 'all';
  isTraitModalOpen: boolean = false;
  loaded: boolean = false;
  navParams: any;
  userId: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private userContDetailsService: UserContacvtDetailsService,
    public _userService: ProfileService,
    private postService: PostService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private connectionService: ConnectionsService,
    public commonService: CommonService,
    private chatService: ChatsService, private platform: Platform,
    private datePipe: DatePipe
  ) {
    super(authService);
    // console.log("profile page", this._activatedRoute.snapshot);
    console.log("Constructor of profile");
    if (this._activatedRoute.snapshot.params["UserId"]){
      this.userId = this._activatedRoute.snapshot.params["UserId"];
      if(this.userId === "loggedInUser"){
        this.userId = this.logInfo.UserId;
      }else{
        this.userId = this._activatedRoute.snapshot.params["UserId"];; 
      }
    }

    // if (this.router!.getCurrentNavigation()!.extras.state) {
    //   this.navParams =
    //     this.router!.getCurrentNavigation()!.extras.state!['data'];

    //   this.userId = this.navParams.Id || this.navParams.UserId;
    // } else {
    //   this.userId = this.logInfo.UserId;
    // }
    
    this.subscribePostSubject();
  }

  calculateDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    const years = Math.floor(durationInMonths / 12);
    const months = durationInMonths % 12;

    let durationString = '';
    if (years > 0) {
      durationString += years + (years === 1 ? ' yr ' : ' yrs ');
    }
    if (months > 0) {
      durationString += months + (months === 1 ? ' mo' : ' mos');
    }

    return durationString.trim();
  }
  getFormattedDate(month: string = '', year: string = ''): string {
    if (month == '' || !month) return '';
    const date = new Date(parseInt(year), parseInt(month) - 1); // Subtract 1 from the month to get the correct date object
    return this.datePipe.transform(date, 'MMM yyyy') ?? '';
  }
  async ionViewDidEnter(){
    console.log("ionViewDidEnter")
  }
  async ionViewWillEnter() {
    console.log("ionViewWillEnter")

    
    // console.log(this.userId === this.logInfo.UserId)
    // this.userProfile = await this._userService.getUserDetailsAsPrivacy(this.userId,this.logInfo.UserId);
    this.getUserProfileAsPerPrivacy = await this._userService.getUserDetailsAsPrivacy(this.userId,this.logInfo.UserId);

    // console.log("userPrivacy", this.getUserProfileAsPerPrivacy);
    // console.log("personal", this.userPersonal);


    // this.userProfile = await this._userService.getUserProfile(
    //   this.userId,
    //   this.logInfo.UserId
    // );

    // await this.getUserPost();
    // await this.getUserTraits();

    // this.getUserContactDetails();
    
    this.firstTrait = this.getUserProfileAsPerPrivacy.userProfile.UserTraits?.length > 0 ? this.getUserProfileAsPerPrivacy.userProfile.UserTraits : null;

    this.firstWork = this.getUserProfileAsPerPrivacy.userProfile.WorkExperiences?.length > 0 ? this.getUserProfileAsPerPrivacy.userProfile.WorkExperiences[0] : null;
    this.firstEducation = this.getUserProfileAsPerPrivacy.userProfile.Educations?.length > 0 ? this.getUserProfileAsPerPrivacy.userProfile.Educations[0] : null;
    this.contact = this.getUserProfileAsPerPrivacy.userProfile.ContactDetails? this.getUserProfileAsPerPrivacy.userProfile.ContactDetails : null;
  }
  firstWork: any;
  firstEducation: any;
  contact: any;
  firstTrait: any;


  // work
  isPersonalSectionExpanded: boolean = false;
  isWorkSectionExpanded: boolean = false;
  isEducationSectionExpanded: boolean = false;
  isTraitsSectionExpanded: boolean = false;
  isContactSectionExpanded: boolean = false;

  //
  toggleSection(section: string) {

    switch (section) {
      case 'personal':
        this.isPersonalSectionExpanded = !this.isPersonalSectionExpanded;
        this.isWorkSectionExpanded = false;
        this.isEducationSectionExpanded = false;
        this.isTraitsSectionExpanded = false;
        this.isContactSectionExpanded = false;
        break;
      case 'work':
        this.isWorkSectionExpanded = !this.isWorkSectionExpanded;
        this.isPersonalSectionExpanded = false;
        this.isEducationSectionExpanded = false;
        this.isTraitsSectionExpanded = false;
        this.isContactSectionExpanded = false;
        break;
      case 'education':
        this.isEducationSectionExpanded = !this.isEducationSectionExpanded;
        this.isPersonalSectionExpanded = false;
        this.isWorkSectionExpanded = false;
        this.isTraitsSectionExpanded = false;
        this.isContactSectionExpanded = false;
        break;
      case 'traits':
        this.isTraitsSectionExpanded = !this.isTraitsSectionExpanded;
        this.isPersonalSectionExpanded = false;
        this.isWorkSectionExpanded = false;
        this.isEducationSectionExpanded = false;
        this.isContactSectionExpanded = false;
        break;
      case 'contact':
        this.isContactSectionExpanded = !this.isContactSectionExpanded;
        this.isPersonalSectionExpanded = false;
        this.isWorkSectionExpanded = false;
        this.isEducationSectionExpanded = false;
        this.isTraitsSectionExpanded = false;
        break;
      default:
        break;
    }
  }
  //end work
  eCard() {
    this.router.navigateByUrl('/fr-profile/e-card');
  }

  workSection(condition: boolean) {
    this.commonService.isWorkListOnly = condition;
    this.navEx!.state!['data'] = this.getUserProfileAsPerPrivacy;
    // this.router.navigateByUrl('fr-profile/loggedInUser/edit-work', this.navEx);
    this.router.navigate([`fr-profile/loggedInUser/edit-work`], this.navEx);
  }

  educationSection(condition: boolean) {
    this.commonService.isEducationListOnly = condition;
    this.navEx!.state!['data'] = this.getUserProfileAsPerPrivacy;
    this.router.navigateByUrl('fr-profile/loggedInUser/edit-education', this.navEx);
  }
  traitsSection() {
    this.navEx!.state!['data'] = this.userProfile;
    this.router.navigateByUrl('fr-profile/loggedInUser/edit-traits', this.navEx);
  }

  contactSection() {
    this.navEx!.state!['data'] = this.getUserProfileAsPerPrivacy;
    this.router.navigateByUrl('fr-profile/loggedInUser/edit-contact', this.navEx);
  }

  editPersonal() {
    this.navEx!.state!['data'] = this.getUserProfileAsPerPrivacy;
    console.log("navigating to edit-personal page", this.navEx.state);
    // this.router.navigateByUrl('free-user-canvas/invite-to-view', this.navEx); 
    this.router.navigate([`fr-profile/loggedInUser/edit-personal`], this.navEx);
  }



  // async openUploadOption() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     cssClass: 'product-option-action-sheet',
  //     buttons: [
  //       {
  //         text: 'Take a photo',
  //         icon: 'cameraicon',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'take photo',
  //       },
  //       {
  //         text: 'Choose from gallery',
  //         icon: 'galleryicon',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'choose from gallery',
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  //   const result = await actionSheet.onDidDismiss();
  // }

  async ngOnInit() { }

  subscribePostSubject() {
    // console.log("subscribePostSubject function is running...")
    this.postService.postDataSbj.subscribe({
      next: (result: any) => {
        // console.log(`observerA: ${result}`);
        this.postList.unshift(result.data);
        if (this.userTraitList.length > 0) this.filterUserTraitPost();
      },
      error: (error: any) => {
        console.log("subscribePostSubject error...")
      }
    });
  }

  segmentChange(data: any) {
    console.log(data);
    this.loaded = false;
    switch (data.detail.value) {
      case 'all':
        this.getUserPost();
        break;
      case 'traits':
        this.getUserTraits();
        break;
      case 'beams':
        this.getUserBeams();
    }
  }

  async getUserPost() {
    this.postList = await this.postService.getPostByUserId(this.userId, AppConstants.POST_TYPE.USER);
  }
  // userContact = new ContactDetails;

  async getUserContactDetails() {
    var contact: any = await this.userContDetailsService.getByUserId(this.userId)
    if (contact) {
      this.commonService.contactDetails = contact;
    } else {
      this.commonService.contactDetails = new ContactDetail;
    }
  }

  async getUserTraits() {

    this.userTraitPostList = [

    ];
    this.userTraitList = await this.postService.getUserTrait(this.userId);
    this.filterUserTraitPost();
  }

  filterUserTraitPost() {
    this.userTraitPostList = [];
    this.userTraitList.forEach(async (userTrait) => {
      var userTraitWithPost = new UserTraitWithPost();
      var traitPost = await _.filter(this.postList, {
        BelongsToId: userTrait.Id.toString(),
      });
      var lastPostData = { desc: '', image: '' };
      if (traitPost.length > 0) {
        lastPostData.desc = traitPost[traitPost.length - 1].PostDescription;
        if (
          traitPost[traitPost.length - 1].PostImages &&
          traitPost[traitPost.length - 1].PostImages.length > 0
        )
          lastPostData.image =
            traitPost[traitPost.length - 1].PostImages[
            traitPost[traitPost.length - 1].PostImages.length - 1
            ];
      }
      var userTraitWithPost = new UserTraitWithPost();
      userTraitWithPost.UserTrait = userTrait;
      userTraitWithPost.TraitPosts = traitPost;
      userTraitWithPost.LastPostData = lastPostData;
      this.userTraitPostList.push(userTraitWithPost);
    });
  }

  

  getUserBeams() { }

  /* connection releated function */
  // async sendConnectionReqPopup() {
  //   if (!this.userProfile.IsConnected && !this.userProfile.IsRequestExits) {
  //     const alert = await this.alertController.create({
  //       header: `Add a note to the connection request to ${this.userProfile.user.DisplayName}?`,
  //       cssClass: 'add-user-alert',
  //       inputs: [
  //         {
  //           name: 'note',
  //           type: 'textarea',
  //           placeholder: 'Type your note here..',
  //           cssClass: 'add-user-alert-textarea',
  //         },
  //       ],
  //       buttons: [
  //         {
  //           text: 'Send',
  //           role: 'send',
  //           cssClass: 'add-user-alert-send-button',
  //           handler: (data: any) => {
  //             this.sendConnectionRequest(data.note);
  //             alert.dismiss();
  //           },
  //         },
  //         {
  //           text: 'Send without note',
  //           role: 'send-without-note',
  //           cssClass: 'add-user-alert-send-without-button',
  //           handler: (data: any) => {
  //             this.sendConnectionRequest(data.note);
  //             alert.dismiss();
  //           },
  //         },
  //         {
  //           text: 'X',
  //           role: 'cancel',
  //           cssClass: 'add-user-alert-close-button',
  //         },
  //       ],
  //     });

  //     await alert.present();
  //   } else {
  //     this.commonService.presentToast(
  //       this.appConstants.TOAST_MESSAGES.CON_REQ_ALR_SENT
  //     );
  //   }
  // }

  // async sendConnectionRequest(note: any) {
  //   var res = await this.connectionService.sendConnectionRequest(
  //     this.userId,
  //     note
  //   );
  //   if (res) {
  //     this.userProfile.IsRequestExits = true;
  //     this.getConnectionIcon();
  //   }
  // }

  // getConnectionIcon() {
  //   var iconName = 'b-connect-with-business';
  //   if (this.userProfile.IsConnected) iconName = 'b-request-accepted';
  //   else if (this.userProfile.IsRequestExits) iconName = 'b-request-sent';
  //   return iconName;
  // }

  // viewConnectedMembers() {
  //   this.navEx!.state!['data'] = this.userId;
  //   this.navCtrl.navigateForward('connected-members', this.navEx);
  //   /*     this.router.navigate(['connected-members'], this.navEx); */
  // }

  // startChat() {
  //   var selctedUser: any = {
  //     UserId: this.userId,
  //     FullName: this.navParams.DisplayName,
  //     ProfilePhoto: this.navParams.ProfilePhoto,
  //     groupId: '',
  //   };
  //   this.chatService.openChat(selctedUser);
  // }

  // async CreatePostAction() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     cssClass: 'product-option-action-sheet',
  //     buttons: [
  //       {
  //         text: 'Post',
  //         icon: 'privacy',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'Post',
  //       },
  //       {
  //         text: 'Trait Post',
  //         icon: 'edit-product',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'TraitPost',
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  //   const result = await actionSheet.onDidDismiss();
  //   var aresult = JSON.stringify(result);
  //   if (result.data == 'Post') {
  //     this.addPost();
  //   } else if (result.data == 'TraitPost') {
  //     this.trait = '';
  //     this.isTraitModalOpen = true;
  //   }
  // }

  // openPostScreen(post: any) {
  //   this.navEx!.state!['postlist'] = this.postList;
  //   this.navEx!.state!['selectedPostId'] = post;
  //   this.router.navigateByUrl(`post/view-post`, this.navEx);
  // }

  // selectedUserTrait(data: any) {
  //   var obj = _.find(this.userTraitList, { Id: data.detail.value });
  //   if (obj) this.selectedTraitObj = obj;
  // }

  // async saveUserTrait() {
  //   if (
  //     this.trait != '' &&
  //     this.userTraitList.length > 0 &&
  //     this.userTraitList.includes(this.trait.toLowerString())
  //   ) {
  //     this.commonService.presentToast(
  //       'You have already created trait for same name'
  //     );
  //   } else {
  //     this.isTraitModalOpen = false;
  //     setTimeout(() => {
  //       if (this.trait != '') {
  //         var userTrait: UserTrait = new UserTrait();
  //         userTrait.Trait = this.trait;
  //         this.addPost(userTrait);
  //       } else {
  //         this.addPost(this.selectedTraitObj);
  //       }
  //     }, 200);
  //   }
  // }



  // async presentMenuModalForOther() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     cssClass: 'three-dot-action-sheet',
  //     buttons: [
  //       {
  //         text: 'eCard',
  //         icon: 'right-menu-ecard',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'eProfile',
  //       },
  //       {
  //         text: 'Stop receiving all inflows',
  //         icon: 'stop-inflows',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'Stop receiving all inflows',
  //       },
  //       {
  //         text: 'Refer User',
  //         icon: 'business-recommend',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'Recommend',
  //       },
  //       {
  //         text: 'Report',
  //         icon: 'business-report',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'Report',
  //       },
  //       {
  //         text: 'Block User',
  //         icon: 'business-block',
  //         cssClass: 'product-option-action-sheet-button',
  //         data: 'Block',
  //       },
  //     ],
  //   });

  //   await actionSheet.present();

  //   const result = await actionSheet.onDidDismiss();
  //   var aresult = JSON.stringify(result);
  //   if (result.data == 'eCard') {
  //     this.router.navigateByUrl(`e-card/${this.userId}`);
  //   } else if (result.data == 'Recommend') {
  //     this.recommendUser();
  //   }
  // }

  recommendUser() {
    this.navEx!.state!['data'] = this.userProfile;
    this.router.navigateByUrl('recommend-user', this.navEx);
  }

  addPost(trait?: UserTrait) {
    if (trait) this.navEx!.state!['data'] = trait; //{ belongsToId: traitId, type: "Trait" };
    this.router.navigateByUrl(`post/add-post`, this.navEx);
  }

  traitPostsSection(userTrait: any) {
    this.navEx!.state!['data'] = userTrait;
    this.router.navigateByUrl('profile/trait-section', this.navEx);
  }

  openDefaultEmailApp(emailAddress: any) {
    const emailUrl = `mailto:${emailAddress}`;
    this.platform.ready().then(() => {
      window.open(emailUrl, '_system');
    });
  }

  openDefaultWebBrowser(websiteUrl: string) {
    this.platform.ready().then(() => {
      window.open(websiteUrl, '_system');
    });
  }
}
