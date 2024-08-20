// image-cropper.component.ts
import { Component, ViewChild, Input, ElementRef, HostListener, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { ImageCropperModule, ImageTransform, LoadedImage } from 'ngx-image-cropper';
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
    @ViewChild(IonSlides, { static: false }) slides!: IonSlides;
    

    imageUrl: string = '';
    imageChangedEvent: any = '';
    croppedImage: any = '';
    myImage: any;
    aspectRatio: number = 0.509;

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
        allowTouchMove: false
       
    }

    transform: ImageTransform = {
        scale: 1,
        rotate: 0,
        translateH: 0,
        translateV: 0,
        translateUnit: 'px'
    };

    staticCropperWidth = window.innerWidth;

    croppedImagesList : any = [];

    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;
    @ViewChild('cropArea', { static: false }) cropArea!: ElementRef;
    newImageElement: HTMLImageElement | null = null; 

    private scale = 1;
    private position = { x: 0, y: 0 };
    private start = { x: 0, y: 0 };
    private panning = false;

    currentIndex: number = 0;

    public croppedImageMap: Map<number, any> = new Map();
    @Output() croppedImageMapChange = new EventEmitter<Map<number, any>>();

    initialImageAspectRatio: number = 0;

    isArLocked: boolean = false;

    @Output() isAr_Locked = new EventEmitter<boolean>;


    constructor(
        private sanitizer: DomSanitizer,
        private loadingController: LoadingController,
        private modalController: ModalController,
    ) {}


    ngOnInit() {
        if (this.imageUri) {
            console.log('Image URI:', this.imageUri);
            this.myImage = this.imageUri
        }
    }

    dismiss() {
        this.modalController.dismiss();
    }

    lockAr(){
        if(this.isArLocked) this.isArLocked = false;
        else this.isArLocked = true;
        this.isAr_Locked.emit(this.isArLocked);
    }

    back(){
        if(this.currentIndex !== 0){
            this.currentIndex = this.currentIndex - 1;
            this.slideToIndex(this.currentIndex);
        }
    } 

    front(){
        if(this.currentIndex !== this.myImage.length - 1){
            this.currentIndex = this.currentIndex + 1;
            this.slideToIndex(this.currentIndex)
        }
    }

    maintainAspectRatio(){
        if(!this.isArLocked) return false;
        else return true;
    }

    aspect_Ratio(image: any){

        if(this.isArLocked){
            // console.log("Locked", this.initialImageAspectRatio);
            return this.initialImageAspectRatio;
        }else{
            // console.log("Initial AR");
            return 0;
        }
        
        // if(image.width < image.height){
        //     const res = 1.29;
        //     return res;
        // } 
        // else {
        //     const res = 1.29;
        //     return res;
        // }
    }

    maxHeightCropper(image?: any){
        // console.log("maxHeightCropper", image)
        if(image.width < image.height){
            const res = image.width * 1.29;
            // console.log(res);
            return res;
        } 
        return image.height;
    }

    maxWidthCropper(image?: any){
        // console.log("maxWidthCropper", image)
        if(image.width > image.height){
            const res = image.height / 0.509;
            // console.log(res);
            return res;
        }
        return image.width;
    }

    minWidthCropper(image:any, minWidth?: number){
        if(minWidth){
            return minWidth;
        }
        else return image.height / 1.29;
    }

    minHeightCropper(image:any, minHeight?: number){
        if(minHeight) return minHeight;
        else return image.width * 0.509;
    }

    slideToIndex(index: number) {
        if (this.slides && index >= 0 && index < this.imageUri.length) {
          this.slides.slideTo(index, 500);
        } else {
          console.error('Index out of range');
        }
    }

    async slideChanged() {
        this.currentIndex = await this.slides.getActiveIndex();
        console.log('Current slide index:', this.currentIndex);
    }

    fileChangeEvent(event: any): void {
        // this.imageUrl = this.imageUri;
        // console.log("fileChangeEvent", event);
    }

    startCropImage(){
        // console.log('startCropImage')
    }

    imageCropped(event: any) {
        // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
        this.croppedImage = event.objectUrl ? this.sanitizer.bypassSecurityTrustUrl(event.objectUrl) : '';
        console.log("imageCropped", event);
        
        if(!this.isArLocked){
            const minWidth = event.height / 1.29;
            const minHeight = event.width * 0.509;
            this.minHeightCropper(event, minHeight)
            this.minWidthCropper(event, minWidth)
            this.initialImageAspectRatio = event.width/event.height;

        }
        
        this.newBlobFunction(event.base64, event.height, event.width)
    }

    cropperReady(event: any){
        // console.log("cropperReady", event)
    }

    imageLoaded(image: LoadedImage) {
        // console.log("imageLoaded", image);
        this.slideToIndex(this.myImage.length - 1)
        console.log('image', this.myImage);
        
        if(this.currentIndex < this.myImage.length - 1) this.currentIndex = this.myImage.length - 1;
        this.croppedImageMap.set(this.currentIndex, this.myImage[this.currentIndex]);
        
        console.log('Current imageUri Map:', Array.from(this.croppedImageMap.entries()));
        
        this.croppedImageMapChange.emit(this.croppedImageMap);
    }

    loadImageFailed() {
        // show message
        // console.log("loadImageFailed");
    }

    saveCroppedImage() {
        // this.croppedImage.changingThisBreaksApplicationSecurity
        // console.log("saveCroppedImage", this.croppedImage.changingThisBreaksApplicationSecurity);
        this.modalController.dismiss(this.croppedImage.changingThisBreaksApplicationSecurity);
    }

    async newBlobFunction(filepath: any, height: number, width: number){
        const response = await fetch(filepath);
        let fileBlob = await response.blob();

        let temp_list;

        const croppedImageObj = {
            aspectRatio : width/height,
            blob: fileBlob,
            filePath: filepath,
            height: height,
            width: width,
            index: this.currentIndex
        }

        temp_list = this.croppedImageMap.get(this.currentIndex)
        if (!temp_list) {
            this.croppedImageMap.set(this.currentIndex, this.myImage[this.currentIndex]);
            // console.log('New entry added:', this.croppedImageMap.get(this.currentIndex));
            temp_list = this.croppedImageMap.get(this.currentIndex);
        }
    
        // Update the entry with the new cropped image object
        temp_list = {
            ...temp_list,
            ...croppedImageObj
        };
    
        // Set the updated entry back in the map
        this.croppedImageMap.set(this.currentIndex, temp_list);
        // console.log('Entry updated:', this.croppedImageMap.get(this.currentIndex));
        
        this.croppedImageMapChange.emit(this.croppedImageMap);
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
}
