// image-cropper.component.ts
import { Component, ViewChild, Input } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';


@Component({
    standalone: true,
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
    imports: [ImageCropperModule, IonicModule]
})
export class ImageCropperComponent {
    @ViewChild('cropper', { static: false }) cropper: any;
    @Input() imageUri: string = '';
    imageUrl: string = '';
    imageChangedEvent: any = '';
    croppedImage: any = '';
    myImage: any ;

    constructor(
        private sanitizer: DomSanitizer,
        private loadingController: LoadingController,
        private modalController: ModalController
    ) { console.log(this.imageUri, "asd")
        this.loading();
    }

    ngOnInit() {
        if (this.imageUri) {
            console.log('Image URI:', this.imageUri);
            this.myImage = this.imageUri
        }
    }
    
    async loading(){
        // const loading = await this.loadingController.create();
        // await loading.present();
    }

    fileChangeEvent(event: any): void {
        this.imageUrl = this.imageUri;
        console.log("fileChangeEvent", event);
    }
    imageCropped(event: any) {
        // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
        this.croppedImage = event.objectUrl ? this.sanitizer.bypassSecurityTrustUrl(event.objectUrl) : '';
        console.log("imageCropped", this.croppedImage);
        // event.blob can be used to upload the cropped image
    }
    imageLoaded() {
        // show cropper
        // image = Loaded..
        // this.loadingController.dismiss();
        console.log("imageLoaded");
    }
 
    loadImageFailed() {
        // show message
        console.log("loadImageFailed");
    }

    saveCroppedImage() {
        // this.croppedImage.changingThisBreaksApplicationSecurity
        console.log("saveCroppedImage", this.croppedImage.changingThisBreaksApplicationSecurity);
        this.modalController.dismiss(this.croppedImage.changingThisBreaksApplicationSecurity);

    }
}
