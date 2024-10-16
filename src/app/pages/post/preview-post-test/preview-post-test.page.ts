import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
// import { NewImageCropperComponent } from 'src/app/core/components/new-image-cropper/new-image-cropper.component';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';
import { AddPostRequest, AddPostRequestForWeb, Post, VideoCroppingArgs } from 'src/app/core/models/post/post';
import { VideoCropCompressService } from 'src/app/core/services/video-crop-compress/video-crop-compress.service';




@Component({
  selector: 'app-preview-post-test',
  templateUrl: './preview-post-test.page.html',
  styleUrls: ['./preview-post-test.page.scss'],
})
export class PreviewPostTestPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides!: IonSlides;
  // @ViewChild(NewImageCropperComponent) imageCropperComponent!: NewImageCropperComponent;
  @ViewChildren('mediaElement') currentMediaElements!: QueryList<ElementRef>;

  paramsData: any;
  currentIndex: number = 0;
  imageUri: string[] = [];
  mediaNames: string[] = [];
  isVideoList: boolean[] = [];
  imagePositionX: number[] = [];
  imagePositionY: number[] = [];
  manualScale: number[] =[];
  sliderHeight: number = 0;
  sliderOpts = {
    allowTouchMove: false
  };
  isPlaying: boolean = false;
  isMuted: boolean = false;
  seekValue: number = 0;
  seekValueList: number[] = [];
  intervalId: any = null;
  isUserInteracting: boolean= true;
  isVideo: boolean = false;
  areaAvailable: number[][] = [];
  thumbnail: string = "";
  videoArgs: VideoCroppingArgs[] = [];
  postRequest: AddPostRequest = new AddPostRequest;



  constructor(
    private router: Router,
    private imageCompress: NgxImageCompressService,
    private videoCompressService: VideoCropCompressService
  ) { 
    this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    this.imageUri = this.paramsData.mediaUrlDataArray;
    this.isVideoList = this.paramsData.isVideoList;
    this.sliderHeight = this.paramsData.sliderHeight;
    this.manualScale = this.paramsData.manualScale;
    this.imagePositionX = this.paramsData.imagePositionX;
    this.imagePositionY = this.paramsData.imagePositionY;
    this.areaAvailable = this.paramsData.areaAvailable;
    this.thumbnail = this.paramsData.thumbnail;
    this.videoArgs = this.paramsData.videoArgs;
    this.mediaNames = this.paramsData.mediaNames;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    for(let i = 0; i<this.imageUri.length; i++){
      if(this.isVideoList[i]){
        const imgElement = this.currentMediaElements.toArray()[i].nativeElement;
        imgElement.style.scale = this.manualScale[i];
        if(i===0){
          imgElement.style.transform = `translate(${this.imagePositionX[i]}px, ${this.imagePositionY[i]}px)`;
          this.isVideo = true;
        }else{
          imgElement.style.transform = `translate(${this.areaAvailable[i][1]}px, ${this.imagePositionY[i]}px)`;
          console.log(this.areaAvailable[i][1])
        }
        imgElement.style.transition = 'none';
      }
    }
  }


  slideToIndex(index: number) {
    if (this.slides && index >= 0 && index < this.imageUri.length) {
      this.slides.slideTo(index, 0);
      this.isVideo = this.isVideoList[this.currentIndex];
      if(this.isVideo){
        this.ChangeSeekValueOnSlide();
      }
    } else {
      console.error('Index out of range');
    }
  }


  back(){
      if(this.currentIndex !== 0){
        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '1';
        if(this.isVideoList[this.currentIndex]){
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.areaAvailable[this.currentIndex][1]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
          this.isPlaying = false;
          this.isUserInteracting = true;
          this.seekValueList[this.currentIndex] = this.currentMediaElements.toArray()[this.currentIndex].nativeElement.currentTime;
        }
        this.currentIndex = this.currentIndex - 1;
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '2';
          if(this.isVideoList[this.currentIndex]){
            this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.imagePositionX[this.currentIndex]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          }
          this.slideToIndex(this.currentIndex);

      }
  } 

  front(){
      if(this.currentIndex !== this.imageUri.length - 1){
        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '1';  
        if(this.isVideoList[this.currentIndex]){
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${-this.areaAvailable[this.currentIndex][3]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
          this.isPlaying = false;
          this.isUserInteracting = true;
          this.seekValueList[this.currentIndex] = this.currentMediaElements.toArray()[this.currentIndex].nativeElement.currentTime;
        }
        this.currentIndex = this.currentIndex + 1;
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '2';
          if(this.isVideoList[this.currentIndex]){
            this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.imagePositionX[this.currentIndex]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          }
          this.slideToIndex(this.currentIndex)
      }
  }

  togglePlayPause() {
  
    if (this.currentMediaElements.toArray()[this.currentIndex].nativeElement.paused) {
      this.currentMediaElements.toArray()[this.currentIndex].nativeElement.play();
      this.isPlaying = true;
      this.intervalId = setInterval(() => {
        this.updateSeekValue();
      }, 200);
    } else {
      this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
      this.isPlaying = false;
      this.isUserInteracting = true;
  
    }
  }

  toggleMute() {
    const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;
  }

  seekVideo(event: any) {
    if(this.isUserInteracting){
      const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
      const seekTime = (event.detail.value / 100) * video.duration;
      if(!isNaN(seekTime))
      video.currentTime = seekTime;
      if(event.detail.value == 100){this.isPlaying = false;} 
    }
    this.isUserInteracting=true;
  }
  
  ChangeSeekValueOnSlide(){
    const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    video.muted = this.isMuted;
    video.currentTime = this.seekValueList[this.currentIndex];
        const seekProgress = (this.seekValueList[this.currentIndex] / video.duration) * 100;
        if(seekProgress == 100){this.isPlaying = false;} 
        this.seekValue = seekProgress;
  }
  
  updateSeekValue() {
    if(this.isPlaying){
      this.isUserInteracting = false;
    
      const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
        const seekProgress = (video.currentTime / video.duration) * 100;
        if(seekProgress == 100){this.isPlaying = false;} 
      
      // Update the seekValue
      this.seekValue = seekProgress;
    }else{
      this.isUserInteracting = true;
    }
  
  }

  async compressImage(image: string) {
    // Compress the image
    // this.imgResultBeforeCompress = image;

    const compressedBase64 = await this.imageCompress.compressFile(image, -1, 80, 10000); // Adjust quality and size as needed

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


  async  fileUrlToFile(fileUrl: string, filename: string): Promise<Blob> {
    const response = await fetch(fileUrl);  // Fetch the file from the URL
    let blob = await response.blob();     // Convert the response to a Blob
    const mimeType = this.getMimeTypeFromFileName(filename);
    
    blob = new Blob([blob], { type: mimeType });  // Create a new Blob with the correct type
     

    const file2 = new File([""], filename);
    const file = new File([blob], filename, {type: mimeType});
    console.log("converted file", file2)
    console.log("converted file 2", file)
    console.log("converted files", blob)

  
    return blob;
  }
  
   getMimeTypeFromFileName(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return `video/${extension}`
  }

  async addPost(){
    let files: Blob[] = [];
    let post: Post = new Post;
    for(let i=0; i<this.imageUri.length; i++){
      if(this.isVideoList[i]){
        const file = await this.fileUrlToFile(this.imageUri[i], this.mediaNames[i]); // Assuming base64ToFile is implemented
        files.push(file); // Push the converted file to the array      
        if(i==0){
          const thumb = await this.compressImage(this.thumbnail);
          files.push(thumb);
        }
      }
      else{
        const img = await this.compressImage(this.imageUri[i]);
        files.push(img);
      }
    }
    let addPostRequestForWeb: AddPostRequestForWeb = new AddPostRequestForWeb();
    addPostRequestForWeb.cropAreas = this.videoArgs;
    addPostRequestForWeb.AspectRatio = this.sliderHeight/window.innerWidth;
    addPostRequestForWeb.media = files;
    addPostRequestForWeb.post = post;
    //route
    this.router.navigateByUrl('tabs/free-user-canvas');
    this.videoCompressService.cropVideoForWeb(addPostRequestForWeb, this.mediaNames);
  }

}
