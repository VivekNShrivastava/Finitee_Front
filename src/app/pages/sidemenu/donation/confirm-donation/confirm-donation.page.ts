import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-confirm-donation',
  templateUrl: './confirm-donation.page.html',
  styleUrls: ['./confirm-donation.page.scss'],
})
export class ConfirmDonationPage extends BasePage implements OnInit {
  data: any;
  post: Post;
  constructor(private authService: AuthService, private router: Router, private _postService: PostService) {
    super(authService);
    this.post = this.router.getCurrentNavigation()!.extras!.state!['post'];
  }

  ngOnInit() {
    this.getDonationMadeOnPost(this.post.Id);
  }

  async getDonationMadeOnPost(postID: string) {
    this.data = await this._postService.getDonationCalimsOnPost(postID);
  }


  async donationConfimAction(UsersNode: any, status: string) {
    await this._postService.donationConfimAction(this.post.Id, UsersNode['T.id'], status);
  }

}
