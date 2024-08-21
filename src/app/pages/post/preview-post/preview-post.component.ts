import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Media, AddPostRequest } from 'src/app/core/models/post/post';
import { PostService } from 'src/app/core/services/post.service';
import { Router } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  standalone: true,
  selector: 'app-preview-post',
  templateUrl: './preview-post.component.html',
  styleUrls: ['./preview-post.component.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PreviewPostComponent implements OnInit {

  fileToUpload: any[] = [];
  post: any;
  readonly appConstants: any = AppConstants;
  paramsData: any;
  sendPost: AddPostRequest = new AddPostRequest;

  originalImage: string = '';
  compressedImage: string = '';
  imgResultBeforeCompress: string = '';
  imgResultAfterCompress: string = '';

  constructor(
    private modalController: ModalController,
    private postService: PostService,
    private router: Router,
    private imageCompress: NgxImageCompressService
  ){}

  ngOnInit() {
    console.log('pre', this.post, this.paramsData)
    const valuesArray = Array.from(this.post.values());
    this.fileToUpload.push(...valuesArray);
    
    this.paramsData = this.paramsData

  }

  next(){
    this.modalController.dismiss();
  }

  selectFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.originalImage = image;
      this.compressImage(image, orientation);
    });
  }

  async compressImage(image: string, orientation: number) {
    // Compress the image
    this.imgResultBeforeCompress = image;

    const compressedBase64 = await this.imageCompress.compressFile(image, orientation, 80, 10000); // Adjust quality and size as needed

    return this.base64ToFile(compressedBase64, 'compressed-image.jpg');

    // let imgResultAfterCompression = image;
    // this.imageCompress
    // .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
    // .then(compressedImage => {
    //     imgResultAfterCompression = compressedImage;
    //     console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
    // });
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const matchResult = arr[0].match(/:(.*?);/);
    const mime = matchResult ? matchResult[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }

  async addPost(){
    if(this.paramsData.Type === 'USER'){
      const media = new Media();
      media.images = [];


      for (let i = 0; i < this.fileToUpload.length; i++) {
        const imageFile = this.fileToUpload[i];
        let compressedImageFile = imageFile.blob;
  
        if (imageFile.mediaType === 'I') {
          // Compress image if it's not a video file
          const orientation = -1; // Use -1 if you don't have orientation data, otherwise pass the correct orientation
          compressedImageFile = await this.compressImage(imageFile.filePath, orientation);

          this.fileToUpload[i] = {
            ...this.fileToUpload[i], // Preserve other properties
            blob: compressedImageFile, // Update the blob to the compressed image file
          };
        }
  
        // this.fileToUpload[i].blob.size = compressedImageFile.size 
        media.images.push({
          imageFile: this.fileToUpload[i],
        });
      }

      // this.fileToUpload.forEach((value: any, key: any) => {
      //   media?.images?.push({
      //       imageFile: value,
      //   });
      // });

      
      this.sendPost = {
        post : this.post,
        media: media
      }
  
      const formData = new FormData();
      formData.append('Post', JSON.stringify(this.sendPost.post));
      formData.append('AspectRatio', this.fileToUpload[0].aspectRatio);

      // const formData = new FormData();
      // formData.append('Post', JSON.stringify(this.sendPost.post));
      // formData.append('AspectRatio', Array.from(this.croppedImageMap.values())[0].aspectRatio.toString());

  
      this.sendPost.media.images?.forEach((image: any) => {
        if(image.imageFile.name.includes('mp4')){
          formData.append('file', image.imageFile.blob, image.imageFile.name);
          formData.append('file', image.imageFile.thumbBlob, image.imageFile.thumbName);
        }else{
          formData.append('file', image.imageFile.blob, image.imageFile.name);
        }
      });
  
      for (const [key, value] of (formData as any).entries()) {
          console.log(key, value);
      }
  
      try {
        console.log('done')
        const res = await this.postService.createPost(formData);
        console.log(res);
        this.router.navigateByUrl('free-user-canvas')
        this.postService.postDataSbj.next({ event: "ADD", data: this.sendPost, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });
        this.modalController.dismiss('post')
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }else if(this.paramsData.Type === 'TRAIT'){

    }
    
  }

}
