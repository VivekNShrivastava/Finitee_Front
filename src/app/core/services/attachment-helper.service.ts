import { EventEmitter, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CaptureVideoOptions, MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { FileUploadRequest, FileUploadRequestNew } from 'src/app/core/models/FileUploadRequest';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { ImageCropperComponent } from '../components/image-cropper/image-cropper.component';

@Injectable({
  providedIn: 'root'
})
export class AttachmentHelperService {
  navEx: NavigationExtras = {
    state: {
      data: null,
      extraParams: null
    }
  };

  
  public onMediaSave: EventEmitter<any> = new EventEmitter<any>();
  public onMediaCoverSelction: EventEmitter<any> = new EventEmitter<any>();
  public serviceCallerCode: string | null = null;
  public serviceCallerEvent: string | null = null;
  public user!: FiniteeUser | null;
  private win: any = window;
  progress: any;
  public selectedVideoPath = "";
  constructor(
    private router: Router,
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private httpService: HttpClient,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalController: ModalController
  ) {
    this.user = this.authService.getUserInfo();
  }


  async captureMedia(mediaType: Number, sourceType: Number) {
    this.user = await this.authService.getUserInfo();
    if(mediaType === AppConstants.MEDIA_PICTURE && sourceType === AppConstants.SOURCE_CAMERA)       
      return this.openCameraToTakePhoto(false, CameraSource.Camera);
    else if (mediaType === AppConstants.MEDIA_VIDEO && sourceType === AppConstants.SOURCE_CAMERA)
      this.openCameraToRecordVideo();
    else if (sourceType === AppConstants.SOURCE_PHOTOLIBRARY)
      this.selectMediaFromGallery("post");
    return;
  }


  async openCameraToTakePhoto(edit: any, source: any) {
    
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera// Camera, Photos or Prompt!
    });

    
    console.log(image, "cam");
    const dimensions = await this.getImageDimensions(image.webPath);
    console.log('Width:', dimensions.width, 'Height:', dimensions.height);

    const aspectRatio = dimensions.width / dimensions.height;
    console.log('Aspect Ratio:', aspectRatio);

    // const photo = `data:image/${image.format};base64,${image.base64String}`;
    const photo = image.webPath;
    this.saveMedia(image.webPath, "I", dimensions.width, dimensions.height, aspectRatio);
    // return photo;
    // if (image) {
    //   // Open the image cropper modal
    //   const modal = await this.modalController.create({
    //     component: ImageCropperComponent,
    //     componentProps: {
    //       imageUri: image.base64String,
    //     },
    //   });
  
    //   // Present the modal
    //   await modal.present();

    //   const { data } = await modal.onDidDismiss();

    //   if (data) {
    //     this.saveMedia(data, "I")
    //   }
    // }
  }

  async getImageDimensions(imageSrc: any): Promise<{width: number, height: number}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = reject;
        img.src = imageSrc;
    });
  }

  async openCameraToRecordVideo() {
    let options: CaptureVideoOptions = { limit: 1, quality: 0, duration: 5 };
    var mediafile: any = await this.mediaCapture.captureVideo(options);
    console.log("mediafile", mediafile)
    var filepath: any = mediafile[0].fullPath;
    if (filepath) {
      console.log("filepath ", filepath)
      this.openVideoCoverSelectionPage(this.win.Ionic.WebView.convertFileSrc(filepath));
    }
  }

  async selectMediaFromGallery(media: string) {

    if(media === "profilePic"){
      const mediafileArray = await FilePicker.pickImages({
        multiple: false,
      });
      // console.log(mediafileArray, mediafileArray.files[0]);
      if (mediafileArray && mediafileArray.files[0]) {
        var mediafileProfile = mediafileArray.files[0];
        if(mediafileProfile){
          // console.log("profilepic", mediafileProfile);
          const filePath = this.win.Ionic.WebView.convertFileSrc(mediafileProfile.path);
          const dimensions = await this.getImageDimensions(filePath);
          const aspectRatio = dimensions.width / dimensions.height;
          // this.saveMedia(this.win.Ionic.WebView.convertFileSrc(mediafileProfile.path), "I");
          this.saveMedia(filePath, "I", dimensions.width, dimensions.height, aspectRatio);
        }
      }
    }else{
      const mediafileArray: any = await FilePicker.pickMedia({
        multiple: true,
        readData: true
      });
      // const mediafileArray: any = await Camera.pickImages({
      //   quality: 100,
      //   limit: 5
      // });
      console.log('media files ...');
      console.log(mediafileArray, mediafileArray.files[0]);
      if (mediafileArray && mediafileArray.files[0]) {
        var mediafile = mediafileArray.files[0];
        if (mediafile) {
          if (mediafile.mimeType.indexOf("video") != -1) {//video
            this.openVideoCoverSelectionPage(this.win.Ionic.WebView.convertFileSrc(mediafile.path));
          }
          else {//image 
            const filePath = this.win.Ionic.WebView.convertFileSrc(mediafile.path);
            const dimensions = await this.getImageDimensions(filePath);
            const aspectRatio = dimensions.width / dimensions.height;
            this.saveMedia(filePath, "I", dimensions.width, dimensions.height, aspectRatio);
          }
        }
      }
    }
    


  }



  openVideoCoverSelectionPage(filepath: any) {
    this.selectedVideoPath = filepath;
    //this.navEx!.state!['data'] = filepath;
    this.router.navigateByUrl('video-cover-selection');


    //this.navCtrl.navigateForward('video-cover-selection', this.navEx);
  }


  async saveMedia(filepath: any, ImageOrVideo: any, width: number, height: number, aspectRatio: number, thumbNailBase64?: any) {
    console.log("filePath", filepath)
    const response = await fetch(filepath);
    console.log("response", response)
    let fileBlob = await response.blob();
    console.log("fileBlob", fileBlob);
    if(fileBlob.type === 'application/octet-stream'){
      let newBlob;
      if(filepath.includes('video')){
        newBlob = new Blob([fileBlob], { type: 'video/mp4' });
        console.log('newBolb', newBlob);
        fileBlob = newBlob!;
      } 
      console.log("updated fileblob", fileBlob);
    }

    var filename = "";
    var thumbfilename = "";
    var thumbFilepath = "";
    var thumbfileBlob: any = "";
    if (ImageOrVideo === "V") {
      filename = moment().format('YYYYMMDD') + new Date().getTime() + '_' + this.user?.UserId + ".mp4";
      thumbfilename = moment().format('YYYYMMDD') + new Date().getTime() + '_' + this.user?.UserId + ".jpeg";
      thumbFilepath = this.win.Ionic.WebView.convertFileSrc(thumbNailBase64);
      thumbfileBlob = this.b64toBlob(thumbNailBase64);
    }
    else if (ImageOrVideo === "I") {
      filename = moment().format('YYYYMMDD') + new Date().getTime() + '_' + this.user?.UserId + ".jpeg";
      thumbFilepath = filepath;
    }
    const obj: FileUploadRequestNew = {
      mediaType: ImageOrVideo,
      name: filename,
      blob: fileBlob,
      filePath: filepath,
      thumbName: "Thumb_" + thumbfilename,
      thumbBlob: thumbfileBlob,
      thumbFilePath: thumbFilepath,
      width: width,
      height: height,
      aspectRatio: aspectRatio
    };
    console.log(obj);
    this.onMediaSave.emit(obj);
  }




  async pickFiles() {

  }



  public sanitizeLocalUrl(localurl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(localurl);
  }


  /*  public uploadFileToServer(path: Blob[], filename: string[]) {
     const formData = new FormData();
     path.map((res, idx) => {
       formData.append('file', res, filename[idx]);
     });
     let url = config.COM_URL + this.user?.UserId + "&module=TT";
     return this.httpService.post(url, formData);
   } */

  uploadFileToServerv2(formData: any, noToken?: boolean) {
    return new Promise((resolve, reject) => {
      this.progress = "0";
      console.log(formData)
      let url = noToken ? config.COMMON_UPLOAD_WO_TOKEN : config.COM_URL_NEW + this.user?.UserId + "&module=TT";
      this.httpService.post(url, formData, {
        reportProgress: true,
        observe: 'events',
      }).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            console.log('event.loaded ', event.loaded);
            console.log('event.total ', event.total);
            var CalProgress = Math.round(event.loaded / event.total * 100);
            this.progress = CalProgress;
            if (CalProgress >= 100)
              this.progress = 98;

            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            resolve(event.body)
        }
      }, (error) => {
        resolve('error');
      });
    });
  }


  public filenameGenerator(photoObjectFromServer: any): { photo: string, thumb: string } {
    return {
      photo: photoObjectFromServer.filename,
      thumb: photoObjectFromServer?.thumbfile,
    };
  }

  getMediaSaveEmitter() {
    return this.onMediaSave;
  }

  resolveAndroidContentUri(path: string) {
    console.log("resolveAndroidContentUri Start: path: ", path);
    return new Promise<string>((resolve, reject) => {
      this.win.FilePath.resolveNativePath(path, (absolutePath: string) => {
        resolve(absolutePath);
      })
    });
  }

  async getBlobFromFilePath(filePath: string, mimeType: string) {
    await this.win[`resolveLocalFileSystemURL`](filePath, (entry: any) => {
      entry[`file`](async (file: any) => {
        const reader = getFileReader();;
        reader.onloadend = async (evt: any) => {
          const fileBlob = new Blob([evt.target.result], { type: file.type });
          // file.name = 'Video_' + moment().format('YYYYMMDD') + new Date().getTime() + '.' + file.type.split('/')[1];
          let obj: FileUploadRequest = {
            data: this.win.Ionic.WebView.convertFileSrc(filePath),
            status: 'V',
            filepath: filePath,
            name: file.name,
            blob: fileBlob,
            blobUrl: this.sanitizeLocalUrl(URL.createObjectURL(fileBlob)),
            thumbnail: []
          };
          this.onMediaSave.emit(obj);
        };
        await reader.readAsArrayBuffer(file);
      });
    });
  }

  b64toBlob(dataURI: any) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  // resolveAndroidContentUri(path: string, mimeType: string) {
  //   console.log("resolveAndroidContentUri Start: path: ", path);
  //   return new Promise((resolve, reject) => {
  //     this.win.FilePath.resolveNativePath(path, (absolutePath: string) => {
  //       resolve(this.makeFileIntoBlob(absolutePath, mimeType));
  //     })
  //   });
  // }

  // FILE STUFF
  //  makeFileIntoBlob(_filePath: string, mimeType: string) {
  //   // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  //   console.log("makeFileIntoBlob Start: path: ", _filePath);
  //   return new Promise((resolve, reject) => {
  //    let fileName = "";
  //    this.file.resolveLocalFilesystemUrl(_filePath)
  //      .then(fileEntry => {
  //        let { name, nativeURL } = fileEntry;

  //        // get the path..
  //        let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
  //        console.log("makeFileIntoBlob path", path);
  //        console.log("makeFileIntoBlob fileName", name);

  //        fileName = name;

  //        // we are provided the name, so now read the file into
  //        // a buffer
  //        return this.file.readAsArrayBuffer(path, name);
  //      })
  //      .then(buffer => {
  //        // get the buffer and make a blob to be saved
  //        let imgBlob = new Blob([buffer], {
  //          type: mimeType//"image/jpeg"
  //        });
  //        console.log("makeFileIntoBlob blob: ", imgBlob.type, imgBlob.size);
  //        resolve({
  //          name: fileName,
  //          blob: imgBlob
  //        });
  //      })
  //      .catch(e => reject(e));
  //   });
  //  }

  //  public convertPathToWebPath(path: string) {
  //   console.log("convertPathToWebPath: A: Src: ", path);
  //   const fileSrc = Capacitor.convertFileSrc(path);
  //   console.log("convertPathToWebPath: B: Src: ", fileSrc);
  //   return fileSrc;
  // }

}



