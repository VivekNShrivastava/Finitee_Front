import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post, AddPostRequest } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { ModalController } from '@ionic/angular';
import { PreviewPostComponent } from '../preview-post/preview-post.component';

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
  slideHeight: string = "";
  croppedImageMap: Map<number, any> = new Map();
  isArLocked: boolean = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private businessService: BusinessCanvasService,
    public _commonService: CommonService,
    private postService: PostService,
    private modalController: ModalController) {

    super(authService);  

    this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];

    if (this.post.Privacy)
      this.post.Privacy = this._commonService.getPrivacyFullValue(this.post.Privacy);
    else
      this.post.Privacy = this.appConstants.GeneralPivacy[0].value;
  }

  ngOnInit() {
    this.subscribePostTraitsSubject();
    this.updateSlideHeight();

  }


  onCroppedImageMapChange(event: Map<number, any>) {
    this.croppedImageMap = event;
    for (const [key, value] of this.croppedImageMap.entries()) {
      // console.log(key, value);
    }

    // console.log('Updated croppedImageMap:', Array.from(this.croppedImageMap.entries()));
  }

  onArChange(event: boolean){
    console.log("ev", event);
    this.isArLocked = event;
  }

  updateFontSize() {
    const maxLength = 2000; // Your character limit
    const currentLength = this.post.PostDescription.length;
    const fontSizePercentage = (currentLength / maxLength) * 100;
    const newSize = 15 - fontSizePercentage * 0.05; // Adjust the factor as needed
    return `${newSize}px`;
  }

  updateSlideHeight() {
    const deviceHeight = window.innerHeight;
    this.slideHeight = `${deviceHeight * 0.22}px`;
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
  }

  imagePathMedia(imagePath: string){
    this.photo.push(imagePath);
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
            if (res) this.paramsData.belongsToId = res.TraitId.toString();
          }
        }
        this.post.BelongsToId = this.paramsData.belongsToId.toString();
        this.post.Type = this.paramsData.Type;
      }
      var result;
      if (result) {
        this.post["Id"] = result;
        this.post.CreatedBy = this.getCreatedByData();
        if (this.paramsData && this.paramsData.Type === "TRAIT") {
          this.post.BelongsToNodeName = this.paramsData.TraitRequest.Trait;
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

  // async addPost() {
  // //   if(!this.post.PostImages) {
  // //     this.post.PostImages = [];
  // // }

  //   if(this.paramsData.Type === 'USER'){
  //     const media = new Media();
  //     media.images = [];

  //     // for(let i=0; i<this.fileToUpload.length; i++){
  //     //   media.images.push({
  //     //     imageFile: this.fileToUpload[i],
  //     //   })
  //     // }

  //     this.croppedImageMap.forEach((value: any, key: any) => {
  //       media?.images?.push({
  //           imageFile: value,
  //       });
  //     });

      
  //     media.images.forEach((image) => {
  //       const temp = image.imageFile.name;; // Extract the name or URL depending on your structure
  //       this.post.PostImages.push(temp);
  //       console.log("temp",temp)
  //   });
  //     this.sendPost = {
  //       post : this.post,
  //       media: media
  //     }
  
  //     // const formData = new FormData();
  //     // formData.append('Post', JSON.stringify(this.sendPost.post));
  //     // formData.append('AspectRatio', this.fileToUpload[0].aspectRatio);

  //     const formData = new FormData();
  //     formData.append('Post', JSON.stringify(this.sendPost.post));
  //     formData.append('AspectRatio', Array.from(this.croppedImageMap.values())[0].aspectRatio.toString());

  
  //     this.sendPost.media.images?.forEach((image: any) => {
        
  //       if(image.imageFile.name.includes('mp4')){
  //         formData.append('file', image.imageFile.blob, image.imageFile.name);
  //         formData.append('file', image.imageFile.thumbBlob, image.imageFile.thumbName);
  //       }else{
  //         formData.append('file', image.imageFile.blob, image.imageFile.name);
  //       }
  //     });
  
  //     for (const [key, value] of (formData as any).entries()) {
  //         console.log(key, value);
  //     }
  
  //     try {
  //       console.log('done')
  //       const res = await this.postService.createPost(formData);
  //       console.log(res);

  //       this.router.navigateByUrl('free-user-canvas')
  //       this.postService.postDataSbj.next({ event: "ADD", data: this.sendPost, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });


  //       this.navCtrl.pop();
  //     } catch (error) {
  //       console.error('Error creating post:', error);
  //     }
  //   }else if(this.paramsData.Type === 'TRAIT'){

  //   }
    
  // }

  async openPreviewModal() {
    console.log("this", this.fileToUpload.length < 2,this.isArLocked);
    if(this.fileToUpload.length < 2 || this.isArLocked){
      if(this.fileToUpload.length > this.croppedImageMap.size){
        this.fileToUpload.forEach((e, index) => {
          if(!this.croppedImageMap.has(index)){
            this.croppedImageMap.set(index, e)
          }
        });
      }
      const modal = await this.modalController.create({
        component: PreviewPostComponent,
        componentProps: {
          post: this.croppedImageMap,
          paramsData: this.paramsData
        }
      });
  
      modal.onDidDismiss().then((data) => {
        if(data.data === 'post'){
          this.fileToUpload = [];
          this.navCtrl.pop;
        } 
        
      });
  
      return await modal.present();
    }else{
      this._commonService.presentToast('Lock the Aspect Ratio')
    }
    
  }
    

    
  

}
