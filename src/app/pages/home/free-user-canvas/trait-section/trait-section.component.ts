import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { BasePage } from 'src/app/base.page';
import { UserTraitWithPost } from 'src/app/core/models/post/userTrait';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-trait-section',
  templateUrl: './trait-section.component.html',
  styleUrls: ['./trait-section.component.scss'],
})
export class TraitSectionComponent extends BasePage implements OnInit {
  loaded: boolean = false;
  userTraitWithPost = new UserTraitWithPost();
  traitSubscription!: Subscription;
  constructor(private authService: AuthService,
    private navCtrl: NavController,
    public postService: PostService,
    private router: Router
  ) {
    super(authService);
    this.userTraitWithPost.UserTrait = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    console.log("this.userTraitWithPost", this.userTraitWithPost);
    this.subscribePostSubject();
  }

  async ngOnInit() {
    this.loaded = false;
    this.userTraitWithPost.TraitPosts = await this.postService.getPostByBelongsToId(this.userTraitWithPost.UserTrait.Id);
    this.loaded = true;
  }


  async subscribePostSubject() {
    this.traitSubscription = this.postService.traitpostData.subscribe({
      next: (result: any) => {
        console.log(`observerA: ${result}`);
        if (result.event == "ADD")
          this.userTraitWithPost.TraitPosts.unshift(result.data);
        else if (result.event == "DELETE") {
          var deletedPostId = result.data;
          var deletedPostIndex = _.findIndex(this.userTraitWithPost.TraitPosts, { Id: deletedPostId });
          this.userTraitWithPost.TraitPosts.splice(deletedPostIndex, 1);
        }
      }
    });
  }

  openPostScreen(post: any) {
    this.navEx!.state!['postlist'] = this.userTraitWithPost.TraitPosts;
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  CreatePostAction() {
    this.navEx!.state!['data'] = this.userTraitWithPost.UserTrait;
    this.router.navigateByUrl(`post/add-post`, this.navEx);
  }

  ngOnDestroy() {
    this.unsubscribeEvnets();
  }

  unsubscribeEvnets() {
    if (this.traitSubscription) {
      this.traitSubscription.unsubscribe();
    }
  }
}
