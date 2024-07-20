import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post, AddPostRequest, Media, ImageFinitee, VideoFinitee } from 'src/app/core/models/post/post';
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
  photo: any[] = [];
  sendPost: AddPostRequest = new AddPostRequest;
  fileToUpload: any[] = [];
  slideOptions = {
    direction: 'horizontal',
    initialSlide: 0
  };
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

  fileToUploadToServer(mediaObj: any){
    this.fileToUpload.push(mediaObj);

    console.log('asd', this.fileToUpload)
  }

  imagePathMedia(imagePath: string){
    console.log( imagePath);
    this.photo.push(imagePath);
    console.log(this.photo)
  }

  addMedia(filePath: string) {
    console.log('addMedia', filePath);
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
      this.saveClicked = false;
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
      var result;
      // var result = await this.postService.createPost(res);
      if (result) {
        this.post["Id"] = result;
        this.post.CreatedBy = this.getCreatedByData();
        if (this.paramsData && this.paramsData.Type === "TRAIT") {
          //individual tarit post section screen
          this.post.BelongsToNodeName = this.paramsData.TraitRequest.Trait;
          // this.postService.traitpostData.next({ event: "ADD", data: this.post });
          this.postService.postDataSbj.next({ event: "ADD", data: this.post, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });

        }else{
          this.postService.postDataSbj.next({ event: "ADD", data: this.post, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });
        }
      }
      this.navCtrl.pop();
    }
  }

  selectedPrivacy(data: any) {
    this.post.Privacy = data.detail.value;
  }

  async addPost() {
    console.log("posted!");
    console.log(this.sendPost);

    const media = new Media();
    media.images = [];

    for(let i=0; i<this.fileToUpload.length; i++){
      media.images.push({
        imageFile: this.fileToUpload[i],
        // serialNumber: 1
      })
    }
    

    this.sendPost = {
      post : this.post,
      media: media
    }

    const formData = new FormData();
    formData.append('Post', JSON.stringify(this.sendPost.post));
    formData.append('AspectRatio', this.fileToUpload[0].aspectRatio);

    // Append each image file and its serial number
    this.sendPost.media.images?.forEach((image: any, index: number) => {
      if(image.imageFile.name.includes('mp4')){
        formData.append('file', image.imageFile.blob, image.imageFile.filePath);
        formData.append('file', image.imageFile.thumbBlob, image.imageFile.thumbName);
      }else{
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
