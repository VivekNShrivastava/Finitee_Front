import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import _ from 'lodash';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommentDto, CommentReplyDto } from 'src/app/core/models/post/commentDto';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.page.html',
  styleUrls: ['./view-post.page.scss'],
})
export class ViewPostPage extends BasePage implements OnInit {
  paramsData: any;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    super(authService);
    if (this.router?.getCurrentNavigation()?.extras.state) {
      this.paramsData = this.router?.getCurrentNavigation()?.extras.state;
      console.log("paramsdata",this.paramsData);
    }
  }

  ngOnInit() {
    /*   var p1 = this.postService.getPostByPostId(this.postId);
      var p2 = this.postService.getCommentsByPostId(this.postId);
      Promise.all([p1, p2]).then(async (data) => {
        console.log(data);
        this.post = data[0];
        this.commentList = data[1];
        this.loaded = true;
      }); */
  }


}
