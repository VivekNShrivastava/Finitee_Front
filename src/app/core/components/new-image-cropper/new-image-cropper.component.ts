import { Component, OnInit, Input, ViewChildren,ViewChild, ElementRef, QueryList, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { IonSlides } from '@ionic/angular';
import { ThumbnailHelperService } from 'src/app/core/services/thumbnail-helper.service';
import { NavigationExtras, Router } from '@angular/router';
import { VideoCroppingArgs } from 'src/app/core/models/post/post';
import { VideoCropper }  from 'video-cropper-processor';

@Component({
  standalone: true,
  selector: 'app-new-image-cropper',
  templateUrl: './new-image-cropper.component.html',
  styleUrls: ['./new-image-cropper.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ImageCropperModule, IonicModule, FormsModule]
})
export class NewImageCropperComponent{
  @Input() imageUri: any[] = [];
  @ViewChild(IonSlides, { static: false }) slides!: IonSlides;

  currentIndex: number = 0;

  sliderHeight: number = 0;
  sliderHeightMin: number = 0;
  sliderHeightMax: number = 0;
  sliderOpts = {
    allowTouchMove: false
  };

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;
  @ViewChildren('mediaElement') currentMediaElements!: QueryList<ElementRef>;

  public onMediaCoverSelction: EventEmitter<any> = new EventEmitter<any>();
  dataUrlArray: string[] = [];
  naturalHeight:number[] = [];
  naturalWidth:number[] = [];
  areaAvailable: number[][] = [];
  initialScale: number[] = [];
  sliderScale: number[] = [];
  manualScale: number[] = [];
  initialBoundingClient: number[][] = [];
  cropArray: any[] = [];
  isResizing: boolean = false;
  isDragging: boolean[] = [false];
  startingY: number[] = [];
  initialHeight: number = 0;
  private startX: number[] = [];
  private startY: number[] = [];
  currentX: number[] = [];
  currentY: number[] = [];
  imagePositionX: number[] = [];
  imagePositionY: number[] = [];
  isVideoList: boolean[] = [false];
  isVideo: boolean = false;
  thumbnail: string = "";
  videoArgs: VideoCroppingArgs[] = [];
  navEx: NavigationExtras = {
    state: {
      data: null,
      extraParams: null
    }
  };



  constructor(private router: Router,  private thumbnailService: ThumbnailHelperService) {
    
   }


  ngOnInit() {
    if (this.imageUri) {
      console.log('Image URI:', this.imageUri);
    }
    this.sliderHeightMax = window.innerWidth * 1.29;
    this.sliderHeightMin = window.innerWidth * 0.509;
    this.sliderHeight = window.innerWidth * 1;

    this.thumbnailService.onMediaCoverSelction.subscribe((mediaObj: any) => {
      if (mediaObj != null) {
        this.thumbnail = mediaObj.cover;
        console.log("thumbnail", this.thumbnail)
        // this.attachmentService.saveMedia(mediaObj.filepath, "V", mediaObj.width, mediaObj.height, aspectRatio, mediaObj.cover);
      }
    });
  }

 
 

  resizeMediaToFit(media: HTMLVideoElement | HTMLImageElement){
        const imgElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
        this.sliderScale[this.currentIndex] = this.initialScale[this.currentIndex];
        this.manualScale[this.currentIndex] = this.sliderScale[this.currentIndex];
        imgElement.style.scale = `${this.initialScale[this.currentIndex]}`;
  }


  calculatePixelToScreen(media: HTMLImageElement | HTMLVideoElement){

    if(this.isVideo){
      this.isUserInteracting = true;
      this.seekValueList[this.currentIndex] = this.currentMediaElements.toArray()[this.currentIndex].nativeElement.currentTime;
    }

    
    this.currentIndex = this.imageUri.length - 1;

    // Check if the media is an image or a video
    if (media instanceof HTMLImageElement) {
      this.naturalHeight[this.currentIndex] = media.naturalHeight;
      this.naturalWidth[this.currentIndex] = media.naturalWidth;
      this.isVideoList[this.currentIndex] = false;
    } else if (media instanceof HTMLVideoElement) {
      this.naturalHeight[this.currentIndex] = media.videoHeight;
      this.naturalWidth[this.currentIndex] = media.videoWidth;
      this.isVideoList[this.currentIndex] = true;
      this.seekValueList[this.currentIndex] = 0;

      if(this.currentIndex == 0){
        this.createThumbnail();
      }
    }

    if(this.currentIndex!==0){
      this.currentMediaElements.toArray()[this.currentIndex-1].nativeElement.style.transform = `translate(${-this.areaAvailable[this.currentIndex-1][1]}px, ${this.imagePositionY[this.currentIndex-1]}px)`;
    }
    this.slideToIndex(this.currentIndex);

    
      this.initialBoundingClient[this.currentIndex] = [0,0];
      this.areaAvailable[this.currentIndex] = [0,0,0,0];
      this.imagePositionX[this.currentIndex] = 0;
      this.imagePositionY[this.currentIndex] = 0;
      if(this.currentIndex!==0){
      this.currentMediaElements.toArray()[this.currentIndex-1].nativeElement.style.zIndex = '1';
      }
      this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '2';


    this.initialBoundingClient[this.currentIndex][0]= this.currentMediaElements.toArray()[this.currentIndex].nativeElement.getBoundingClientRect().height;
    this.initialBoundingClient[this.currentIndex][1]= this.currentMediaElements.toArray()[this.currentIndex].nativeElement.getBoundingClientRect().width;

    if(this.naturalHeight[this.currentIndex]/this.naturalWidth[this.currentIndex]>=1){
      this.initialScale[this.currentIndex] = window.innerWidth/this.currentMediaElements.toArray()[this.currentIndex].nativeElement.offsetWidth
      const ToChange = this.sliderHeight/(this.initialScale[this.currentIndex]);
      let upBottom = (this.initialBoundingClient[this.currentIndex][0]-ToChange)/2;
      // let upBottom = (this.initialBoundingClient[0]-imageHeight)/2;
      // if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-naturalWidth)/2}
      this.areaAvailable[this.currentIndex][0] = upBottom;
      this.areaAvailable[this.currentIndex][2] = upBottom;

    
    }else if(this.naturalHeight[this.currentIndex]/this.naturalWidth[this.currentIndex]<1){
      this.initialScale[this.currentIndex] = window.innerWidth/this.currentMediaElements.toArray()[this.currentIndex].nativeElement.offsetHeight

      //rightLeft = ((this.initialBoundingClient[1]-window.innerWidth)*this.initialScale)/2
      let rightLeft = (this.initialBoundingClient[this.currentIndex][1]-(window.innerWidth/this.initialScale[this.currentIndex]))/2


      
      //doesn't get affected but check once
      //if(img.naturalHeight<window.innerHeight){rightLeft=(window.innerWidth-this.imageElement.nativeElement.getBoundingClientRect().height)/2}
      this.areaAvailable[this.currentIndex][1] = rightLeft;
      this.areaAvailable[this.currentIndex][3] = rightLeft;

    }
    
    this.resizeMediaToFit(media);

    if(this.sliderHeight !== window.innerWidth){
      this.sliderChangeHandle(this.sliderHeight - window.innerWidth, this.sliderHeight);
    }
    console.log("available area", this.areaAvailable);
  }

  //add this
  onTouchImageStart(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    if (event instanceof MouseEvent) {
      this.startX[this.currentIndex] = event.clientX;
      this.startY[this.currentIndex] = event.clientY;
    } 
    else if (event instanceof TouchEvent) {
      this.startX[this.currentIndex] = event.touches[0].clientX;
      this.startY[this.currentIndex] = event.touches[0].clientY;
    }
    this.isDragging[this.currentIndex] = true;
  }
  
  onTouchImageMove(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (!this.isDragging[this.currentIndex]) return; 
    if (event instanceof MouseEvent) {
      this.currentX[this.currentIndex] = event.clientX;
      this.currentY[this.currentIndex] = event.clientY;
    } 
    else if (event instanceof TouchEvent) {
      this.currentX[this.currentIndex] = event.touches[0].clientX;
      this.currentY[this.currentIndex] = event.touches[0].clientY;
    }
    

    const deltaX = this.currentX[this.currentIndex] - this.startX[this.currentIndex];
    const deltaY = this.currentY[this.currentIndex] - this.startY[this.currentIndex];


    // Store the new positions
    let newImagePositionX = this.imagePositionX[this.currentIndex] + deltaX;
    let newImagePositionY = this.imagePositionY[this.currentIndex] + deltaY;

    // Boundary checking for horizontal movement
    if (newImagePositionX < -this.areaAvailable[this.currentIndex][3]) {
      newImagePositionX = -this.areaAvailable[this.currentIndex][3];
    } else if (newImagePositionX > this.areaAvailable[this.currentIndex][1]) {
      newImagePositionX = this.areaAvailable[this.currentIndex][1];
    }

    // Boundary checking for vertical movement
    if (newImagePositionY < -this.areaAvailable[this.currentIndex][2]) {
      newImagePositionY = -this.areaAvailable[this.currentIndex][2];
    } else if (newImagePositionY > this.areaAvailable[this.currentIndex][0]) {
      newImagePositionY = this.areaAvailable[this.currentIndex][0];
    }

    // Apply the transform to move the image
    const imgElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    imgElement.style.transform = `translate(${newImagePositionX}px, ${newImagePositionY}px)`;

    // Update the positions for the next calculation
    this.imagePositionX[this.currentIndex] = newImagePositionX;
    this.imagePositionY[this.currentIndex] = newImagePositionY;
    
    console.log("deltaX",deltaX,"deltaY",deltaY,"newImagePositionX",this.imagePositionX[this.currentIndex],"newImagePositionY",this.imagePositionY[this.currentIndex])
    console.log("available area", this.areaAvailable);
    
  }
  
  onTouchImageEnd(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging[this.currentIndex]=false;
    //this.imagePositionX += this.currentX - this.startX;
    //this.imagePositionY += this.currentY - this.startY;
    console.log("when ends",this.imagePositionY[this.currentIndex])
  }
 
  // ngAfterViewInit() {
  //   const gesture = this.gestureCtrl.create({
  //     el: this.imageElement.nativeElement,
  //     gestureName: 'move-crop',
  //     onStart: (ev) => this.onGestureStart(ev),
  //     onMove: (ev) => this.onGestureMove(ev),
  //     onEnd: (ev) => this.onGestureEnd(ev),
  //   });
  //   gesture.enable();
  // }

  //need to do for >1, <1 and =1
  //also check for already zoomed images
  changeAvailableSpaceForZoomSlider(){

      this.areaAvailable[this.currentIndex][0] = ((this.manualScale[this.currentIndex]-this.initialScale[this.currentIndex])*this.initialBoundingClient[this.currentIndex][0])/(this.manualScale[this.currentIndex]*2);
      this.areaAvailable[this.currentIndex][2] = ((this.manualScale[this.currentIndex]-this.initialScale[this.currentIndex])*this.initialBoundingClient[this.currentIndex][0])/(this.manualScale[this.currentIndex]*2);
      this.areaAvailable[this.currentIndex][1] = ((this.manualScale[this.currentIndex]-this.initialScale[this.currentIndex])*this.initialBoundingClient[this.currentIndex][1])/(this.manualScale[this.currentIndex]*2);
      this.areaAvailable[this.currentIndex][3] = ((this.manualScale[this.currentIndex]-this.initialScale[this.currentIndex])*this.initialBoundingClient[this.currentIndex][1])/(this.manualScale[this.currentIndex]*2);
  }



  changeAvailableSpace(index : number){
  
    if(this.naturalHeight[index]/this.naturalWidth[index]>=1){
      const ToChange = this.sliderHeight/(this.manualScale[index]);
      let upBottom = (this.initialBoundingClient[index][0]-ToChange)/2;
      console.log("availablespace", this.areaAvailable[index][0]);
      // console.log(this.initialBoundingClient[0], this.initialBoundingClient[1],this.sliderHeight,window.innerWidth,this.manualScale);
      //if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-this.initialBoundingClient[1])/2}
      console.log("zoom change space", upBottom);
      this.areaAvailable[index][0] = Math.max(0, upBottom);
      this.areaAvailable[index][2] = Math.max(0, upBottom);
      this.areaAvailable[index][1] = ((this.manualScale[index]-this.initialScale[index])*this.initialBoundingClient[index][1])/(this.manualScale[index]*2);
      this.areaAvailable[index][3] = ((this.manualScale[index]-this.initialScale[index])*this.initialBoundingClient[index][1])/(this.manualScale[index]*2);

    }
    else if(this.naturalHeight[index]/this.naturalWidth[index]<1){
      // const ToChange = window.innerWidth/(this.manualScale[index]);
      // let rightLeft2 = (window.innerWidth-ToChange)/2;
      let rightLeft = (this.initialBoundingClient[index][1] - (window.innerWidth/this.manualScale[index]))/2
      // let rightLeft3 = (this.initialBoundingClient[this.currentIndex][1] - (this.initialBoundingClient[this.currentIndex][0]/this.manualScale[this.currentIndex]))/2

      // if(this.isVideo){
      //   rightLeft = (this.initialBoundingClient[1]-(window.innerWidth/this.manualScale))/2
      // }
      console.log("zoom change space", rightLeft);
      this.areaAvailable[index][1] = Math.max(0 , rightLeft);
      this.areaAvailable[index][3] = Math.max(0 , rightLeft);

      const ToChange2 = this.sliderHeight/(this.manualScale[index]);
      let upBottom = (this.initialBoundingClient[index][0]-ToChange2)/2;   

      this.areaAvailable[index][0] = Math.max(0, upBottom);
      this.areaAvailable[index][2] = Math.max(0, upBottom);
      // this.areaAvailable[0] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);  //solve this too
      // this.areaAvailable[2] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);

      console.log(upBottom,"upbottom") 
    }
    console.log(this.sliderHeight,this.areaAvailable);
  }

  adjustOnSliderZoomOut(index: number){
    if(this.imagePositionX[index]<0 && (this.areaAvailable[index][1] + this.imagePositionX[index]) < 10){
      this.imagePositionX[index] = -this.areaAvailable[index][1];
    }
    else if(this.imagePositionX[index]>0 && (this.areaAvailable[index][1] - this.imagePositionX[index]) < 10){
      this.imagePositionX[index] = this.areaAvailable[index][1];
    }
        
    const imgElement = this.currentMediaElements.toArray()[index].nativeElement;
    imgElement.style.transition = `transform 0s` 
    imgElement.style.transform = `translate(${this.imagePositionX[index]}px, ${this.imagePositionY[index]}px)`;
    setTimeout(() => {
      imgElement.style.transition = `transform 0.1s ease`;
  }, 0);  }

  adjustOnZoomOut(){
    
    if(this.imagePositionX[this.currentIndex]<0 && (this.areaAvailable[this.currentIndex][1] + this.imagePositionX[this.currentIndex]) < 10){
      this.imagePositionX[this.currentIndex] = -this.areaAvailable[this.currentIndex][1];
    }
    else if(this.imagePositionX[this.currentIndex]>0 && (this.areaAvailable[this.currentIndex][1] - this.imagePositionX[this.currentIndex]) < 10){
      this.imagePositionX[this.currentIndex] = this.areaAvailable[this.currentIndex][1];
    }

    if(this.imagePositionY[this.currentIndex]<0 && (this.areaAvailable[this.currentIndex][0] + this.imagePositionY[this.currentIndex]) < 10){
      this.imagePositionY[this.currentIndex] = -this.areaAvailable[this.currentIndex][0];
    }
    else if(this.imagePositionY[this.currentIndex]>0 && (this.areaAvailable[this.currentIndex][0] - this.imagePositionY[this.currentIndex]) < 10){
      this.imagePositionY[this.currentIndex] = this.areaAvailable[this.currentIndex][0];
    }

    
    const imgElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    imgElement.style.transition = `transform 0s` 
    imgElement.style.transform = `translate(${this.imagePositionX[this.currentIndex]}px, ${this.imagePositionY[this.currentIndex]}px)`;
    setTimeout(() => {
      imgElement.style.transition = `transform 0.1s ease`;
  }, 0);
  }


  OnZoom(type:boolean){
    if(type){
      if(this.manualScale[this.currentIndex]>=10){
        return;
      }
      this.manualScale[this.currentIndex] += 0.1;
    }else{
      if(this.sliderScale[this.currentIndex]<this.manualScale[this.currentIndex]){
        if(this.initialBoundingClient[this.currentIndex][0]*(this.manualScale[this.currentIndex]-0.1)>=this.sliderHeight){
            this.manualScale[this.currentIndex] -= 0.1; 
            // console.log(this.manualScale, this.sliderScale)
            if(this.manualScale[this.currentIndex]<this.sliderScale[this.currentIndex]){
              this.manualScale[this.currentIndex] = this.sliderScale[this.currentIndex];
            }
        }else{
          let toScale = this.sliderHeight/(this.initialBoundingClient[this.currentIndex][0]);
          this.sliderScale[this.currentIndex] = toScale; 
          this.manualScale[this.currentIndex] = toScale;
        }
      }
    }
    const imgElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    imgElement.style.scale = this.manualScale[this.currentIndex];
    this.changeAvailableSpace(this.currentIndex);
    if(!type){ this.adjustOnZoomOut()}
  }


  onMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault(); // Prevent default behavior (e.g., scrolling) on touch devices
  
    // Distinguish between mouse and touch events
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
  
    this.isResizing = true;
    this.startingY[this.currentIndex] = clientY;
    this.initialHeight = this.sliderHeight;
  
    // Add event listeners for both mouse and touch
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onMouseUp.bind(this)); // Reuse onMouseUp for touchend
  }
  
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    let dy = event.clientY - this.startingY[this.currentIndex];
    this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transition = `transform 0s` 
    let oldSliderHeight = this.sliderHeight;
    const intermediateHeight = Math.min(this.sliderHeightMax, Math.max(this.sliderHeightMin, this.initialHeight + dy));
    if(intermediateHeight-oldSliderHeight!=0){
      
      this.sliderChangeHandle(intermediateHeight-oldSliderHeight, intermediateHeight);
    }
    this.sliderHeight = intermediateHeight
    setTimeout(() => {
      this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transition = `transform 0.1s ease`;
  }, 0);  
  }
  
  onTouchMove(event: TouchEvent) {
    if (!this.isResizing) return;
    const dy = event.touches[0].clientY - this.startingY[this.currentIndex];
    // let oldSliderHeight = this.sliderHeight;
    const intermediateHeight = Math.min(this.sliderHeightMax, Math.max(this.sliderHeightMin, this.initialHeight + dy));
    if(intermediateHeight-this.sliderHeight!=0){
      this.sliderChangeHandle(intermediateHeight-this.sliderHeight, intermediateHeight);
    }
    this.sliderHeight = intermediateHeight

  }
  
  onMouseUp() {
    this.isResizing = false;
  
    // Remove mouse event listeners
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  
    // Remove touch event listeners
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onMouseUp.bind(this));
  }
  

  sliderChangeHandle(dy: number, intermediateHeight:number){
    console.log("dy",dy);

    for(let i=0; i<this.imageUri.length; i++){
      const imgElement = this.currentMediaElements.toArray()[i].nativeElement;
      let newImagePositionY = 0;
  
  
      if((this.initialBoundingClient[this.currentIndex][0]*this.manualScale[this.currentIndex]<intermediateHeight && dy>0) ||
      (this.initialBoundingClient[this.currentIndex][0]*this.initialScale[this.currentIndex]<intermediateHeight && dy<0)){
        let toScale = intermediateHeight/(this.initialBoundingClient[i][0]);
        console.log(toScale, this.initialScale, "scale compare");
        if(toScale>=this.initialScale[i]){
          // if(dy<1){this.adjustOnSliderZoomOut(i)}
          this.sliderScale[i] = toScale;
          imgElement.style.scale = this.sliderScale[i];
          this.manualScale[i] =this.sliderScale[i];
          this.changeAvailableSpace(i);
          if(dy<1){this.adjustOnSliderZoomOut(i)}
          //here i had to make them zero as the above function needs the value of sliderheight to be updated first which cant be done
          this.areaAvailable[i][0]=0;
          this.areaAvailable[i][2]=0;
          if(i<this.currentIndex){
            this.currentMediaElements.toArray()[i].nativeElement.style.transform = `translate(${-this.areaAvailable[i][1]}px, ${this.imagePositionY[i]}px)`;
          }
          else if(i>this.currentIndex){
            this.currentMediaElements.toArray()[i].nativeElement.style.transform = `translate(${this.areaAvailable[i][1]}px, ${this.imagePositionY[i]}px)`;
          }
          continue;
        }
      }
      // else if(this.initialBoundingClient[this.currentIndex][0]*this.manualScale[this.currentIndex]<intermediateHeight){

      // }
      
      //this.areaAvailable[0] = Math.max(0,this.areaAvailable[0]-(dy/(2*this.manualScale)));
      //this.areaAvailable[2] = Math.max(0,this.areaAvailable[2]-(dy/(2*this.manualScale)));
      this.changeAvailableSpace(i);
  
      if(this.imagePositionY[i]<0 && Math.abs(this.imagePositionY[i])>=this.areaAvailable[i][2]){
          newImagePositionY = this.imagePositionY[i] + dy;
          if(Math.abs(newImagePositionY) > this.areaAvailable[i][2] ){
            if(newImagePositionY<0){newImagePositionY = -this.areaAvailable[i][2]}
            else{newImagePositionY = this.areaAvailable[i][2]}
          }
          imgElement.style.transform = `translate(${this.imagePositionX[i]}px, ${newImagePositionY}px)`;
          this.imagePositionY[i] = newImagePositionY;  
      }
      else if(this.imagePositionY[i]>0 && Math.abs(this.imagePositionY[i])>=this.areaAvailable[i][0]){
        newImagePositionY = this.imagePositionY[i] - dy;
        if(Math.abs(newImagePositionY) > this.areaAvailable[i][2] ){
          if(newImagePositionY<0){newImagePositionY = -this.areaAvailable[i][2]}
          else{newImagePositionY = this.areaAvailable[i][2]}
        }
        imgElement.style.transform = `translate(${this.imagePositionX[i]}px, ${newImagePositionY}px)`;
        this.imagePositionY[i] = newImagePositionY;  
      }
  
    }
   
    //console.log("imagePosition",this.imagePositionY[this.currentIndex],dy, this.areaAvailable);


    //this.imagePositionY = newImagePositionY;
    // const imgElement = this.imageElement.nativeElement;
    // imgElement.style.transform = `translate(0px, ${this.imagePositionY}px)`;  

  }


