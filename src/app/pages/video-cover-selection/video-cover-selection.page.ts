import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { ThumbnailHelperService } from 'src/app/core/services/thumbnail-helper.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-video-cover-selection',
  templateUrl: './video-cover-selection.page.html',
  styleUrls: ['./video-cover-selection.page.scss'],
})
export class VideoCoverSelectionPage implements OnInit, AfterViewInit {
  @ViewChild('mainVideo', { static: false }) videoEl!: ElementRef;
  @ViewChild('canvas', { static: true }) canvasEl!: ElementRef;
  @ViewChild('canvasThumbSlider', { static: true }) canvasThumbSliderEl!: ElementRef;
  @ViewChild('canvasThumbMain', { static: true }) canvasThumbMainEl!: ElementRef;

  @ViewChild('myRange', { static: true }) myRangeEl!: ElementRef;


  public defaultVideoFile = "assets/video/video.mp4";
  private _CANVAS: any;
  private _CONTEXT: any;
  private _VIDEO: any;
  private _SELECTEDIMAGE: any;
  private win: any = window;
  rangeval: any = 0;
  videoCover: any = "";
  currenTCountOfThumbnail = 1;
  maxNoOfThumbanil = 6;
  seekTo = 0;
  vidTimeIntrvl = 1;
  leftOffsetX = 0;
  slectedImage = "";
  videduration: any;
  pageWidth: any;
  pageheight: any;
  canvasWidth: any;
  canvasContianerWidth: any;
  perFramWidth: any = 48;
  perFramHeight: any = 38;
  subscription!: Subscription;
  loaded: any = false;

  constructor(private platform: Platform, private attchmentService: AttachmentHelperService, private router: Router, 
    private navCtrl: NavController, private thumbnailService: ThumbnailHelperService) {
    // super(authService);
    this.pageWidth = this.win.innerWidth;
    this.pageheight = this.win.innerHeight;
    this.loaded = false;
    //this.defaultVideoFile = this.attchmentService.selectedVideoPath;//this.router.getCurrentNavigation()!.extras!.state!['data'];
    this.defaultVideoFile =  this.router!.getCurrentNavigation()!.extras!.state!['data'];

  }

  get appConstants() {
    return AppConstants;
  }


  ngOnInit() {

  }

  async ngAfterViewInit() {
    await this.platform.ready();
    this.initializeVariable();
    setTimeout(() => {
      this.initializeVideo(this.defaultVideoFile)
    }, 1000);

  }

  initializeVariable() {
    this.rangeval = 0;
    this.currenTCountOfThumbnail = 1;
    this.maxNoOfThumbanil = 6;
    this.seekTo = 0;
    this.vidTimeIntrvl = 1;
    this.leftOffsetX = 0;
    this.slectedImage = "";
  }


  getVideoFormatFromBase64(base64: string): string | null {
    // Check if the base64 string starts with a data URL and contains a MIME type
    const matches = base64.match(/^data:video\/([a-zA-Z0-9.-]+);base64,/);
  
    if (matches && matches.length > 1) {
      return matches[1]; // Return the video format (e.g., "mp4", "webm", etc.)
    }
  
    return null; // Return null if no valid MIME type is found
  }

  initializeVideo(src: any) {
    this._VIDEO = this.videoEl.nativeElement;
    let extension = this.getVideoFormatFromBase64(src);
    if(extension!=="quicktime"){
      this._VIDEO.src = src;
    }
    this._VIDEO.onloadeddata = (event: any) => {
      this.videduration = parseInt(this._VIDEO.duration);
      var partVideoDurationRatio: any = (this.pageWidth - 15) / this.perFramWidth;
      this.maxNoOfThumbanil = parseInt(partVideoDurationRatio);
      this.canvasWidth = this.maxNoOfThumbanil * this.perFramWidth;
      this.canvasContianerWidth = this.canvasWidth + 'px';
      this.vidTimeIntrvl = this._VIDEO.duration / parseInt(partVideoDurationRatio);
      this._CANVAS = this.canvasEl.nativeElement;
      this._CONTEXT = this._CANVAS.getContext('2d');
      this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
      this.createVidThumbnailsAndDisplay();
    };
  }


  createVidThumbnailsAndDisplay() {
    if (this.currenTCountOfThumbnail <= this.maxNoOfThumbanil) {
      this._VIDEO.currentTime = this.seekTo;
      setTimeout(() => {
        if (this.currenTCountOfThumbnail == 1)
          this.changeRange(0);

        this._CONTEXT.globalAlpha = 0.5;
        this._CONTEXT.drawImage(this._VIDEO, this.leftOffsetX, 0, this.perFramWidth, this.perFramHeight);
        this.seekTo = this.seekTo + this.vidTimeIntrvl;
        this.leftOffsetX = this.leftOffsetX + this.perFramWidth;
        this.currenTCountOfThumbnail++;
        this.createVidThumbnailsAndDisplay();
      }, 500);
    } else {
      this.changeRange(0);
      this.loaded = true;
      this.myRangeEl.nativeElement.value = 0;
    }
  }

  onCanPlay(event: Event) {
    console.log('Video is playable.');
  }

  changeRange(val: any) {
    this._VIDEO.currentTime = val;
    setTimeout(() => {
      var _CANVASTHUMB = this.canvasThumbSliderEl.nativeElement;
      var _CONTEXTTHUMB = _CANVASTHUMB.getContext('2d');
      _CONTEXTTHUMB.drawImage(this._VIDEO, 0, 0, 47, 44);
      this.rangeval = this._VIDEO.currentTime;
      this.setRangeThumbImage(_CANVASTHUMB.toDataURL());
    }, 250);
  }

  setRangeThumbImage(url: any) {
    this.videoCover = url;
    let s = document.createElement("style");
    document.head.appendChild(s);
    s.textContent = `.slider::-webkit-slider-thumb {
      background-image: url(${url}) !important;
    }`
  }

  saveCover() {
    this.navCtrl.pop();
  }

  

  ngOnDestroy() {

    setTimeout(() => {
      console.log(this._VIDEO.videoHeight);
      var _CANVASTHUMBMain = this.canvasThumbMainEl.nativeElement;
      _CANVASTHUMBMain.width= this._VIDEO.videoWidth;
      _CANVASTHUMBMain.height= this._VIDEO.videoHeight;
      var _CONTEXTTHUMBMain = _CANVASTHUMBMain.getContext('2d');
      _CONTEXTTHUMBMain.drawImage(this._VIDEO, 0, 0, this._VIDEO.videoWidth, this._VIDEO.videoHeight);
      var coverThumb = _CANVASTHUMBMain.toDataURL();
      // console.log(" this._VIDEO.width", this._VIDEO.videoWidth);
      // console.log("this._VIDEO.height", this._VIDEO.videoHeight);
      // console.log("coverThumb", coverThumb);
      // this.attchmentService.onMediaCoverSelction.emit({
      //   filepath: this.defaultVideoFile,
      //   cover: coverThumb,
      //   width: this._VIDEO.videoWidth,
      //   height: this._VIDEO.videoHeight
      // });


      this.thumbnailService.onMediaCoverSelction.emit({
        cover: coverThumb
      })
    
    }, 300);
  }
}
