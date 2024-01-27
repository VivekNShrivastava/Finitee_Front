import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FileUploadRequest } from 'src/app/core/models/FileUploadRequest';
import { FiniteeUser } from 'src/app/core/models/user/FiniteeUser';
import * as config from 'src/app/core/models/config/ApiMethods';

@Component({
  selector: 'app-create-totem',
  templateUrl: './totem-details.component.html',
  styleUrls: ['./totem-details.component.scss'],
})
export class TotemDetailsComponent implements OnInit {
  user!: FiniteeUser;
  ttmTitle!: string;
  ttmDesc!: string;
  photoFile: string[] = <string[]>[];
  progress: any = 0;
  ttmid!: number;
  media = {
    img: null,
    timg: null,
    vd: null
  };
  imageData!: string;
  photoInfo!: FileUploadRequest | null;
  filename: string | null = null;
  status: 'N' | 'E' = 'N';
  existingTotem = null;
  lstThumbnail: string[] = [];
  private win: any = window;
  selectedThumbnail = {
    url: '',
    filePath: ''
  };
  selectedIndex: number = 0;
  location!: any;
  constructor(
    // private statusBar: StatusBar,
    public httpService: HttpClient,
    public router: Router,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    public authService: AuthService,
    public attachmentService: AttachmentHelperService,
  ) {
    // this.statusBar.overlaysWebView(false);
    this.route.queryParams.subscribe(() => {
      if (this.router?.getCurrentNavigation()?.extras.state) {
        const result: any = this.router.getCurrentNavigation()?.extras?.state?.['data'];
        this.location = result.location;
        this.status = result.status;
        this.existingTotem = result.existingTotem || null;
        if (this.status == 'E') {
          this.setupUpdateTotem(this.existingTotem);
        }
      }
    });
    this.attachmentService.onMediaSave.subscribe(data => {
      if (data != null) {
        this.photoInfo = data;
        this.imageData = data.data;
        if (this.photoInfo?.thumbnail?.length) {
          this.selectedThumbnail = this.photoInfo.thumbnail[0];
        }
      }
    })
  }
  gotoback() {
    this.navCtrl.back();
  }

  async ngOnInit() {
    this.photoFile = [];
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      message: 'Remove Image ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        }, {
          text: 'Camera',
          handler: () => {
            this.photoInfo = null;
            this.filename = null;
          }
        }
      ]
    });
    await alert.present();
  }

  async addMedia(source: 'C' | 'G' | 'V') {
    if (source == 'G') {
      //await this.attachmentService.setCameraStatus('TT', 'isSaveTotem', 'Gallery');
    }
    if (source == 'C') {
      //await this.attachmentService.setCameraStatus('TT', 'isSaveTotem', 'Camera');
    }
    if (source == 'V') {
      //await this.attachmentService.setCameraStatus('TT', 'isSaveTotem', 'Video');
    }
  }

  async saveTotem() {
    if (!!this.photoInfo) {
      // this.authService.showLoader();
      let thumbImg;
      let video = '';
      let isMedia = false;
      const formData = new FormData();
      formData.append('file', this.photoInfo.blob, this.photoInfo.name);
      var response: any = await this.attachmentService.uploadFileToServerv2(formData);
      if (response.ResponseData.length > 0) {
        response.ResponseData.map((item: any) => {
          const names = this.attachmentService.filenameGenerator(item);
          isMedia = true;
          thumbImg = names.thumb;
          if ((item.extension.match(/.(jpg|jpeg|png|gif)$/i) ? 'P' : 'V') === 'P') {
            this.filename = names.photo;
          } else {
            video = names.photo;
          }
        });
      }



      if (this.photoInfo.status === 'V' && this.selectedThumbnail?.filePath) {
        let thumbnail_name = '';
        if (video.includes('Video_')) {
          thumbnail_name = video.replace('.mp4', '.jpg');
          var idx = thumbnail_name.indexOf(".jpg");
          if (idx > -1)
            thumbnail_name = thumbnail_name.substr(0, idx) + "_thumbail" + thumbnail_name.substr(idx);
        }
        // thumbImg = await this._photo.getBlobFile(this.selectedThumbnail?.filePath, video);
        console.log("🚀 ~ saveTotem ~ thumbImg", thumbImg)
      }
      const params = {
        userid: this.user.UserId,
        titl: this.ttmTitle == undefined ? null : this.ttmTitle,
        img: !!this.filename ? this.filename : null,
        discrp: this.ttmDesc == undefined ? null : this.ttmDesc,
        lat: this.location.lat,
        lng: this.location.lng,
        dt: moment().format('YYYY-MM-DD HH:mm:ss'),
        timg: thumbImg || null,
        ismedia: isMedia,
        vd: video,
        ustyid: this.user.UserTypeId
      };
      const method = config.SAVE_TTM;
      this.httpService.post(method, params)
        .subscribe((result: any) => {
          // this.httpService.hideLoader();
          if (result.ResponseData != null) {
            console.log(config.SAVE_TTM, result.ResponseData);
            if (result.ResponseData == 0) {
              // this.httpService.showLog('', 'Already totem is created');
            } else {
              this.navCtrl.navigateRoot('/tabs/tab5');
            }
          }
        }, error => {
          // this.httpService.hideLoader();
        }
        );
    } else {
      // this.httpService.showLog('', 'Totem Image is mandatory');
    }
  }
  async closeModal() {
    this.modalController.dismiss();
  }
  ngOnDestroy() {
  }

  async updateTotem() {
    const params: any = {
      ttmid: this.ttmid,
      userid: this.user.UserId,
      titl: this.ttmTitle || null,
      discrp: this.ttmDesc || null,
      lat: this.location.lat,
      lng: this.location.lng,
      dt: moment().format('YYYY-MM-DD HH:mm:ss'),
      ...this.media
    };
    const method = config.UPDATE_TOTEM;
    if (this.photoInfo) {
      // this.httpService.showLoader();
      let thumbImg = '';
      let video = '';
      let isMedia = false;
      const formData = new FormData();
      formData.append('file', this.photoInfo.blob, this.photoInfo.name);
      var response: any = await this.attachmentService.uploadFileToServerv2(formData);
      console.log('get response', response);
      if (response.ResponseData.length > 0) {
        await response.ResponseData.map((item: any) => {
          const names = this.attachmentService.filenameGenerator(item);
          isMedia = true;
          thumbImg = names.thumb;
          if ((item.extension.match(/.(jpg|jpeg|png|gif)$/i) ? 'P' : 'V') === 'P') {
            this.filename = names.photo;
          } else {
            video = names.photo;
          }
        });
      }
      params.img = !!this.filename ? this.filename : null;
      params.timg = thumbImg || null;
      params.vd = video;
    }
    this.httpService.post(method, params).subscribe(
      s => {
        // this.httpService.hideLoader(true);
        // this.httpService.showLog('Success', 'Totem Updated Successfully');
      },
      e => {
        // this.httpService.hideLoader(true);
      }
    );
  }
  setupUpdateTotem(data: any) {
    this.imageData = config.VIEW_URL + data.usrid + data.img;
    this.ttmTitle = data.titl;
    this.ttmDesc = data.desc;
    const isVideo = !(data.tvd == 'totem/');
    if (!isVideo) {
      this.media.img = data.img;
      this.media.timg = data.ttimg;
    }
    if (isVideo) {
      this.media.vd = data.tvd;
      this.media.timg = data.ttimg;
    }
    console.log('updateTotemSetup', this.imageData, this.media);
  }

  selectImage(image: any, index: any) {
    this.selectedThumbnail = image;
    this.selectedIndex = index;
  }

}
