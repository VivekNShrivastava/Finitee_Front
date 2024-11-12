import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
// import { NewImageCropperComponent } from 'src/app/core/components/new-image-cropper/new-image-cropper.component';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';
import { AddPostRequest, AddPostRequestForWeb, Post, VideoCroppingArgs } from 'src/app/core/models/post/post';
import { VideoCropCompressService } from 'src/app/core/services/video-crop-compress/video-crop-compress.service';
import { VideoCropper } from 'video-cropper-processor';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';





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
    private videoCompressService: VideoCropCompressService,
    private platform: Platform
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

    const compressedBase64 = await this.imageCompress.compressFile(image, -1, 80, 10000); // Adjust quality and size as needed

    return this.base64ToBlob(compressedBase64);
  }

  base64ToBlob(base64: string): Blob {
    const arr = base64.split(',');
    const matchResult = arr[0].match(/:(.*?);/);
    const mime = matchResult ? matchResult[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new Blob([u8arr], { type: mime });
  }


  async  fileUrlToFile(fileUrl: string, filename: string): Promise<Blob> {
    console.log("filetoUrl")
    const response = await fetch(fileUrl);  // Fetch the file from the URL
    console.log("check this response",response);
    let blob = await response.blob();     // Convert the response to a Blob
    const mimeType = this.getMimeTypeFromFileName(filename);
    
    blob = new Blob([blob], { type: mimeType });  // Create a new Blob with the correct type
  
    console.log("blob", blob)
    console.log("mimetype", mimeType);
    return blob;
  }
  
   getMimeTypeFromFileName(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return `video/${extension}`
  }

  async addPostSelector(){
    if(this.platform.is('desktop') || this.platform.is('mobileweb')){
      this.addPostForWeb();
    }else{
      this.addPost();
    }
  }

  async addPost(){
    let files: Blob[] = [];
    let post: Post = new Post;
    for(let i=0; i<this.imageUri.length; i++){
      if(this.isVideoList[i]){
        
        //cropping here  const 
        //conditionally remove for android
        let localFilePath = "";
        if(this.platform.is('ios')){
           localFilePath = this.imageUri[i].toString().replace(
            "capacitor://localhost/_capacitor_file_", 
            "file://" );
        }else{
          localFilePath = this.imageUri[i].toString().replace('http://localhost/_capacitor_file_', 'file://');
          //localFilePath = this.mediaNames[i];
        }


      //.replace('http://localhost/_capacitor_content_', 'content://');

      const roundedCropX = parseFloat(this.videoArgs[i].x.toFixed(5));
      const roundedCropY = parseFloat(this.videoArgs[i].y.toFixed(5));
      const roundedCropWidth = parseFloat(this.videoArgs[i].width.toFixed(5));
      const roundedCropHeight = parseFloat(this.videoArgs[i].height.toFixed(5));

        let newFileUrl = await VideoCropper.cropVideo({
            fileUrl: localFilePath,    
            cropX: roundedCropX,
            cropY: roundedCropY,
            cropWidth: roundedCropWidth,
            cropHeight: roundedCropHeight,
          });



        //this.removeFolderFromCache(this.imageUri[i]);
        //this.listFilesInDocumentsDirectory();

        let newUrl = Capacitor.convertFileSrc(newFileUrl.outputfileUrl);


        console.log("newFileUrl", newFileUrl);
        console.log("newFileUrl", newUrl);

        // this.imageUri[1] = newUrl;
        // this.isVideoList[1] = true;
        this.mediaNames[i] = Math.random().toString(36).substring(2, 15) + '.mp4';
        

        const file = await this.fileUrlToFile(newUrl, this.mediaNames[i]); // Assuming base64ToFile is implemented
        files.push(file); // Push the converted file to the array 
        
        if(this.platform.is('ios')){
          this.removeFolderFromCacheForIos(this.imageUri[i]);
        }else{
          //this.deleteCroppedVideoFromCacheForAndroid(newFileUrl.outputfileUrl);
        }

        if(i==0){
          const thumb = await this.compressImage(this.thumbnail);
                
          // Extract the MIME type from dataUrl
          const mimeType = this.thumbnail.substring(this.thumbnail.indexOf(":") + 1, this.thumbnail.indexOf(";"));

          // Trim the "image/" part and prepend a dot to get the file extension
          const extension = '.' + mimeType?.split('/')[1];

          // Generate a filename with the appropriate extension
          this.mediaNames.splice(1, 0,  `photo_${new Date().getTime()}${extension}`);
          this.imageUri.splice(1,0, this.thumbnail);
          this.isVideoList.splice(1,0, false);
          files.push(thumb);
        }
      }
      else{
        const img = await this.compressImage(this.imageUri[i]);
        files.push(img);
      }
    }
    let addPostRequest: AddPostRequest = new AddPostRequest();
    addPostRequest.AspectRatio = this.sliderHeight/window.innerWidth;
    addPostRequest.media = files;
    addPostRequest.post = post;
    //route
    console.log("files", files)
    this.router.navigateByUrl('tabs/free-user-canvas');
    this.videoCompressService.addPost(addPostRequest, this.mediaNames);
  }


  async listFilesInDocumentsDirectory() {
    try {
      // List all files in the Documents directory
      const result = await Filesystem.readdir({
        path: '', // Root of the directory
        directory: Directory.Cache, // Options: Documents, Caches, Data
      });
      
      console.log("Files and folders:", result.files);
      // Each item in result.files is a file or folder name within the specified directory
    } catch (error) {
      console.error("Unable to list files in directory:", error);
    }
  }

  async deleteCroppedVideoFromCacheForAndroid(filePath: string) {
    try {
      // Remove 'file://' prefix if present
      const path = filePath.replace('file://', '');
  
      await Filesystem.deleteFile({
        path: path,
        directory: Directory.Cache,
      });
  
      console.log('File deleted successfully:', path);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

async removeFolderFromCacheForIos(folderName: string) {
  try {
    let newfolder = this.getFolderPathAfterCaches(folderName);
    await Filesystem.rmdir({
      path: `Caches/${newfolder}`,
      directory: Directory.Library, // Points to `Library` where `Caches` is located
      recursive: true, // Ensures all contents within the folder are deleted
    });
    console.log('Folder removed successfully');
  } catch (error) {
    console.error('Error removing folder:', error);
  }
}

getFolderPathAfterCaches(filePath: string): string {
  const match = filePath.match(/Caches\/([^/]+)/);
  return match ? match[1] : ""; // Return the folder path or an empty string if no match
}


  async addPostForWeb(){
    let files: Blob[] = [];
    let post: Post = new Post;
    for(let i=0; i<this.imageUri.length; i++){
      if(this.isVideoList[i]){

        const file = await this.fileUrlToFile(this.imageUri[i], this.mediaNames[i]); // Assuming base64ToFile is implemented
        files.push(file); // Push the converted file to the array      
        if(i==0){
          const thumb = await this.compressImage(this.thumbnail);
                
          // Extract the MIME type from dataUrl
          const mimeType = this.thumbnail.substring(this.thumbnail.indexOf(":") + 1, this.thumbnail.indexOf(";"));

          // Trim the "image/" part and prepend a dot to get the file extension
          const extension = '.' + mimeType?.split('/')[1];

          // Generate a filename with the appropriate extension
          this.mediaNames.splice(1, 0,  `photo_${new Date().getTime()}${extension}`);
          this.imageUri.splice(1,0, this.thumbnail);
          this.isVideoList.splice(1,0, false);
          i++;
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