export function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
  return zoneOriginalInstance || fileReader;
}


// https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
/*  private async readAsBase64(photo: any) {
   if (this.plt.is('hybrid')) {
       const file = await Filesystem.readFile({
        path: photo.path
      });
 
      return file.data; 
     return "";
   }
   else {
     // Fetch the photo, read as a blob, then convert to base64 format
     const response = await fetch(photo.webPath);
     const blob = await response.blob();
 
     return await this.convertBlobToBase64(blob) as string;
   }
 }
 
 // Helper function
 convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
   const reader = new FileReader;
   reader.onerror = reject;
   reader.onload = () => {
     resolve(reader.result);
   };
   reader.readAsDataURL(blob);
 }); */

/* /*   async takePhoto(mediaType: Number, sourceType: Number) {
     console.log("y")
     const CameraOptions: any = {
       quality: 75,
       destinationType: this.camera.DestinationType.FILE_URI,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: mediaType,
       targetWidth: 400,
       targetHeight: 600,
       sourceType: sourceType,
       allowEdit: false,
       saveToPhotoAlbum: false,
       correctOrientation: true
     };
     console.log("takePhoto: A1: ");
     var imageData: any = await this.camera.getPicture(CameraOptions);
     console.log("takePhoto: A: ", imageData);
     await this.win[`resolveLocalFileSystemURL`](imageData, (entry: any) => {
       entry[`file`](async (file: any) => {
         //alert(file.size);
         console.log("takePhoto: B: ", file);
         const reader = getFileReader();
         reader.onloadend = (evt: any) => {
           console.log("takePhoto: C: ", evt);
           const fileBlob = new Blob([evt.target.result], { type: file.type });
           file.name = moment().format('YYYYMMDD') + new Date().getTime() + '_' + this.user?.UserId + '.' + file.type.split('/')[1];
           const obj: FileUploadRequest = {
             data: this.win.Ionic.WebView.convertFileSrc(imageData),
             status: 'P',
             filepath: imageData,
             name: file.name,
             blob: fileBlob,
             blobUrl: this.sanitizeLocalUrl(URL.createObjectURL(fileBlob))
           };
           console.log("takePhoto: D: ", obj);
           this.onMediaSave.emit(obj);
         };
         await reader.readAsArrayBuffer(file);
       });
     });
   }
  */
