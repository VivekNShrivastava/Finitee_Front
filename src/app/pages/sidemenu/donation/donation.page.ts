import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Post } from 'src/app/core/models/post/post';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.page.html',
  styleUrls: ['./donation.page.scss'],
})
export class DonationPage extends BasePage implements OnInit {
  userProfile: UserProfile = new UserProfile();
  userId: string = "";
  postList: Array<Post> = [];
  loaded: boolean = false;
  constructor(
    private router: Router,
    private _userProfileService: ProfileService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private _postService: PostService,
    private alertController: AlertController,
    private _inflowService: InflowsService
  ) {
    super(authService);
    if (this.router!.getCurrentNavigation()!.extras.state)
      this.userId = this.router!.getCurrentNavigation()!.extras.state!['userId'];
    else
      this.userId = this.logInfo.UserId;
  }

  async ngOnInit() {
    this.userProfile = await this._userProfileService.getUserProfile(this.userId, this.logInfo.UserId);
    await this.getUserPost();
    this.subscribePostSubject();
  }

  subscribePostSubject() {
    this._postService.postDataSbj.subscribe({
      next: (result: any) => {
        console.log(`observerA: ${result}`);
        if (result.event == "ADD")
          this.postList.unshift(result.data);
        else if (result.event == "DELETE") {
          var deletedPostId = result.data;
          var deletedPostIndex = this.lodash.findIndex(this.postList, { Id: deletedPostId });
          this.postList.splice(deletedPostIndex, 1);
        }
      }
    });
  }

  async getUserPost() {
    this.postList = await this._postService.getPostByUserId(this.userId, AppConstants.POST_TYPE.DONATION);
    this.loaded = true;
  }

  addPost() {
    this.navEx!.state!['data'] = { belongsToId: this.userId, Type: this.appConstants.POST_TYPE.DONATION, isDonationPost: true };
    this.router.navigateByUrl(`post/add-post`, this.navEx);
  }

  openPostScreen(post: any) {
    this.navEx!.state!['postlist'] = [post];
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.INLINE;
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  async openDonationPostOption(post: Post, index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: [
        {
          text: 'Edit privacy',
          icon: 'privacy',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit privacy',
        },
        {
          text: 'Edit product',
          icon: 'edit-product',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit product',
        },
        {
          text: 'Delete',
          icon: 'delete-product',
          cssClass: ['product-option-action-sheet-button', 'red-text'],
          data: 'delete',
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'delete') {
      this.deleteDonationPost(post, index);
    } else if (result.data == 'edit product') {
      this.editDonationPost(post, index);
    } else if (result.data == 'edit privacy') {
      //this.editPrivacy(product.Id);
    }
  }

  async deleteDonationPost(post: Post, index: number) {
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
            await this._postService.deletePost(post.Id);
            this.postList.splice(index, 1);
          },
        },
      ],
    });
    await alert.present();
  }


  editDonationPost(post: Post, index: number) {
    this.navEx!.state!['data'] = post;
    this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl('business/add-post', this.navEx);
  }

  openCreateDonationRequestPage() {
    this.router.navigateByUrl(
      '/tabs/nonprofit-donation-main-own/create-donation-request'
    );
  }



  async openActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Visible to',
      cssClass: 'product-option-action-sheet',
      buttons: [
        {
          text: 'Edit',
          icon: 'edit-product',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit',
        },
        {
          text: 'Edit',
          icon: 'edit-product',
          cssClass: 'product-option-action-sheet-button',
          data: 'edit',
        },
        {
          text: 'Delete',
          icon: 'delete-product',
          cssClass: ['product-option-action-sheet-button', 'red-text'],
          data: 'delete',
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }

  async startStopInflows() {
    var response = await this._inflowService.startStopRecivingInflows(this.userId, !this.userProfile.IsInflowsStarted);
    if (response) {
      this.userProfile.IsInflowsStarted = !this.userProfile.IsInflowsStarted;
      if (this.userProfile.IsInflowsStarted)
        this.userProfile.InflowsCount++;
      else
        this.userProfile.InflowsCount--;
    }
  }

  ngDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this._postService.postDataSbj) {
      this._postService.postDataSbj.unsubscribe();
    }
  }

}