//video controls

isPlaying: boolean = false;
isMuted: boolean = false;
seekValue: number = 0;
seekValueList: number[] = [];
intervalId: any = null;
isUserInteracting: boolean= true;


togglePlayPause() {
  
  if (this.currentMediaElements.toArray()[this.currentIndex].nativeElement.paused) {
    this.currentMediaElements.toArray()[this.currentIndex].nativeElement.play();
    this.isPlaying = true;
    this.intervalId = setInterval(() => {
      this.updateSeekValue();
    }, 200);
  } else {
    this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
    this.isPlaying = false;
    this.isUserInteracting = true;

  }
}

toggleMute() {
  const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
  this.isMuted = !this.isMuted;
  video.muted = this.isMuted;
}


seekVideo(event: any) {
  if(this.isUserInteracting){
    const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
    const seekTime = (event.detail.value / 100) * video.duration;
    video.currentTime = seekTime;
    if(event.detail.value == 100){this.isPlaying = false;} 
  }
  this.isUserInteracting=true;
}

ChangeSeekValueOnSlide(){
  const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
  video.muted = this.isMuted;
  video.currentTime = this.seekValueList[this.currentIndex];
      const seekProgress = (this.seekValueList[this.currentIndex] / video.duration) * 100;
      if(seekProgress == 100){this.isPlaying = false;} 
      this.seekValue = seekProgress;
}

