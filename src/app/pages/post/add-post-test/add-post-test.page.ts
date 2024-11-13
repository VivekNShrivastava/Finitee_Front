import { Component, OnInit, ViewChild } from '@angular/core';
import { Post, AddPostRequest } from 'src/app/core/models/post/post';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { NewImageCropperComponent } from 'src/app/core/components/new-image-cropper/new-image-cropper.component';
import { Router} from '@angular/router';



@Component({
  selector: 'app-add-post-test',
  templateUrl: './add-post-test.page.html',
  styleUrls: ['./add-post-test.page.scss'],
})
export class AddPostTestPage extends BasePage implements OnInit {
  post: Post = new Post;
  fileToUpload: any[] = [];
  sliderHeight: number = 0;
  isVideoList: boolean[] = [];
  @ViewChild(NewImageCropperComponent) imageCropperComponent!: NewImageCropperComponent;


  constructor(
    private router: Router,
    private authService: AuthService ) {
    super(authService);
   }

  ngOnInit() {
  }

 
  fileToUploadToServer(mediaObj: any) {
    // Update the array reference
    this.fileToUpload = [...this.fileToUpload, mediaObj];
  }


  // addMedia(filePath: any) {
  //   if (filePath.indexOf("delete") != -1) {
  //     var filePathSplit = filePath.split("-");
  //     this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
  //   }
  //   else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
  //     this.post.PostImages.unshift(filePath);
  //   else
  //     this.post.PostImages[0] = filePath;
  // }

  callCroppingFunction(mediaUrlDataArray: string[], isVideoList: boolean[], sliderHeight: number){
    // const mediaUrlDataArray = this.imageCropperComponent.dataUrlArray; // Access the data
    // this.isVideoList = this.imageCropperComponent.isVideoList;
    // this.sliderHeight = this.imageCropperComponent.sliderHeight;
    let previewComponentData = {"mediaUrlDataArray": mediaUrlDataArray,
      "isVideoList": isVideoList,
      "sliderHeight": sliderHeight
    }

    // Ensure that navEx is initialized properly
    if (!this.navEx) {
      this.navEx = { state: {} };  // Initialize navEx with state if undefined
    }

    this.navEx!.state!['data'] = previewComponentData;
    // console.log("refer-->", this.navEx!.state!['data'])
    this.router.navigateByUrl('post/preview-post-test', this.navEx);
  }

  openPreviewForCropper(){
    this.imageCropperComponent.ChooseCroppingFunction();
  }
}
