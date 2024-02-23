import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage extends BasePage implements OnInit {
  post: Post = new Post;
  paramsData: any;
  BelongsToId!: string;
  saveClicked: boolean = false;
  isTraitReadOnly : boolean = true;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private businessService: BusinessCanvasService,
    public _commonService: CommonService,
    private postService: PostService) {
    super(authService);
    this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];

    console.log("data", this.paramsData)

    if (this.post.Privacy)
      this.post.Privacy = this._commonService.getPrivacyFullValue(this.post.Privacy);
    else
      this.post.Privacy = this.appConstants.GeneralPivacy[0].value;
  }

  ngOnInit() {
    this.subscribePostTraitsSubject();
    console.log("paramsData", this.paramsData);
  }

  updateFontSize() {
    const maxLength = 2000; // Your character limit
    const currentLength = this.post.PostDescription.length;
    const fontSizePercentage = (currentLength / maxLength) * 100;
    const newSize = 15 - fontSizePercentage * 0.05; // Adjust the factor as needed
    return `${newSize}px`;
  }

  async subscribePostTraitsSubject() {
    this.postService.postTraits.subscribe({
      next: (result: any) => {
        console.log(`observerA: ${result}`);
        this.post.PostTraits = result;
      }
    });
  }


  addTraits() {
    this.router.navigateByUrl(`add-traits`);
  }

  deleteTrait(i: number) {
    this.post.PostTraits.splice(i, 1);
  }

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.post.PostImages.unshift(filePath);
    else
      this.post.PostImages[0] = filePath;

    console.log("len", this.post.PostImages.length);
  }

  async savePost() {
    this.saveClicked = true;

    var uploadFileInprogress = _.filter(this.post.PostImages, function (v) {
      return v.indexOf("localhost") != -1
    });

    if (uploadFileInprogress.length) {
      this._commonService.presentToast("Please wait! File upload is inprogress");
      return;
    }
    if (this.post.PostDescription || this.post.PostImages.length > 0) {
      if (this.paramsData) {
        if (this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT) {
          if (this.paramsData.belongsToId == "") {
            var res = await this.postService.saveUserTrait(this.paramsData.TraitRequest);
            if (res)
              this.paramsData.belongsToId = res.TraitId.toString();
          }
        }
        this.post.BelongsToId = this.paramsData.belongsToId.toString();
        this.post.Type = this.paramsData.Type;
      }
      console.log(this.post);
      var result = await this.postService.createPost(this.post);
      if (result) {
        this.post["Id"] = result;
        this.post.CreatedBy = this.getCreatedByData();
        this.post.BelongsToNodeName = this.paramsData.TraitRequest.Trait;
        this.postService.postDataSbj.next({ event: "ADD", data: this.post, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });
        if (this.paramsData && this.paramsData.Trait) {//individual tarit post section screen
          this.postService.traitpostData.next({ event: "ADD", data: this.post });
        }
      }
      this.navCtrl.pop();
    }
  }

  selectedPrivacy(data: any) {
    this.post.Privacy = data.detail.value;
  }
}
