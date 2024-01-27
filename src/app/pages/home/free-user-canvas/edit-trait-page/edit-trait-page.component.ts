import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { Subscription } from 'rxjs';
import { UserTrait } from 'src/app/core/models/user/UserProfile';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-edit-trait-page',
  templateUrl: './edit-trait-page.component.html',
  styleUrls: ['./edit-trait-page.component.scss'],
})
export class EditTraitPageComponent extends BasePage implements OnInit {

  isDisabled: boolean = true;
  @Output() filePathEvent = new EventEmitter<string>();
  @Input() mediaFiles: string = "";
  post: Post = new Post;
  paramsData: any;
  BelongsToId!: string;
  saveClicked: boolean = false;
  isUploadDisabled: boolean = false;
  userId: string = "";
  navParams: any;


  constructor(
    private router: Router,
    private _postService: PostService,
    private navCtrl: NavController,
    private authService: AuthService,
    private businessService: BusinessCanvasService,
    public _commonService: CommonService,
    private postService: PostService,
    public attachmentService: AttachmentHelperService
  ) {     super(authService);

    console.log("asd", this.router!.getCurrentNavigation()!.extras.state)
    this.navParams = this.router!.getCurrentNavigation()!.extras.state;
    console.log(this.navParams, "params")

    this.post.PostDescription = this.navParams.data.Trait;
    // if (this.router!.getCurrentNavigation()!.extras.state) {
    //   this.navParams = this.router!.getCurrentNavigation()!.extras.state!['data'];
    //   console.log("this.navParams", this.navParams);
    //   this.userId = this.navParams.UserId;
    //   if (this.navParams.UserId)
    //     this.userId = this.navParams.UserId;
    //   if (this.navParams.Id)
    //     this.userId = this.navParams.Id;
    // }
    this.userId = this.logInfo.UserId;

  }
  ngOnInit() {console.log("edit-trait")}


  addTraits() {
    this.router.navigateByUrl(`add-traits`);
  }

  deleteTrait(i: number) {
    this.post.PostTraits.splice(i, 1);
  }

  addMedia(filePath: string) {
    console.log("addmedia-clicked", this.post.PostImages.length)
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.post.PostImages.unshift(filePath);
    else
      this.post.PostImages[0] = filePath;

    console.log("addmedia-was-clicked", this.post.PostImages.length)

  }

  deleteProductImage(i: any) {
    this.filePathEvent.emit("delete-" + i);
  }

  async captuerMedia(event: any, MediaType: Number, SourceType: Number) {
    event.stopPropagation();
    event.preventDefault();
    console.log(MediaType + "  --  " + SourceType);
    await this.attachmentService.captureMedia(MediaType, SourceType);
  }

  addPost(trait?: UserTrait) {
    if (trait)
      this.navEx!.state!['data'] = { belongsToId: trait.UserId, Type: this.appConstants.POST_TYPE.TRAIT, TraitRequest: trait };
    else
      this.navEx!.state!['data'] = { belongsToId: this.userId, Type: this.appConstants.POST_TYPE.USER };
    this.router.navigateByUrl(`post/add-post`, this.navEx);
    // this.traitInput = "";
  }

  async savePost() {
    this.saveClicked = true;

    var userTrait: UserTrait = new UserTrait();
    userTrait.Trait = this.post.PostDescription || this.navParams.traitInput;
    userTrait.Thumbnail = this.mediaFiles;
    userTrait.Id = this.navParams.data.Id;

    console.log(userTrait);
    var res = await this._postService.saveUserTrait(userTrait);
    // this.addPost(userTrait);
  }

  selectedPrivacy(data: any) {
    this.post.Privacy = data.detail.value;
  }

}
