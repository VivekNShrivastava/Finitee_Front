import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post, AddPostRequest, Media, Trait } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { Subscription } from 'rxjs';
import { UserTrait } from 'src/app/core/models/user/UserProfile';

@Component({
  selector: 'app-new-trait-page',
  templateUrl: './new-trait-page.component.html',
  styleUrls: ['./new-trait-page.component.scss'],
})
export class NewTraitPageComponent extends BasePage implements OnInit {

  @Output() filePathEvent = new EventEmitter<string>();
  @Input() mediaFiles: string = "";
  post: Post = new Post;
  paramsData: any;
  BelongsToId!: string;
  saveClicked: boolean = false;
  isUploadDisabled: boolean = false;
  userId: string = "";
  navParams: any;
  isTraitReadOnly: boolean = true;
  fileToUpload: any[] = [];
  sendPost: Trait = new Trait;

  constructor(
    private router: Router,
    private _postService: PostService,
    private navCtrl: NavController,
    private authService: AuthService,
    private businessService: BusinessCanvasService,
    public _commonService: CommonService,
    private postService: PostService,
    public attachmentService: AttachmentHelperService
  ) {
    super(authService);
    this.navParams = this.router!.getCurrentNavigation()!.extras.state;
    this.post.PostDescription = this.navParams.traitInput;
    this.userId = this.logInfo.UserId;
  }

  ngOnInit() { console.log("createTrait") }

  addTraits() {
    this.router.navigateByUrl(`add-traits`);
  }

  deleteTrait(i: number) {
    this.post.PostTraits.splice(i, 1);
  }

  fileToUploadToServer(mediaObj: any) {
    this.fileToUpload.push(mediaObj);

    console.log('asd', this.fileToUpload)
  }

  addMedia(filePath: string) {

    // if (filePath.indexOf("delete") != -1) {
    //   var filePathSplit = filePath.split("-");
    //   this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    // }
    // else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
    //   this.post.PostImages.unshift(filePath);
    // else
    //   this.post.PostImages[0] = filePath;

    // console.log(this.post)

  }

  deleteProductImage(i: any) {
    this.filePathEvent.emit("delete-" + i);
  }

  async captuerMedia(event: any, MediaType: Number, SourceType: Number) {
    event.stopPropagation();
    event.preventDefault();
    this.saveClicked = true;
    console.log(MediaType + "  --  " + SourceType);
    await this.attachmentService.captureMedia(MediaType, SourceType);
    this.saveClicked = false;
  }

  // addPost(trait?: UserTrait) {
  //   if (trait)
  //     this.navEx!.state!['data'] = { belongsToId: trait.UserId, Type: this.appConstants.POST_TYPE.TRAIT, TraitRequest: trait };
  //   else
  //     this.navEx!.state!['data'] = { belongsToId: this.userId, Type: this.appConstants.POST_TYPE.USER };
  //   this.router.navigateByUrl(`post/add-post`, this.navEx);
  //   // this.traitInput = "";
  // }

  async savePost() {

    var uploadFileInprogress = _.filter(this.post.PostImages, function (v) {
      return v.indexOf("localhost") != -1
    });

    if (uploadFileInprogress.length) {
      this._commonService.presentToast("Please wait! File upload is inprogress");
      return;
    }

    var userTrait: UserTrait = new UserTrait();
    userTrait.Trait = this.post.PostDescription || this.navParams.traitInput;
    userTrait.Thumbnail = this.post.PostImages[0];
    var res = await this._postService.saveUserTrait(userTrait);
    const openTraitPost = true;
    if (res) {
      const navigationExtras: NavigationExtras = {
        state: {
          data: {
            openTraitPost
          },
        }
      };
      this.postService.traitList.next({ event: "ADD", data: userTrait });
      this.navCtrl.navigateForward(['tabs/free-user-canvas'], navigationExtras);
    }
    // console.log(userTrait);
  }

  selectedPrivacy(data: any) {
    this.post.Privacy = data.detail.value;
  }

  async addPost() {
    console.log("posted!");
    console.log(this.sendPost);

    const media = new Media();
    media.images = [];

    for (let i = 0; i < this.fileToUpload.length; i++) {
      media.images.push({
        imageFile: this.fileToUpload[i],
        // serialNumber: 1
      })
    }


    this.sendPost = {
      trait: this.post.PostDescription,
      id: "",
      thumbnail: media
    }

    const formData = new FormData();
    formData.append('Post', JSON.stringify(this.sendPost.post));
    formData.append('AspectRatio', this.fileToUpload[0].aspectRatio);

    // Append each image file and its serial number
    this.sendPost.media.images?.forEach((image: any, index: number) => {
      if (image.imageFile.name.includes('mp4')) {
        formData.append('file', image.imageFile.blob, image.imageFile.filePath);
        formData.append('file', image.imageFile.thumbBlob, image.imageFile.thumbName);
      } else {
        formData.append('file', image.imageFile.blob, image.imageFile.name);
      }
    });

    // this.fileToUpload.forEach((image: any) => {

    // })

    // Log the contents of the FormData object for verification
    for (const [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    try {
      const res = await this.postService.createPost(formData);
      console.log(res);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

}
