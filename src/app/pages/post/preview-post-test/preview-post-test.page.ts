import { Component, OnInit, ViewChild } from '@angular/core';
import { NewImageCropperComponent } from 'src/app/core/components/new-image-cropper/new-image-cropper.component';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-preview-post-test',
  templateUrl: './preview-post-test.page.html',
  styleUrls: ['./preview-post-test.page.scss'],
})
export class PreviewPostTestPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides!: IonSlides;
  @ViewChild(NewImageCropperComponent) imageCropperComponent!: NewImageCropperComponent;
  paramsData: any;
  imageUri: string[] = [];
  isVideoList: boolean[] = [];
  sliderHeight: number = 0;
  sliderOpts = {
    allowTouchMove: true
  };

  constructor(
    private router: Router
  ) { 
    this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    this.imageUri = this.paramsData.mediaUrlDataArray;
    this.isVideoList = this.paramsData.isVideoList;
    this.sliderHeight = this.paramsData.slideHeight;

  }

  ngOnInit() {
  }

}