updateSeekValue() {
  if(this.isPlaying){
    this.isUserInteracting = false;
  
    const video: HTMLVideoElement = this.currentMediaElements.toArray()[this.currentIndex].nativeElement;
      const seekProgress = (video.currentTime / video.duration) * 100;
      if(seekProgress == 100){this.isPlaying = false;} 
    
    // Update the seekValue
    this.seekValue = seekProgress;
  }else{
    this.isUserInteracting = true;
  }

}



  // sliding

  
  slideToIndex(index: number) {
    if (this.slides && index >= 0 && index < this.imageUri.length) {
      this.slides.slideTo(index, 500);
      this.isVideo = this.isVideoList[this.currentIndex];
      if(this.isVideo){
        this.ChangeSeekValueOnSlide();
      }
    } else {
      console.error('Index out of range');
    }
  }


  back(){
      if(this.currentIndex !== 0){

        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.areaAvailable[this.currentIndex][1]}px, ${this.imagePositionY[this.currentIndex]}px)`;
        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '1';
        if(this.isVideoList[this.currentIndex]){
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
          this.isPlaying = false;
          this.isUserInteracting = true;
          this.seekValueList[this.currentIndex] = this.currentMediaElements.toArray()[this.currentIndex].nativeElement.currentTime;
        }
        this.currentIndex = this.currentIndex - 1;
          this.changeAvailableSpace(this.currentIndex);
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '2';
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.imagePositionX[this.currentIndex]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          this.slideToIndex(this.currentIndex);

      }
  } 

  front(){
      if(this.currentIndex !== this.imageUri.length - 1){
        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${-this.areaAvailable[this.currentIndex][3]}px, ${this.imagePositionY[this.currentIndex]}px)`;
        this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '1';  
        if(this.isVideoList[this.currentIndex]){
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.pause();
          this.isPlaying = false;
          this.isUserInteracting = true;
          this.seekValueList[this.currentIndex] = this.currentMediaElements.toArray()[this.currentIndex].nativeElement.currentTime;
        }
        this.currentIndex = this.currentIndex + 1;
          this.changeAvailableSpace(this.currentIndex);
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.zIndex = '2';
          this.currentMediaElements.toArray()[this.currentIndex].nativeElement.style.transform = `translate(${this.imagePositionX[this.currentIndex]}px, ${this.imagePositionY[this.currentIndex]}px)`;
          this.slideToIndex(this.currentIndex)
      }
  }

  //cropping processing
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;


  async MainCroppingFunction(){
    let i = 0;
    for (const flag of this.isVideoList) {
      if (flag) {
        await this.cropVideo(i);
        this.dataUrlArray[i] = this.imageUri[i].filePath;
      } else {
        await this.cropAndUploadImage(i);
      }
      i++;
    }
    this.callCroppingFunction(this.dataUrlArray, this.isVideoList, this.sliderHeight);

  }

  async cropAndUploadImage(index: number){
    const image = this.currentMediaElements.toArray()[index].nativeElement;

    // Create a canvas without adding it to the DOM
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = this.sliderHeight;
 

    const TheBoundingScale = this.naturalHeight[index]/this.initialBoundingClient[index][0]

    let imageStartWidth = (-this.imagePositionX[index]+this.areaAvailable[index][1])*TheBoundingScale;
    let imageStartHeight = (-this.imagePositionY[index]+this.areaAvailable[index][0])*TheBoundingScale;

    let widthOfCroppedArea = (this.initialBoundingClient[index][1]- (2 * this.areaAvailable[index][1]))*TheBoundingScale;
    let heightOfCroppedArea = (this.initialBoundingClient[index][0]- (2 * this.areaAvailable[index][0]))*TheBoundingScale;

    // Draw cropped frame on canvas
    ctx!.drawImage(
      image,
      imageStartWidth, imageStartHeight,
      widthOfCroppedArea, heightOfCroppedArea, //4. The width of the cropped area in the video
      0, 0,
      window.innerWidth, this.sliderHeight,  // 8. The width of the image on the canvas
    );

    let croppedImage = canvas.toDataURL('image/png');
    this.dataUrlArray[index] = croppedImage;


  }

  callCroppingFunction(mediaUrlDataArray: string[], isVideoList: boolean[], sliderHeight: number){
    let previewComponentData = {
      "mediaUrlDataArray": mediaUrlDataArray,
      "isVideoList": isVideoList,
      "sliderHeight": sliderHeight,
      "manualScale": this.manualScale,
      "imagePositionX": this.imagePositionX,
      "imagePositionY": this.imagePositionY,
      "areaAvailable": this.areaAvailable,
      "videoArgs": this.videoArgs,
      "thumbnail": this.thumbnail
    }

    this.navEx!.state!['data'] = previewComponentData;
    // console.log("refer-->", this.navEx!.state!['data'])
    this.router.navigateByUrl('post/preview-post-test', this.navEx);
  }

  async cropVideo(index: number) {    

    const TheBoundingScale = this.naturalHeight[index]/this.initialBoundingClient[index][0]

    let x = (-this.imagePositionX[index]+this.areaAvailable[index][1])*TheBoundingScale;
    let y = (-this.imagePositionY[index]+this.areaAvailable[index][0])*TheBoundingScale;

    let width = (this.initialBoundingClient[index][1]- (2 * this.areaAvailable[index][1]))*TheBoundingScale;
    let height = (this.initialBoundingClient[index][0]- (2 * this.areaAvailable[index][0]))*TheBoundingScale;

    this.videoArgs[index] = {
      x: x,
      y: y,
      height: height,
      width: width
    } 

    // this.createThumbnail();
    console.log(await VideoCropper.getContacts('anyways'));

  }


  createThumbnail(){
    this.navEx!.state!['data'] = this.imageUri[0].filePath;
    this.router.navigateByUrl('video-cover-selection', this.navEx);
  }
  // //thumbnail
  // this.navEx!.state!['data'] = this.canvasProfile;
  //     console.log("refer-->", this.navEx!.state!['data'])
  //     this.router.navigateByUrl('recommend-user', this.navEx);

 

}
