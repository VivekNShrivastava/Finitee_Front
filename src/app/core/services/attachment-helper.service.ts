import { EventEmitter, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CaptureVideoOptions, MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { FileUploadRequest, FileUploadRequestNew } from 'src/app/core/models/FileUploadRequest';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ImageCropperComponent } from '../components/image-cropper/image-cropper.component';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { VideoCropper } from 'video-cropper-processor';


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
    private platform: Platform,
    private navCtrl: NavController,
    private modalController: ModalController
  ) {
    this.user = this.authService.getUserInfo();
  }


  async captureMedia(mediaType: Number, sourceType: Number) {
    this.user = await this.authService.getUserInfo();
    console.log("here we are");
    if(mediaType === AppConstants.MEDIA_PICTURE && sourceType === AppConstants.SOURCE_CAMERA)       
      return this.openCameraToTakePhoto(false, CameraSource.Camera);
    else if (mediaType === AppConstants.MEDIA_VIDEO && sourceType === AppConstants.SOURCE_CAMERA)
      this.openCameraToRecordVideo();
    else if (sourceType === AppConstants.SOURCE_PHOTOLIBRARY){
        //this.selectMediaFromGallery("post");
        this.selectMediaFromGallery2();
    }
    return;
  }


  async openCameraToTakePhoto(edit: any, source: any) {
    
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera// Camera, Photos or Prompt!
    });


    // Extract the MIME type from dataUrl
    const mimeType = image.dataUrl?.substring(image.dataUrl.indexOf(":") + 1, image.dataUrl.indexOf(";"));

    // Trim the "image/" part and prepend a dot to get the file extension
    const extension = '.' + mimeType?.split('/')[1];

    // Generate a filename with the appropriate extension
    const fileName = `photo_${new Date().getTime()}${extension}`;

    this.saveMedia( "I", fileName, image.dataUrl);
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

  async selectProfileFromGallery(){
      const mediafileArray: any = await FilePicker.pickImages({})
      if(mediafileArray.files[0]){
        console.log(mediafileArray)
        let mediafileProfile = mediafileArray.files[0];
          let fileURLimage = "";
          if(this.platform.is('desktop') || this.platform.is('mobileweb')){
            fileURLimage = URL.createObjectURL(mediafileProfile.blob);
          }else if(this.platform.is('ios')){
            fileURLimage = Capacitor.convertFileSrc(mediafileProfile.path);
          }else if(this.platform.is('android')){
            fileURLimage = Capacitor.convertFileSrc(mediafileProfile.filepath);
            if (fileURLimage.endsWith('.heic') || fileURLimage.endsWith('.HEIC')) {
              try {
                const result = await VideoCropper.convertAndReplaceHEICWithJPG({
                  filePath: mediafileProfile.filepath,
                });
                fileURLimage = Capacitor.convertFileSrc(result.outputfileUrl); // Update the file path to the new JPG file
                console.log("Converted HEIC to JPG:", fileURLimage);
              } catch (error) {
                console.error("Error converting HEIC to JPG:", error);
              }
            }
          }
        this.saveMedia("I", mediafileProfile.name, fileURLimage);
      }
    }

  async fileUrlToBase64(fileUrl: string): Promise<any> {
    try {
      // Read the file as base64
      const file = await Filesystem.readFile({
        path: fileUrl,
      });
  
      // The 'data' property contains the Base64 string
      return file.data;
    } catch (error) {
      console.error('Error reading file as Base64:', error);
      throw error;
    }
  }
  
  async selectMediaFromGallery2() {
    const mediafileArray: any = await FilePicker.pickMedia({
      limit:1
    });
    
    if (mediafileArray) {
      for (const mediafileProfile of mediafileArray.files) {
        console.log("files of media", mediafileProfile)
        let fileURLimage = "";
        
        if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
          fileURLimage = URL.createObjectURL(mediafileProfile.blob);
        } else if (this.platform.is('ios')) {
          fileURLimage = Capacitor.convertFileSrc(mediafileProfile.path);
        } else if (this.platform.is('android')) {
          fileURLimage = Capacitor.convertFileSrc(mediafileProfile.filepath);
          
          if (fileURLimage.endsWith('.heic') || fileURLimage.endsWith('.HEIC')) {
            try {
              const result = await VideoCropper.convertAndReplaceHEICWithJPG({
                filePath: mediafileProfile.filepath,
              });
              fileURLimage = Capacitor.convertFileSrc(result.outputfileUrl); // Update the file path to the new JPG file
              console.log("Converted HEIC to JPG:", fileURLimage);
            } catch (error) {
              console.error("Error converting HEIC to JPG:", error);
            }
          }
        }
        if (mediafileProfile.mimeType.indexOf("video") != -1){
          await this.saveMedia("V", mediafileProfile.name, fileURLimage);
        }else{
          await this.saveMedia("I", mediafileProfile.name, fileURLimage);

        }
      }
    }
  }
  

  async selectMediaFromGallery() {

      const mediafileArray: any = await FilePicker.pickMedia({
    
      })

      console.log("mediaFile", mediafileArray)
      
      if (mediafileArray && mediafileArray.files[0]) {
        var mediafile = mediafileArray.files[0];
        if (mediafileArray.files) {
          if (mediafile.mimeType.indexOf("video") != -1) {//video
            // const fileURL = 'data:' + mediafile.mimeType + ';base64,' + mediafile.data;
            let fileURL = "";
            if(this.platform.is('desktop') || this.platform.is('mobileweb')){
              fileURL = URL.createObjectURL(mediafile.blob);
            }else if(this.platform.is('ios')){
              console.log("mediafile path", mediafile.path);
              fileURL = Capacitor.convertFileSrc(mediafile.path);
            }else if(this.platform.is('android')){
              console.log("mediafile path", mediafile.filepath)
              fileURL = Capacitor.convertFileSrc(mediafile.filepath);
            }
            console.log("fileUrl new", fileURL.substring(0, 70))
            this.saveMedia("V", mediafile.name, fileURL);
            // const fileURL = this.createURLFromBase64(mediafile.data, mediafile.mimeType);
            // this.openVideoCoverSelectionPage(fileURL);
            // this.openVideoCoverSelectionPage(this.win.Ionic.WebView.convertFileSrc(mediafile.data));
          }
          else {//image 
            // if(mediafileArray.files.length > 1){
              for(let i=0; i<mediafileArray.files.length; i++){
                console.log(mediafileArray.files[i]);
                
                // const filePath = 'data:' + mediafileArray.files[i].mimeType + ';base64,' + mediafileArray.files[i].data;
                let filePath = "";
                if(this.platform.is('desktop') ||  this.platform.is('mobileweb')){
                  filePath = URL.createObjectURL(mediafile.blob);
                }else if(this.platform.is('ios')){
                  console.log("mediafile path", mediafile.path);
                  filePath = Capacitor.convertFileSrc(mediafile.path);
                }else if(this.platform.is('android')){
                  console.log("mediafile path", mediafile.filepath)
                  filePath = Capacitor.convertFileSrc(mediafile.filepath);
                }              
                this.saveMedia("I", mediafile.name, filePath);
              }
          }
        }
      }
  }



  createURLFromBase64(base64Data: string, mimeType: string): string {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  openVideoCoverSelectionPage(filepath: any) {
    this.selectedVideoPath = filepath;
    //this.navEx!.state!['data'] = filepath;
    this.router.navigateByUrl('video-cover-selection');


    //this.navCtrl.navigateForward('video-cover-selection', this.navEx);
  }


  async saveMedia(ImageOrVideo: any, filename: any, fileUrl: any) {
    
    const obj: FileUploadRequestNew = {
      mediaType: ImageOrVideo,
      name: filename,
      fileUrl: fileUrl
    };
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
}



export function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
  return zoneOriginalInstance || fileReader;
}
