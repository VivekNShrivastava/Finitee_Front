import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';

import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { City } from 'src/app/core/models/places/City';
import { Country } from 'src/app/core/models/places/Country';
import { State } from 'src/app/core/models/places/State';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PlacesService } from 'src/app/core/services/places.service';
import * as lodash from 'lodash';
import { SelectSearchableInput } from 'src/app/core/models/select-searchable/select-searchable-input';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage extends BasePage implements OnInit, OnDestroy {
  userProfile: UserProfile = new UserProfile();
  CountryList: Array<any> = [];
  CityList: Array<City> = [];
  subscription!: any;
  captureImageType: String = "";
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
    private authService: AuthService,
    public placeService: PlacesService,
    private navCtrl: NavController
  ) {
    super(authService);
    this.userProfile = this.router!.getCurrentNavigation()!.extras.state!['data'];
  }

  async ngOnInit() {
    this.loaded = false;
    this.loadCountryStateMasterData();
    this.onMediaSave();
  }


  allTraits(traits: any) {
    this.userProfile.user.Traits = traits;
  }


  onMediaSave() {
    this.subscription = this.attachmentService.getMediaSaveEmitter().subscribe((mediaObj: any) => {
      if (mediaObj != null) {
        console.log("mediaObj", mediaObj)
        if (this.captureImageType == "logo")
          this.userProfile.user.ProfileImage = mediaObj.thumbFilePath;
        else
          this.userProfile.user.Banner = mediaObj.thumbFilePath;
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
      responseData.forEach(async (photo: { filepath: any; }, index: number) => {
        if (this.captureImageType == "logo")
          this.userProfile.user.ProfileImage = AppConstants.mediaPrefix + photo.filepath;
        else
          this.userProfile.user.Banner = AppConstants.mediaPrefix + photo.filepath;
      });
    }
  }

  async captuerMedia(event: any, type: string) {
    event.stopPropagation();
    event.preventDefault();
    this.captureImageType = type;
    await this.attachmentService.openCameraToTakePhoto(true, CameraSource.Photos);
  }

  validateForm(product: any) {
    var valid = true;
    if (this.userProfile.user.ProfileImage && this.userProfile.user.ProfileImage.indexOf("localhost") != -1)
      valid = false;
    else if (this.userProfile.user.Banner && this.userProfile.user.Banner.indexOf("localhost") != -1)
      valid = false;
    return valid;
  }

  async saveUserProfile() {
    var isFormValid = this.validateForm(this.userProfile.user);
    if (isFormValid) {
      if (this.selectedState && this.selectedState.id)
        this.userProfile.user.Address.StateId = this.selectedState.id
      if (this.selectedCity && this.selectedCity.id)
        this.userProfile.user.Address.CityId = this.selectedCity.id

      delete this.userProfile.user.Id;
      var result = await this.businessCanvasService.saveBusinessUserProfile(this.userProfile.user);
      if (result) {
        //this.businessCanvasService.userProfile.user = this.userProfile.user;
        this.businessCanvasService.businessData.next(this.userProfile);
        this.navCtrl.pop();
      }
    } else {

    }
  }


  async loadCountryStateMasterData() {
    this.CountryList = await this.placeService.getAllConutriesFromStorage();
    var country = await this.placeService.findCountry({ id: this.userProfile.user.Address.CountryId });
    if (country) {
      this.selectedCountry = country;
      await this.loadStateData(country.id);
      var state = await this.placeService.findState(country.id, { id: this.userProfile.user.Address.StateId });
      if (state) {
        this.selectedState = state;
        await this.loadCityData(state.id);
        var city = await this.placeService.findCity(state.id, { id: this.userProfile.user.Address.CityId });
        if (city)
          this.selectedCity = city;
      }
    }
    this.loaded = true;
  }

  async loadStateData(CountryId: any) {
    this.stateSearchableInput = new SelectSearchableInput();
    this.stateSearchableInput.listData = await this.placeService.findState(CountryId, { all: true });
    this.stateSearchableInput.title = "Select state";
    this.stateSearchableInput.searchPlaceholder = "Search state";
    this.stateSearchableInput.searchable = true;
    if (this.userProfile.user.Address.StateId)
      this.stateSearchableInput.preSelected = this.userProfile.user.Address.StateId;
    this.stateSearchableInput.dataKeyMap = { title: "StateName", srno: "", id: "StateId", icon: "", detail: "" };
  };

  async loadCityData(StateId: any) {
    this.citySearchableInput = new SelectSearchableInput();
    this.citySearchableInput.listData = await this.placeService.findCity(StateId, { all: true });
    this.citySearchableInput.title = "Select city";
    this.citySearchableInput.searchPlaceholder = "Search city";
    this.citySearchableInput.searchable = true;
    if (this.userProfile.user.Address.CityId)
      this.citySearchableInput.preSelected = this.userProfile.user.Address.CityId;
    this.citySearchableInput.dataKeyMap = { title: "CityName", srno: "", id: "CityId", icon: "", detail: "" };

  }

  OpenStateModal() {
    this.selectStateModal.present();
  }

  async onStateSelected(event: any) {
    console.log("onStateSelected: ", event);
    this.selectStateModal.dismiss();
    this.selectedState = event[0];
    console.log(this.selectedState);
    this.stateSearchableInput.preSelected = this.selectedState.StateId;
    if (this.selectedState) {
      this.loadCityData(this.selectedState.id);
    }
  }

  onSelectStateModalDismiss(event: any) {
    this.selectStateModal.dismiss();
  }

  OpenCityModal() {
    this.selectCityModal.present();
  }
  onCitySelected(event: any) {
    console.log("onCitySelected: ", event);
    this.selectCityModal.dismiss();
    this.selectedCity = event[0];
    console.log(this.selectedCity);
    this.citySearchableInput.preSelected = this.selectedCity.CityId;
  }

  onSelectCityModalDismiss(event: any) {
    this.selectCityModal.dismiss();

  }

  openImage(imagePath: any) {
    this.navEx!.state!['data'] = imagePath;
    this.router.navigateByUrl('media-viewer', this.navEx);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
