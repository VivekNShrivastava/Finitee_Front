import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ActionSheetController, AlertController, IonicModule, IonInput, NavController } from '@ionic/angular';
import _ from 'lodash';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommentDto, CommentReplyDto } from 'src/app/core/models/post/commentDto';
import { Post } from 'src/app/core/models/post/post';
import { replyTextPipe } from 'src/app/core/pipes/replyText';
import { videoUrlFilter } from 'src/app/core/pipes/videoUrlFilter';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { ReportService } from 'src/app/core/services/report.service';
import { userReport } from 'src/app/core/models/report';
import { userConnection } from 'src/app/core/models/connection/connection';
import { CreatedByDto } from 'src/app/core/models/user/createdByDto';
import { EventListPage } from 'src/app/pages/sidemenu/events/event-list/event-list.page';

@Component({
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    replyTextPipe,
    videoUrlFilter],
  selector: 'app-post-items',
  templateUrl: './post-items.component.html',
  styleUrls: ['./post-items.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostItemsComponent extends BasePage implements OnInit {
  @ViewChild('commentOrReplyInputelm', { static: false }) commentOrReplyInputelm!: IonInput;
  @Input() paramsData: any;

  beamicon: string = 'assets/icons/screen-wise-icons/Canvas screens icons/Beam icon.svg';
  slideOptions = {
    direction: 'vertical',
    initialSlide: 0
  };
  postList: Array<Post> = [];
  selectedPost: Post = new Post();
  postViewType: string = AppConstants.POST_VIEW_TYPE.INSTA;
  postCommentViewType: string = AppConstants.POST_COMMENT_VIEW_TYPE.POPUP;
  commentList: Array<CommentDto> = [];
  commentLoaded: boolean = false;
  commentOrReplyInput: any = "";
  userId: any = "";
  repliesList: Array<CommentReplyDto> = [];
  repliesLoaded: boolean = false;
  commentForReplySection : any = "";
  commentReplyInc: any = "";
  // userConnections: Array<userConnection> = []; 
  userConnections: any = "";
  showFullDescription = false;
  topReplies: any = "";
  replyButtonClickedFlags: boolean = false;
  replyToName : string = "";

  


  @ViewChild('videoPlayer') videoPlayer: any;
  isVideoPlaying = false;
  isAudioOn = true;
  videoProgress = 0;

  isCommentModalOpen: boolean = false;
  isReplyModalOpen: boolean = false;
  breakPoint: any = 1;
  public SelectedCommentOrReply: any = null;
  selectedReply: any = null;//for specific case
  public SelectedAction: any = "CREATE";
  userConnection: Array<userConnection> = [];


  constructor(private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    public _userProfileService: ProfileService,
    public businessService: BusinessCanvasService,
    private _postService: PostService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private reportService: ReportService) {

    super(authService);


  }
  ngOnInit() {
    this.logInfo =  this.authService.getUserInfo();
    
    // this.userId = this._userProfileService.getUserProfile(this.logInfo.UserId, this.logInfo.UserId);

    if (this.paramsData) {
      this.postList = [...this.paramsData['postlist']];
      this.selectedPost = this.paramsData['selectedPost'];
      this.postViewType = this.paramsData['postViewType'];
      this.postCommentViewType = this.paramsData['postCommentViewType'];
      var selectedPostIndex = _.findIndex(this.postList, { Id: this.selectedPost.Id });
      this.slideOptions.initialSlide = selectedPostIndex++;
      if (this.postCommentViewType == AppConstants.POST_COMMENT_VIEW_TYPE.INLINE)
        this.getCommentList(this.selectedPost.Id);
    }

    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById(this.selectedPost.Id)?.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "end"
      });
    }, 200);

  }




  updateFontSize(PostDescription: any) {
    const maxLength = 2000; // Your character limit
    const currentLength = PostDescription.length;
    const fontSizePercentage = (currentLength / maxLength) * 100;
    const newSize = 15 - fontSizePercentage * 0.05; // Adjust the factor as needed
    return `${newSize}px`;
  }

  async repliesForComment(action: string, comment: any, reply?:any){
    this.isReplyModalOpen = true;
    this.commentForReplySection = this.commentList.filter(c => c.Id === comment.Id)
    console.log("res", this.commentForReplySection );
    setTimeout(async () => {
      if(action === "replyToComment"){
        this.replyComment(comment);
      }else if(action === "replyToReply"){
        this.replyComment(comment, reply);
      }

      this.repliesList = await this._postService.getCommentReplies(comment.Id);
      this.repliesLoaded = true;
    }, 1000)
   
  }

  async topThreeReplies(comment: any) {
    comment.showReply = "";
    comment.showReply = "true" + comment.Id;
    console.log(comment.showReply, "showReply");
    // this.topReplies = await this._postService.getTopPostCommentReplies(comment.Id);
    comment.topThreeReplies = await this._postService.getTopPostCommentReplies(comment.Id);
  }

  openUser(data: any) {
    this.isCommentModalOpen = false;

    setTimeout(() => {
      const navigationExtras1s: NavigationExtras = {
        state: {
          data: data
        }
      };
      if (data.UserTypeId == AppConstants.USER_TYPE.BN_USER)
        this.router.navigateByUrl('business-user-canvas-other', navigationExtras1s);
      else if (data.UserTypeId == AppConstants.USER_TYPE.FR_USER)
        this.router.navigateByUrl('free-user-canvas', navigationExtras1s);
    }, 200);   
  }

  togglePlayPause(video: any) {
    if (this.isVideoPlaying) {
      video.pause();
    } else {
      video.play();
    }
    this.isVideoPlaying = !this.isVideoPlaying;
  }

  toggleAudio(video: any) {
    video.muted = !video.muted;
    this.isAudioOn = !this.isAudioOn;
  }

  seekVideo(video: any) {
    const seekTime = (this.videoProgress / 100) * video.duration;
    video.currentTime = seekTime;
  }

  ionImgDidLoad(event: any) {
    console.log("event", event);
    var height = event.srcElement.clientHeight;
    var width = event.srcElement.clientWidth;
    console.log("height", height);
    console.log("width", width);
    if (width >= height) {
      document.getElementById(event.srcElement.id)?.setAttribute("style", "width:100%; height:auto");
    }
    else {
      if (height >=460)
        document.getElementById(event.srcElement.id)?.setAttribute("style", "width:auto; height:460px");
      else
        document.getElementById(event.srcElement.id)?.setAttribute("style", "width:auto; height:100%");
    }
  }

  async getCommentList(postId: string) {
    this.commentLoaded = false;
    this.commentList = await this._postService.getCommentsByPostId(postId, this.userId);
    this.commentLoaded = true;
  }

  async favorPostToggle(post: Post) {
    this.selectedPost = post;
    this.selectedPost.FavouredByCU = !this.selectedPost.FavouredByCU;
    if (this.selectedPost.FavouredByCU)
      this.selectedPost.FavourCount++;
    else
      this.selectedPost.FavourCount--;
    var res = await this._postService.favorToggle(this.selectedPost);

  }

  openCommentModal(post: Post) {
    this.commentList = [];
    this.selectedPost = post;
    if (this.selectedPost.CreatedBy.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.breakPoint = 1;
    else
      this.breakPoint = 0.75;
    this.isCommentModalOpen = true;
    this.getCommentList(this.selectedPost.Id);
  }

  async favorCommentToggle(CommentOrReply: any) {
    CommentOrReply.FavouredByCU = !CommentOrReply.FavouredByCU;
    if (CommentOrReply.FavouredByCU)
      CommentOrReply.FavourCount++;
    else
      CommentOrReply.FavourCount--;
    var res = await this._postService.commentfavorToggle(CommentOrReply);
  }

  async openPostOption(post: Post) {
    this.selectedPost = post;
    var btns = [

      {
        text: 'Delete Post',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'delete',
      },
      {
        text: 'Edit Post',
        icon: 'Edit-product',
        cssClass: ['product-option-action-sheet-button', 'blue-text'],
        data: 'edit',
      },
    ];

    // if (this.selectedPost.CreatedBy.Id == this.logInfo.UserId) {
    //   [
    //     {
    //       text: 'Report Post',
    //       icon: 'delete-product',
    //       cssClass: ['product-option-action-sheet-button', 'red-text'],
    //       data: 'report',
    //     },
    //   ]
    // }

    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: btns,
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data == 'delete')
      await this.deletePost();
    else if (result.data == 'report') {
      await this.reportPost(this.selectedPost);
    }else if(result.data === 'edit'){
      this.navEx!.state!['selectedPost'] = post;
      this.router.navigateByUrl("post/update-post", this.navEx);
    }
  }

  async openPostReport(post: Post) {
    this.selectedPost = post;
    var btns = [
      {
        text: 'Report Post',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'report',
      },
    ]
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: btns,
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.data == 'delete')
      await this.deletePost();
    else if (result.data == 'report') {
      await this.reportPost(this.selectedPost);
    }
  }


  async inviteToView(post: Post){
    // this.navEx!.state!['data'] = userTrait.UserTrait;
    console.log("post--", post);
    this.navEx!.state!['selectedPost'] = post;
    this.router.navigateByUrl('free-user-canvas/invite-to-view', this.navEx);
  }

  async openBeamConfirmPopup(post: Post) {
    const alert = await this.alertController.create({
      header: 'Beam post',
      message: 'Are you sure you want to beam this post?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: async () => {

          },
        },
        {
          text: 'Beam',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: async () => {
            this.beamPost(post);
          },
        },
      ],
    });
    await alert.present();
  }

  async beamPost(post: Post) {
    var res = await this._postService.beamPost(post.Id);
    if(res)
    this.selectedPost.BeamCount++;
  }
  


  async reportPost(selectedPost: Post) {
    // this.selectedPost = selectedPost
    const alert = await this.alertController.create({
      header: 'Report post',
      message: 'Are you sure you want to report this post?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: async () => {

          },
        },
        {
          text: 'Report',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: async () => {
            this.presentRadioAlert(selectedPost);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentRadioAlert(selectedPost: Post) {
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
            user_Report.nodeId = selectedPost.Id;
            user_Report.report = selectedValue;
            console.log('Selected Value:', selectedValue);
            this.reportService.userReport(user_Report)
          },
        },
      ],
    });

    await alert.present();
  }

  async deletePost() {
    const alert = await this.alertController.create({
      header: 'Delete post',
      message: 'Are you sure you want to delete this post?',
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
          role: 'confirm',
          handler: async () => {
            await this._postService.deletePost(this.selectedPost.Id);
            this._postService.postDataSbj.next({ event: "DELETE", data: this.selectedPost.Id });
            this._postService.traitpostData.next({ event: "DELETE", data: this.selectedPost.Id });
            var deletedPostIndex = _.findIndex(this.postList, { Id: this.selectedPost.Id });
            this.postList.splice(deletedPostIndex, 1);
            if (this.postList.length == 0)
              this.navCtrl.pop();
          },
        },
      ],
    });
    await alert.present();
  }


  async commentAction(CommentOrReply: any, type: any) {
    console.log("clicked", CommentOrReply, type)

    var buttons = [
      {
        text: 'Edit',
        icon: 'privacy',
        cssClass: 'product-option-action-sheet-button',
        data: 'edit',
      },
      {
        text: 'Delete',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'delete',
      },
      {
        text: 'Report',
        icon: 'report',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'report',
      },
    ];

    if (CommentOrReply.CreatedBy.Id != this.logInfo.UserId){
      buttons.splice(0, 2);
      console.log(CommentOrReply.CreatedBy.Id == this.logInfo.UserId, "splice")
    }
      


    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: buttons
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'edit') {
      this.editCommentOrReply(CommentOrReply, type);
    }
    else if (result.data == 'delete') {
      this.deleteCommentOrReply(CommentOrReply, type, this.selectedPost.Id);
    }else if (result.data == 'report') {
      await this.reportPost(CommentOrReply);
    }
  }

  editCommentOrReply(CommentOrReply: any, type: any) {
    if (type == "COMMENT")
      this.commentOrReplyInput = CommentOrReply.CommentText;
    else
      this.commentOrReplyInput = CommentOrReply.ReplyText;

    this.SelectedCommentOrReply = CommentOrReply;
    this.SelectedAction = "EDIT";
    setTimeout(() => {
      this.commentOrReplyInputelm.setFocus();
    }, 100);
  }


  replyComment(comment: any, reply?: any) {
    this.SelectedCommentOrReply = comment;
    this.SelectedAction = "REPLY";
    this.replyToName = comment.CreatedBy.UserName;

    // var replyToName = "";
    // 
    if (reply) {
      this.selectedReply = reply;
      this.replyToName = reply.CreatedBy.UserName;
    }
    //this.commentOrReplyInput = "@" + commentOrReply.createdBy.Id + "###" + commentOrReply.createdBy.Display + "!!!";
    setTimeout(() => {
      this.commentOrReplyInputelm.setFocus();
      this.commentOrReplyInput = "";
      this.commentOrReplyInput = this.replyToName + " ";
    }, 100);
  }

  onCommentOrReplyInputChange(event: any) {
    
    var temp = event.detail.value;
    const res = temp;
    const tempSliced = res.slice(0, this.replyToName.length)
    // console.log("sliced -", temp.slice(0, this.replyToName.length));
    // console.log("eve", tempSliced, temp.length, this.replyToName);
    
    if(tempSliced === this.replyToName){
      // console.log("true");
    }else{
      // console.log("false", this.replyToName);
      this.replyToName = "";
      this.commentOrReplyInput = "";
      // console.log("false", this.replyToName);

    }
  }
  

  async deleteCommentOrReply(CommentOrReply: any, type: any, postId: any) {
    console.log("Res", this.commentList)
    console.log("cmt id:", CommentOrReply);
    console.log("postid:", postId);
    const alert = await this.alertController.create({
      header: 'Delete Comment',
      message: 'Are you sure you want to delete this comment?',
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
          role: 'confirm',
          handler: async () => {
            if(type == "COMMENT") var res = await this._postService.deleteComment(CommentOrReply.Id, postId);
            else var res = await this._postService.deleteCommentReply(CommentOrReply.Id, postId);
            if (res) {
              if (type == "COMMENT") {
                var DeleteCommentIndex: any = _.findIndex(this.commentList, { "Id": CommentOrReply.Id });
                this.commentList.splice(DeleteCommentIndex, 1);
              }
              else if( type == "REPLY") {
                // var CommentData: any = _.filter(this.commentList, { "Id": CommentOrReply.Id });
                // var replyDataIndex: any = _.findIndex(CommentData.CommentReplies, { "Id": CommentOrReply.Id });
                // CommentData.splice(replyDataIndex, 1);
                for (let comment of this.commentList) {
                  let replyIndex = _.findIndex(comment.CommentReplies, { "Id": CommentOrReply.Id });
                  if (replyIndex !== -1) {
                    comment.CommentReplies.splice(replyIndex, 1);
                    break;
                  }
                }
              }
            }
          },
        },
      ],
    });
    await alert.present();

  }

  async addUpdateComment() {
    console.log("action--", this.SelectedAction);
    console.log(this.commentList);
    if (this.SelectedAction == "EDIT") {
      if (this.SelectedCommentOrReply.CommentText) {//comment
        this.SelectedCommentOrReply.CommentText = this.commentOrReplyInput;
        const res = await this._postService.addUpdateComment(this.SelectedCommentOrReply);
        if(res) this.SelectedCommentOrReply.IsEdited = true;
      }
      else {//reply
        this.SelectedCommentOrReply.ReplyText = this.commentOrReplyInput;
        const res =  await this._postService.addUpdateCommentReply(this.SelectedCommentOrReply, this.selectedPost.Id);
        if(res) this.SelectedCommentOrReply.IsEdited = true;
      }
    }
    else if (this.SelectedAction == "REPLY") {
      var newCommentReply = new CommentReplyDto();
      newCommentReply.CommentId = this.SelectedCommentOrReply.Id;

      var text = { str: "" };
      if (this.selectedReply) {
        text.str = this.selectedReply.Id +
          "@@" + this.selectedReply.CreatedBy.Id +
          "@@" + this.selectedReply.CreatedBy.UserTypeId +
          "@@" + this.selectedReply.CreatedBy.UserName +
          "@@" + this.commentOrReplyInput.replace(this.selectedReply.CreatedBy.UserName, '');
      }
      else {
        text.str = this.SelectedCommentOrReply.Id +
          "@@" + this.SelectedCommentOrReply.CreatedBy.Id +
          "@@" + this.SelectedCommentOrReply.CreatedBy.UserTypeId +
          "@@" + this.SelectedCommentOrReply.CreatedBy.UserName +
          "@@" + this.commentOrReplyInput.replace(this.SelectedCommentOrReply.CreatedBy.UserName, '');
      }

      newCommentReply.ReplyText = text.str;
      var res = await this._postService.addUpdateCommentReply(newCommentReply, this.selectedPost.Id);
      if (res.CommentReplyId) {
        newCommentReply.Id = res.CommentReplyId;
        newCommentReply.CreatedBy = this.getCreatedByData();
      }
      var existingComment: any = _.filter(this.commentList, { "Id": newCommentReply.CommentId });
      if (!existingComment[0]?.CommentReplies)
        existingComment[0].CommentReplies = [];
      existingComment[0].CommentReplies.push(newCommentReply);
      this.repliesList.push(newCommentReply)
      this.commentReplyInc = this.commentList.filter(c => c.Id === newCommentReply.CommentId)
      this.commentReplyInc[0].CommentReplyCount++

      this.selectedPost.CommentCount++;
      console.log(this.selectedPost.CommentCount, "count of replies");
    }
    else {
      var newComment = new CommentDto();
      newComment.PostId = this.selectedPost.Id;
      // newComment.CreatedBy.ProfileImage = this.SelectedCommentOrReply.CreatedBy.ProfileImage;
      newComment.CommentText = this.commentOrReplyInput;
      var res = await this._postService.addUpdateComment(newComment);
      console.log("newcomment", newComment)
      if (res.CommentId) {
        newComment.CreatedBy = this.getCreatedByData();
        newComment.Id = res.CommentId;
      }
      this.commentList.push(newComment);
      this.selectedPost.CommentCount++;
      console.log(this.selectedPost.CommentCount, "count of comments");
    }

    this.commentOrReplyInput = "";
    this.SelectedAction = "CREATE";
    this.SelectedCommentOrReply = null;
    this.selectedReply = null;
  }

  openProfile(userId: any, userType: any) {
    alert(userId + " _ _ " + userType);
  }
  /*  onIonBreakpointDidChange(e: any) {
     var bottomval = '25%';
     if (e.detail.breakpoint == 1)
       bottomval = '0%';
     const collection = document.getElementsByTagName("ion-footer");
     for (let i = 0; i < collection.length; i++) {
       collection[i].style.bottom = bottomval;
     }
   } */

  closeCommentModal() {
    this.isCommentModalOpen = false;
    this.commentOrReplyInput = "";
  }

  closeReplyModal(){
    this.isReplyModalOpen = false;
    this.isCommentModalOpen = false;
    this.commentOrReplyInput = "";
  }

  backReplyModal(){
    this.isReplyModalOpen = false;
    this.commentOrReplyInput = "";
  }

  openConfirmDonationPage(post: Post) {
    this.navEx!.state!['post'] = post;
    this.router.navigateByUrl('confirm-donation', this.navEx);
  }

  async madeDonation(post: Post) {
    const alert = await this.alertController.create({
      header: 'Made Donation',
      message: 'Are you sure you have made donation?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: async () => {

          },
        },
        {
          text: 'Done',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: async () => {
            await this._postService.madeDonation(post.Id);
          },
        },
      ],
    });
    await alert.present();

  }

  

  randomBG(){
    return "bg3";
  }

}
