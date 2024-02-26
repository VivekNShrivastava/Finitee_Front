import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppConstants } from '../../models/config/AppConstants';

import { AttachmentHelperService } from '../../services/attachment-helper.service';
import { Capacitor } from '@capacitor/core';
import { Console } from 'console';

@Component({
  standalone: true,
  selector: 'app-multiple-media-upload',
  templateUrl: './mutiple-media-upload.component.html',
  styleUrls: ['./mutiple-media-upload.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MultipleMediaUploadComponent implements OnInit {
  @Input() mediaFiles: Array<string> = [];
  @Output() filePathEvent = new EventEmitter<string>();
  mediaSaveSubscription!: Subscription;
  mediaCoverSubscription!: Subscription;
  readonly appConstants: any = AppConstants;
  isUploadDisabled: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() postLimit: number = 0;
  @Input() videoRecDisable: number = 0;
  @Input() photoLibrary: number = 0;

  constructor(public attachmentService: AttachmentHelperService) {
    this.mediaSaveCallBack();
  }

  ngOnInit() {
    console.log("rex", this.videoRecDisable )
    console.log("sdf", this.isDisabled)
  }


  async mediaSaveCallBack() {
    try {
      await this.mediaCoverSubscription.unsubscribe();
      await this.mediaSaveSubscription.unsubscribe();
    }
    catch (e) {

    }
    this.mediaSaveSubscription = this.attachmentService.onMediaSave.subscribe(mediaObj => {
      if (mediaObj != null) {
        this.filePathEvent.emit(mediaObj.thumbFilePath);
        console.log("mediaObj", mediaObj)
        this.uploadFileToserver(mediaObj);
      }
    })
    this.mediaCoverSubscription = this.attachmentService.onMediaCoverSelction.subscribe((mediaObj: any) => {
      if (mediaObj != null) {
        this.attachmentService.saveMedia(mediaObj.filepath, "V", mediaObj.cover);
      }
    })
  }

  async captuerMedia(event: any, MediaType: Number, SourceType: Number) {
    event.stopPropagation();
    event.preventDefault();
    console.log(MediaType + "  --  " + SourceType);
    await this.attachmentService.captureMedia(MediaType, SourceType);
  }


  async uploadFileToserver(mediaObj: any) {
    this.isUploadDisabled = true;
    const formData = new FormData();
    formData.append('file', mediaObj.blob, mediaObj.name);
    if (mediaObj.mediaType == "V")
      formData.append('file', mediaObj.thumbBlob, mediaObj.thumbName);
    var response: any = await this.attachmentService.uploadFileToServerv2(formData);
    if (response != "error") {
      var responseData: any = response.ResponseData;
      console.log("responseData", responseData);
      if (responseData && responseData.length > 0)
        this.filePathEvent.emit(responseData[0].thumbFilePath);
      //responseData.forEach(async (photo: { thumbFilePath: any; }, index: number) => {

      //});
    }
    this.isUploadDisabled = false;
  }

  deleteProductImage(i: any) {
    this.filePathEvent.emit("delete-" + i);
  }

  ngOnDestroy() {
    this.unsubscribeEvnets();
  }

  unsubscribeEvnets() {
    if (this.mediaCoverSubscription) {
      this.mediaCoverSubscription.unsubscribe();
    }

    if (this.mediaSaveSubscription) {
      this.mediaSaveSubscription.unsubscribe();
    }
  }

}
