import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController, AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { City } from 'src/app/core/models/places/City';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { UserCanvasProfile, UserProfile, UserProfileImgAbt } from 'src/app/core/models/user/UserProfile';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { FreeUserCanvasService } from 'src/app/core/services/canvas-home/freeuser-canvas.service';
import { PlacesService } from 'src/app/core/services/places.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AppConstants } from 'src/app/core/models/config/AppConstants';


@Component({
  selector: 'app-edit-personal-page',
  templateUrl: './edit-personal.page.html',
  styleUrls: ['./edit-personal.page.scss'],
})
export class EditPersonalPage extends BasePage implements OnInit, OnDestroy {

  userProfile: UserProfile = new UserProfile();
  userCanvasProfile: UserCanvasProfile = new UserCanvasProfile();
  userProfileImgAbt: UserProfileImgAbt = new UserProfileImgAbt();
  CountryList: Array<any> = [];
  CityList: Array<City> = [];
  subscription!: any;
  stateSearchableInput!: SelectSearchableInput;
  citySearchableInput!: SelectSearchableInput;
  selectedCountry: any;
  selectedState!: any;
  selectedCity!: any
  loaded: boolean = false
  @ViewChild('selectStateModal') selectStateModal!: IonModal;
  @ViewChild('selectCityModal') selectCityModal!: IonModal;

  constructor(
    private router: Router,
    private attachmentService: AttachmentHelperService,
    public businessCanvasService: BusinessCanvasService,
    public freeUserCanvasService: FreeUserCanvasService,
    private alertController: AlertController,
    private authService: AuthService,
    public placeService: PlacesService,
    private navCtrl: NavController
  ) {
    super(authService);
    this.userCanvasProfile = this.router!.getCurrentNavigation()!.extras.state!['data'];
    // this.userProfile = this.router!.getCurrentNavigation()!.extras.state!['data'];
  }

  async ngOnInit() {
    this.loaded = false;
    this.onMediaSave();
  }

  onMediaSave() {
    console.log("onmediaSave...")
    this.subscription = this.attachmentService.getMediaSaveEmitter().subscribe((mediaObj: any) => {
      if (mediaObj != null) {
        console.log("mediaObj", mediaObj)
        // this.userProfile.user.ProfileImage = mediaObj.thumbFilePath;
        this.userProfileImgAbt.ProfileImage = mediaObj.thumbFilePath;

        this.uploadFileToserver(mediaObj);
      }
    })
  }

  async uploadFileToserver(mediaObj: any) {
    const formData = new FormData();
    formData.append('file', mediaObj.blob, mediaObj.name);
    var response: any = await this.attachmentService.uploadFileToServerv2(formData);
    if (response != "error") {
      var responseData = response.ResponseData;
      console.log("responseData", responseData);
      //responseData.forEach(async (photo: { filepath: any; }, index: number) => {
      // this.userProfile.user.ProfileImage = responseData[0].thumbFilePath;
      this.userProfileImgAbt.ProfileImage = responseData[0].thumbFilePath;

      //});
    }
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }


  async captuerMedia(event: any) {


    const alert = await this.alertController.create({
      header: 'Take a Photo or Choose from Gallery',
      message: '',
      buttons: [
        {
          text: 'Camera',
          cssClass: 'alert-button-cancel',
          role: 'camera',
          handler: async () => {
            await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Camera);
          },
        },
        {
          text: 'Library',
          cssClass: 'alert-button-confirm',
          role: 'Photos',
          handler: async () => {
            // await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Photos);
            await this.attachmentService.selectMediaFromGallery("profilePic");
          },
        },
      ],
    });
    await alert.present();

    event.stopPropagation();
    console.log("caputing....")
    event.preventDefault();
    // await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Camera);
    // await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Prompt);

  }



 





  validateForm(product: any) {
    var valid = true;
    if (this.userCanvasProfile.canvasProfile.ProfileImage && this.userCanvasProfile.canvasProfile.ProfileImage.indexOf("localhost") != -1)
      valid = false;
    else if (this.userProfile.user.Banner && this.userProfile.user.Banner.indexOf("localhost") != -1)
      valid = false;

    
    return valid;
  }

  async saveUserProfile() {
    console.log("saveuser", this.userCanvasProfile.canvasProfile.ProfileImage)


    
    var isFormValid = this.validateForm(this.userCanvasProfile.canvasProfile);
    if (isFormValid) {
      if (this.selectedState && this.selectedState.id)
        this.userProfile.user.Address.StateId = this.selectedState.id
      if (this.selectedCity && this.selectedCity.id)
        this.userProfile.user.Address.CityId = this.selectedCity.id

      delete this.userProfile.user.Id;
      var result = await this.businessCanvasService.saveBusinessUserProfile(this.userProfile.user);
      if (result) {
        this.businessCanvasService.businessData.next(this.userProfile);
        this.navCtrl.pop();
      }
    } else {

    }
  }

  async saveUserImgAbt() {
    this.userProfileImgAbt.About = this.userCanvasProfile.canvasProfile.About;
    if(this.userProfileImgAbt.ProfileImage === "")
      this.userProfileImgAbt.ProfileImage = this.userCanvasProfile.canvasProfile.ProfileImage;
    else{
      console.log("changing canvas profile", this.userCanvasProfile.canvasProfile.ProfileImage)
      this.userCanvasProfile.canvasProfile.ProfileImage = this.userProfileImgAbt.ProfileImage;
    }
    console.log(this.userCanvasProfile.canvasProfile.ProfileImage);
    
    var response = await this.freeUserCanvasService.saveUserImgAbt(this.userProfileImgAbt);    
    // console.log("imgAbt", response);
    console.log("navgating to canvas...");
    this.router.navigateByUrl('tabs/free-user-canvas');
  }
  

  openImage(imagePath: any) {
    console.log("Opening Image....")
    this.navEx!.state!['data'] = imagePath;
    this.router.navigateByUrl('media-viewer', this.navEx);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
