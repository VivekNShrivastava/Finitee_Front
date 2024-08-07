// image-cropper.component.ts
import { Component, ViewChild, Input, ElementRef, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageCropperModule, ImageTransform } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
    imports: [ImageCropperModule, IonicModule, CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageCropperComponent {
    @ViewChild('cropper', { static: false }) cropper: any;
    @Input() imageUri: any[] = [];
    // @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
    @ViewChild(IonSlides, { static: false }) slides!: IonSlides;

    imageUrl: string = '';
    imageChangedEvent: any = '';
    croppedImage: any = '';
    myImage: any;
    aspectRatio: number = 1 / 1;

    cropArea_topLeft_X: number = 0;
    cropArea_topLeft_Y: number = 0;
    cropArea_topRight_X: number = 0;
    cropArea_topRight_Y: number = 0;

    cropArea_bottomLeft_X: number = 0;
    cropArea_bottomLeft_Y: number = 0;
    cropArea_bottomRight_X: number = 0;
    cropArea_bottomRight_Y: number = 0;

    image_topLeft_X: number = 0;
    image_topLeft_Y: number = 0;
    image_topRight_X: number = 0;
    image_topRight_Y: number = 0;

    image_bottomLeft_X: number = 0;
    image_bottomLeft_Y: number = 0;
    image_bottomRight_X: number = 0;
    image_bottomRight_Y: number = 0;

    sliderOpts = {
        allowTouchMove: true
       
    }

    transform: ImageTransform = {
        scale: 1,
        rotate: 0,
        translateH: 0,
        translateV: 0,
        translateUnit: 'px'
    };

    staticCropperWidth = window.innerWidth;

    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;
    @ViewChild('cropArea', { static: false }) cropArea!: ElementRef;
    newImageElement: HTMLImageElement | null = null; 

    private scale = 1;
    private position = { x: 0, y: 0 };
    private start = { x: 0, y: 0 };
    private panning = false;

    constructor(
        private sanitizer: DomSanitizer,
        private loadingController: LoadingController,
        private modalController: ModalController,
    ) { }


    ngOnInit() {
        if (this.imageUri) {
            console.log('Image URI:', this.imageUri);
            this.myImage = this.imageUri
        }
    }


    showImage(){
        if (this.imageElement) {
            // Wait for Angular to complete the initial rendering
            setTimeout(() => {
              // Ensure imageElement is available
              const imageCropperElement = this.imageElement.nativeElement;
              
              if (imageCropperElement) {
                // Find the internal img element
                const imgElement = imageCropperElement.querySelector('div img') as HTMLImageElement;
                
                if (imgElement) {
                  console.log('Image Element:', imgElement);
                  // Perform operations on imgElement here
                  this.newImageElement = imgElement;
                } else {
                  console.error('img element not found inside image-cropper');
                }
              } else {
                console.error('imageElement is not defined');
              }
            }, 0); // Use 0 to run after the current execution stack
        } else {
            console.error('imageElement is not defined');
        }
    }
      

    private logEdges() {
        // Get bounding rectangles
        const cropAreaRect = this.cropArea.nativeElement.getBoundingClientRect();
        const imageRect = this.newImageElement?.getBoundingClientRect();
        // const imageRect = this.imageCropper;
        

        if(imageRect){

            console.log('Crop Area Coordinates:');
            console.log(`Top-left: (${cropAreaRect.left}, ${cropAreaRect.top})`);
            console.log(`Top-right: (${cropAreaRect.right}, ${cropAreaRect.top})`);
            console.log(`Bottom-left: (${cropAreaRect.left}, ${cropAreaRect.bottom})`);
            console.log(`Bottom-right: (${cropAreaRect.right}, ${cropAreaRect.bottom})`);

            console.log('Image Coordinates:');
            console.log(`Top-left: (${imageRect?.left}, ${imageRect.top})`);
            console.log(`Top-right: (${imageRect?.right}, ${imageRect.top})`);
            console.log(`Bottom-left: (${imageRect?.left}, ${imageRect.bottom})`);
            console.log(`Bottom-right: (${imageRect?.right}, ${imageRect.bottom})`);

            this.cropArea_topLeft_X = cropAreaRect.left;
            this.cropArea_topLeft_Y = cropAreaRect.top;
            this.cropArea_topRight_X = cropAreaRect.right;
            this.cropArea_topRight_Y = cropAreaRect.top;

            this.cropArea_bottomLeft_X = cropAreaRect.left;
            this.cropArea_bottomLeft_Y = cropAreaRect.bottom;
            this.cropArea_bottomRight_X = cropAreaRect.right;
            this.cropArea_bottomRight_Y = cropAreaRect.bottom;

            this.image_topLeft_X = imageRect.left;
            this.image_topLeft_Y = imageRect.top;
            this.image_topRight_X = imageRect.right;
            this.image_topRight_Y = imageRect.top;

            this.image_bottomLeft_X = imageRect.left;
            this.image_bottomLeft_Y = imageRect.bottom;
            this.image_bottomRight_X = imageRect.right;
            this.image_bottomRight_Y = imageRect.bottom;
        }   
    }

    // @HostListener('wheel', ['$event'])
    // onWheel(event: WheelEvent) {
    //     console.log("onWheel");
    //     event.preventDefault();
    //     const scaleAmount = -event.deltaY * 0.001;
    //     const newScale = Math.min(Math.max(this.scale + scaleAmount, 1), 4);
    //     console.log('new scale', newScale);
    //     console.log('transform scale', this.transform.scale)
    //     this.transform.scale = newScale;
    //     this.scale = newScale;
    //     this.constrainPosition();
    //     this.updateTransform();
    //     this.logEdges();
    // }

    // @HostListener('mousedown', ['$event'])
    // onMouseDown(event: MouseEvent) {
    //     event.preventDefault();
    //     console.log("mousedown");
    //     this.start = { x: event.clientX - this.position.x, y: event.clientY - this.position.y };
    //     this.panning = true;
    //     if (this.newImageElement) {
    //         this.newImageElement.style.cursor = 'grabbing'; // Apply to newImageElement
    //     }  
    // }

    // @HostListener('mousemove', ['$event'])
    // onMouseMove(event: MouseEvent) {
    //     if (!this.panning) return;
    //     console.log("mousemove");
    //     event.preventDefault();
    //     this.position = { x: event.clientX - this.start.x, y: event.clientY - this.start.y };
    //     this.updateTransform();
    //     this.logEdges();
    // }

    // @HostListener('mouseup', ['$event'])
    // onMouseUp(event: MouseEvent) {
    //     this.panning = false;
    //     console.log("mouseup");
    //     if(this.newImageElement) this.newImageElement.style.cursor = 'grab';
    //     this.constrainPosition();
    //     this.updateTransform();
    //     this.logEdges();
    // }

    // @HostListener('mouseleave', ['$event'])
    // onMouseLeave(event: MouseEvent) {
    //     this.panning = false;
    //     console.log("mouseleave");
    //     if(this.newImageElement) this.newImageElement.style.cursor = 'grab';
    // }

    // private updateTransform() {
        
    //     if(this.newImageElement) this.newImageElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;

    //     // this.imageElement.nativeElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;
    // }

    // private constrainPosition() {
    //     if (this.scale === 1) {
    //         this.position.x = 0;
    //         this.position.y = 0;
    //         // this.transform.translateH = this.position.x;
    //         // this.transform.translateV = this.position.y;
    //     } else {
    //         if (this.image_topRight_X < this.cropArea_topRight_X) {
    //             const right_X_diff = this.cropArea_topRight_X - this.image_topRight_X;
    //             this.position.x += right_X_diff;
    //             // this.transform.translateH = this.position.x;
    //         }if (this.image_topLeft_X > this.cropArea_topLeft_X) {
    //             this.position.x = this.cropArea_topLeft_X;
    //             // this.transform.translateH = this.position.x;
    //         }if (this.image_topLeft_Y > this.cropArea_topLeft_Y) {
    //             const top_Y_diff = this.image_topLeft_Y - this.cropArea_topLeft_Y;
    //             this.position.y -= top_Y_diff;
    //             // this.transform.translateV = this.position.y;
    //         }if (this.image_bottomLeft_Y < this.cropArea_bottomLeft_Y) {
    //             const bottom_Y_diff = this.cropArea_bottomLeft_Y - this.image_bottomLeft_Y;
    //             this.position.y += bottom_Y_diff;
    //             // this.transform.translateV = this.position.y;
    //         }
    //     }
    // }

    dismiss() {
        this.modalController.dismiss();
    }


    fileChangeEvent(event: any): void {
        // this.imageUrl = this.imageUri;
        console.log("fileChangeEvent", event);
    }

    startCropImage(){
        console.log('startCropImage')
    }

    imageCropped(event: any) {
        // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
        this.croppedImage = event.objectUrl ? this.sanitizer.bypassSecurityTrustUrl(event.objectUrl) : '';
        console.log("imageCropped", event);
        // event.blob can be used to upload the cropped image   
    }

    cropperReady(event: any){
        console.log("cropperReady", event)
        // event.height = 400;
        // console.log(this.imageCropper)
    }

    imageLoaded() {
        // show cropper
        // image = Loaded..
        // this.loadingController.dismiss();
        console.log("imageLoaded");
        const img = new Image();
        img.src = this.myImage;
        img.onload = () => {
            const isLandscape = img.width > img.height;
            this.aspectRatio = isLandscape ? 1.29 / 1 : 1 / 1.29;
        };
        // this.showImage();
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