/*  async takeVideo(mediaType: Number, sourceType: Number) {
   if (sourceType == AppConstants.SOURCE_PHOTOLIBRARY) {
     const CameraOptions: any = {
       quality: 50,
       destinationType: this.camera.DestinationType.FILE_URI,
       mediaType: mediaType,
       sourceType: sourceType,
       targetHeight: 350,
       targetWidth: 350,
     };
     var videoURI: any = await this.camera.getPicture(CameraOptions);
     const filename = videoURI.substr(videoURI.lastIndexOf('/') + 1);
     let filPath = videoURI.substr(0, videoURI.lastIndexOf('/') + 1);
     filPath = filPath.includes('file://') ? filPath : 'file://' + filPath;
     let retrievedFile: any = null;
     const dirUrl = await this.file.resolveDirectoryUrl(filPath);
     retrievedFile = await this.file.getFile(dirUrl, filename, {});
     retrievedFile.file(async (data: any) => {
       // this.readVideo(retrievedFile);
       const dirpath = 'file://' + videoURI;
       const reader = getFileReader();
       reader.onloadend = (evt: any) => {
         const fileBlob = new Blob([evt.target.result], { type: data.type });
         const extension = retrievedFile.name.split('.')[retrievedFile.name.split('.').length - 1];
         data.name = moment().format('YYYYMMDD') +
           new Date().getTime() + '_' + this.user!.UserId + '.' + extension + '&' +
           this.user!.UserId + '&' + 'PV';
         const obj: FileUploadRequest = {
           data: this.win.Ionic.WebView.convertFileSrc(dirpath),
           status: 'V',
           filepath: retrievedFile.nativeURL,
           name: data.name,
           blob: fileBlob,
           blobUrl: this.sanitizeLocalUrl(URL.createObjectURL(fileBlob))
         };
 
         this.onMediaSave.emit(obj);
       };
       await reader.readAsArrayBuffer(data);
     });
   }
   else {
     let options: CaptureVideoOptions = { limit: 1, quality: 0, duration: 5 };
     var mediafile: any = await this.mediaCapture.captureVideo(options);
     var imageData: any = mediafile[0].fullPath;
     await this.win[`resolveLocalFileSystemURL`](imageData, (entry: any) => {
       entry[`file`](async (file: any) => {
         const reader = getFileReader();;
         reader.onloadend = async (evt: any) => {
           const fileBlob = new Blob([evt.target.result], { type: file.type });
           file.name = 'Video_' + moment().format('YYYYMMDD') + new Date().getTime() + '.' + file.type.split('/')[1];
           let obj: FileUploadRequest = {
             data: this.win.Ionic.WebView.convertFileSrc(imageData),
             status: 'V',
             filepath: imageData,
             name: file.name,
             blob: fileBlob,
             blobUrl: this.sanitizeLocalUrl(URL.createObjectURL(fileBlob)),
             thumbnail: []
           };
           this.onMediaSave.emit(obj);
         };
         await reader.readAsArrayBuffer(file);
       });
     });
   }
 }
 
 
*/ 