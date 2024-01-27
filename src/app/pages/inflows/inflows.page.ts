import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-inflows',
  templateUrl: './inflows.page.html',
  styleUrls: ['./inflows.page.scss'],
})
export class InflowsPage extends BasePage implements OnInit {

  loaded: boolean = false;
  paramsData: any = { postlist: [] };
  filter: string = "ALL";
  filterUserTypeId: number = 0;

  constructor(private inflowsService: InflowsService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private postService: PostService) {
    super(authService);
  }


  async ionViewWillEnter() {
    this.filterChanged("ALL", 0)
  }

  ngOnInit() {

  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.filterChanged(this.filter, this.filterUserTypeId);
      event.target.complete();
    }, 2000);
  }


  async filterChanged(value: any, userTypeId: number) {
    this.filter = value;
    this.filterUserTypeId = userTypeId;
    this.loaded = false;
    var postList = await this.inflowsService.getInflows(value, userTypeId);
    if (postList.length > 0) {
      this.paramsData['postlist'] = postList;
      this.paramsData['selectedPost'] = postList[0];
    }
    else {
      this.paramsData['postlist'] = [];
      this.paramsData['selectedPost'] = new Post();
    }
    this.paramsData['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.paramsData['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
    this.loaded = true;
  }

  /* 
    async favorPostToggle(post: any) {
      post.FavouredByCU = !post.FavouredByCU;
      if (post.FavouredByCU)
        post.FavourCount++;
      else
        post.FavourCount--;
      var res = await this.postService.favorToggle(post);
  
    }
    async getCommentsByPostId(post: any) {
      this.post = post;
      this.commentList = [];
      this.commentList = await this.postService.getCommentsByPostId(post.Id);
    }
  
  
  
    async favorCommentToggle(CommentOrReply: any) {
      CommentOrReply.FavouredByCU = !CommentOrReply.FavouredByCU;
      if (CommentOrReply.FavouredByCU)
        CommentOrReply.FavourCount++;
      else
        CommentOrReply.FavourCount--;
      var res = await this.postService.favorToggle(CommentOrReply);
    }
  
    async commentAction(CommentOrReply: any, type: any) {
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
      ];
  
  
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
        this.deleteCommentOrReply(CommentOrReply, type);
      }
    }
  
  
    editCommentOrReply(CommentOrReply: any, type: any) {
      if (type == "COMMENT")
        this.comment = CommentOrReply.CommentText;
      else
        this.comment = CommentOrReply.ReplyText;
  
      this.SelectedCommentOrReply = CommentOrReply;
      this.SelectedAction = "EDIT";
    }
  
  
    replyComment(comment: any, username: any) {
      this.SelectedCommentOrReply = comment;
      this.SelectedAction = "REPLY";
      this.comment = "@" + username + " ";
    }
  
    async deleteCommentOrReply(CommentOrReply: any, type: any) {
      var res = await this.postService.deleteCommentOrReply(CommentOrReply.Id);
      if (res) {
        if (type == "COMMENT") {
          var DeleteCommentIndex: any = _.findIndex(this.commentList, { "Id": CommentOrReply.Id });
          this.commentList.splice(DeleteCommentIndex, 1);
        }
        else {
          var CommentData: any = _.filter(this.commentList, { "Id": CommentOrReply.CommentId });
          var replyDataIndex: any = _.findIndex(CommentData.CommentReplies, { "Id": CommentOrReply.Id });
          CommentData.splice(replyDataIndex, 1);
        }
      }
    }
  
    async addUpdateComment() {
      if (this.SelectedAction == "EDIT") {
        if (this.SelectedCommentOrReply.CommentText) {//comment
          this.SelectedCommentOrReply.CommentText = this.comment;
          await this.postService.addUpdateComment(this.SelectedCommentOrReply);
        }
        else {//reply
          this.SelectedCommentOrReply.ReplyText = this.comment;
          await this.postService.addUpdateCommentReply(this.SelectedCommentOrReply);
        }
      }
      else if (this.SelectedAction == "REPLY") {
        var newCommentReply = new CommentReplyDto();
        newCommentReply.CommentId = this.SelectedCommentOrReply.Id;
        newCommentReply.ReplyText = this.comment;
        var res = await this.postService.addUpdateCommentReply(newCommentReply);
        if (res.replyId) {
          newCommentReply.Id = res.replyId;
          newCommentReply.CreatedBy = this.getCreatedByData();
        }
        var existingComment: any = _.filter(this.commentList, { "Id": newCommentReply.CommentId });
        if (!existingComment[0].CommentReplies)
          existingComment[0].CommentReplies = [];
        existingComment[0].CommentReplies.push(newCommentReply);
        this.post.CommentCount++;
      }
      else {
        var newComment = new CommentDto();
        newComment.PostId = this.post.Id;
        newComment.CommentText = this.comment;
        var res = await this.postService.addUpdateComment(newComment);
        if (res.CommentId) {
          newComment.CreatedBy = this.getCreatedByData();
          newComment.Id = res.CommentId;
        }
        this.commentList.push(newComment);
        this.post.CommentCount++;
      }
  
      this.comment = "";
      this.SelectedAction = "CREATE";
      this.SelectedCommentOrReply = null;
    }
  
    onIonBreakpointDidChange(e: any) {
      var bottomval = '25%';
      if (e.detail.breakpoint == 1)
        bottomval = '0%';
      const collection = document.getElementsByTagName("ion-footer");
      for (let i = 0; i < collection.length; i++) {
        collection[i].style.bottom = bottomval;
      }
    }
   */
}
