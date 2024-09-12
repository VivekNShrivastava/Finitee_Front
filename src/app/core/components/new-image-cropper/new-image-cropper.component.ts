import { Component, OnInit, Input, ViewChildren,ViewChild, ElementRef, QueryList, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GestureController } from '@ionic/angular';

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
  sliderHeight: number = 0;
  sliderHeightMin: number = 0;
  sliderHeightMax: number = 0;
  sliderOpts = {
    allowTouchMove: false
  };

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLElement>;
  @ViewChild('mediaElement', { static: false }) currentMediaElement!: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  //up,right,bottom,left
  noZoomHeight: number = 0;
  naturalHeight = 0;
  naturalWidth = 0;
  areaAvailable: number[] = [0,0,0,0];
  k: number=0;
  initialScale: number = 1;
  sliderScale: number=1;
  manualScale: number = 1;
  initialBoundingClient: number[] = [0,0];
  initialSpaces : number = 0;
  cropArray: any[] = [];
  isResizing: boolean = false;
  isDragging: boolean = false;
  startingY: number = 0;
  initialHeight: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  currentX = 0;
  currentY = 0;
  imagePositionX = 0;
  imagePositionY = 0;
  isVideo: boolean = false;

  constructor() {}

  ngOnInit() {
    if (this.imageUri) {
      console.log('Image URI:', this.imageUri);
    }
    this.sliderHeightMax = window.innerWidth * 1.29;
    this.sliderHeightMin = window.innerWidth * 0.509;
    this.sliderHeight = window.innerWidth * 1;
  }

  resizeMediaToFit(media: HTMLVideoElement | HTMLImageElement){
        const imgElement = this.currentMediaElement.nativeElement;
        this.sliderScale = this.initialScale;
        this.manualScale = this.sliderScale;
        imgElement.style.scale = `${this.initialScale}`;
  }


  calculatePixelToScreen(media: HTMLImageElement | HTMLVideoElement){
 

    // Check if the media is an image or a video
    if (media instanceof HTMLImageElement) {
      this.naturalHeight = media.naturalHeight;
      this.naturalWidth = media.naturalWidth;
    } else if (media instanceof HTMLVideoElement) {
      this.naturalHeight = media.videoHeight;
      this.naturalWidth = media.videoWidth;
      this.isVideo = true;
    }

    this.initialBoundingClient[0]= this.currentMediaElement.nativeElement.getBoundingClientRect().height;
    this.initialBoundingClient[1]= this.currentMediaElement.nativeElement.getBoundingClientRect().width;

    if(this.naturalHeight/this.naturalWidth>=1){
      this.initialScale = window.innerWidth/this.currentMediaElement.nativeElement.offsetWidth
      const ToChange = this.sliderHeight/(this.initialScale);
      let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
      // let upBottom = (this.initialBoundingClient[0]-imageHeight)/2;
      // if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-naturalWidth)/2}
      this.areaAvailable[0] = upBottom;
      this.areaAvailable[2] = upBottom;
      this.initialSpaces = upBottom;
    
    }else if(this.naturalHeight/this.naturalWidth<1){
      this.initialScale = window.innerWidth/this.currentMediaElement.nativeElement.offsetHeight
      let rightLeft;
      if (media instanceof HTMLImageElement) {
        rightLeft = (window.innerWidth-this.initialBoundingClient[0])/2;
      }else{
        rightLeft = ((this.initialBoundingClient[1]-window.innerWidth)*this.initialScale)/2
      }

      
      //doesn't get affected but check once
      //if(img.naturalHeight<window.innerHeight){rightLeft=(window.innerWidth-this.imageElement.nativeElement.getBoundingClientRect().height)/2}
      this.areaAvailable[1] = rightLeft;
      this.areaAvailable[3] = rightLeft;
      this.initialSpaces = rightLeft;

    }
    this.resizeMediaToFit(media);
    console.log("available area", this.areaAvailable);
  }

  //add this
  onTouchImageStart(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } 
    else if (event instanceof TouchEvent) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }
    this.isDragging = true;
    console.log("startX",this.startX,"startY",this.startY)
  }
  
  onTouchImageMove(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (!this.isDragging) return; 
    if (event instanceof MouseEvent) {
      this.currentX = event.clientX;
      this.currentY = event.clientY;
    } 
    else if (event instanceof TouchEvent) {
      this.currentX = event.touches[0].clientX;
      this.currentY = event.touches[0].clientY;
    }
    

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;


    // Store the new positions
    let newImagePositionX = this.imagePositionX + deltaX;
    let newImagePositionY = this.imagePositionY + deltaY;

    // Boundary checking for horizontal movement
    if (newImagePositionX < -this.areaAvailable[3]) {
      newImagePositionX = -this.areaAvailable[3];
    } else if (newImagePositionX > this.areaAvailable[1]) {
      newImagePositionX = this.areaAvailable[1];
    }

    // Boundary checking for vertical movement
    if (newImagePositionY < -this.areaAvailable[2]) {
      newImagePositionY = -this.areaAvailable[2];
    } else if (newImagePositionY > this.areaAvailable[0]) {
      newImagePositionY = this.areaAvailable[0];
    }

    // Apply the transform to move the image
    const imgElement = this.currentMediaElement.nativeElement;
    imgElement.style.transform = `translate(${newImagePositionX}px, ${newImagePositionY}px)`;

    // Update the positions for the next calculation
    this.imagePositionX = newImagePositionX;
    this.imagePositionY = newImagePositionY;
    
    console.log("deltaX",deltaX,"deltaY",deltaY,"newImagePositionX",this.imagePositionX,"newImagePositionY",this.imagePositionY)
    console.log("available area", this.areaAvailable);
    
  }
  
  onTouchImageEnd(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging=false;
    //this.imagePositionX += this.currentX - this.startX;
    //this.imagePositionY += this.currentY - this.startY;
    console.log("when ends",this.imagePositionY)
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

      this.areaAvailable[0] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[2] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[1] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
      this.areaAvailable[3] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
  }

  changeAvailableSpaceForRest(){

    if(this.manualScale === this.sliderScale){
      this.areaAvailable[0] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[2] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[1] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
      this.areaAvailable[3] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
    }
    else if(this.manualScale === this.initialScale){
      if(this.naturalHeight/this.naturalWidth>1){
        const ToChange = this.sliderHeight/(this.initialScale);
        let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
        this.areaAvailable[0] = upBottom;
        this.areaAvailable[2] = upBottom;
        this.areaAvailable[1] = 0;
        this.areaAvailable[3] = 0;
      }else if(this.naturalHeight === this.naturalWidth){
        this.areaAvailable[0] = 0;
        this.areaAvailable[1] = 0;
        this.areaAvailable[2] = 0;
        this.areaAvailable[3] = 0;
      }else{
        let rightLeft = (window.innerWidth-this.initialBoundingClient[0])/2;
        this.areaAvailable[1] = rightLeft;
        this.areaAvailable[3] = rightLeft;
        this.areaAvailable[0] = 0;
        this.areaAvailable[2] = 0;
      }

    }else{
      this.areaAvailable[0] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[2] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);
      this.areaAvailable[1] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[1])/(this.manualScale*2);
      this.areaAvailable[3] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[1])/(this.manualScale*2);
    }
 }

  changeAvailableSpace(){
  
    if(this.naturalHeight/this.naturalWidth>=1){
      const ToChange = this.sliderHeight/(this.manualScale);
      let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
      console.log("availablespace", this.areaAvailable[0]);
      // console.log(this.initialBoundingClient[0], this.initialBoundingClient[1],this.sliderHeight,window.innerWidth,this.manualScale);
      //if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-this.initialBoundingClient[1])/2}
      console.log("zoom change space", upBottom);
      this.areaAvailable[0] = upBottom;
      this.areaAvailable[2] = upBottom;
      this.areaAvailable[1] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
      this.areaAvailable[3] = ((this.manualScale-this.initialScale)*this.initialBoundingClient[1])/(this.manualScale*2);
      console.log("calculations", this.initialSpaces, this.sliderHeight, this.currentMediaElement.nativeElement.getBoundingClientRect().height)

    }
    else if(this.naturalHeight/this.naturalWidth<1){
      const ToChange = this.initialBoundingClient[0]/(this.manualScale/this.initialScale);
      let rightLeft = (window.innerWidth-ToChange)/2;
      console.log("zoom change space", rightLeft);
      this.areaAvailable[1] = rightLeft;
      this.areaAvailable[3] = rightLeft;
      this.areaAvailable[0] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);  //solve this too
      this.areaAvailable[2] = ((this.manualScale-this.sliderScale)*this.initialBoundingClient[0])/(this.manualScale*2);
    }
    console.log(this.sliderHeight,this.areaAvailable);
  }

  adjustOnSliderZoomOut(){
    if(this.imagePositionX<0 && (this.areaAvailable[1] + this.imagePositionX) < 10){
      this.imagePositionX = -this.areaAvailable[1];
    }
    else if(this.imagePositionX>0 && (this.areaAvailable[1] - this.imagePositionX) < 10){
      this.imagePositionX = this.areaAvailable[1];
    }
        
    const imgElement = this.currentMediaElement.nativeElement;
    imgElement.style.transition = `transform 0s` 
    imgElement.style.transform = `translate(${this.imagePositionX}px, ${this.imagePositionY}px)`;
    setTimeout(() => {
      imgElement.style.transition = `transform 0.1s ease`;
  }, 0);  }

  adjustOnZoomOut(){
    
    if(this.imagePositionX<0 && (this.areaAvailable[1] + this.imagePositionX) < 10){
      this.imagePositionX = -this.areaAvailable[1];
    }
    else if(this.imagePositionX>0 && (this.areaAvailable[1] - this.imagePositionX) < 10){
      this.imagePositionX = this.areaAvailable[1];
    }

    if(this.imagePositionY<0 && (this.areaAvailable[0] + this.imagePositionY) < 10){
      this.imagePositionY = -this.areaAvailable[0];
    }
    else if(this.imagePositionY>0 && (this.areaAvailable[0] - this.imagePositionY) < 10){
      this.imagePositionY = this.areaAvailable[0];
    }

    
    const imgElement = this.currentMediaElement.nativeElement;
    imgElement.style.transition = `transform 0s` 
    imgElement.style.transform = `translate(${this.imagePositionX}px, ${this.imagePositionY}px)`;
    setTimeout(() => {
      imgElement.style.transition = `transform 0.1s ease`;
  }, 0);
  }


  OnZoom(type:boolean){
    if(type){
      if(this.manualScale>=5){
        return;
      }
      this.manualScale += 0.1;
    }else{
      // if(this.manualScale == this.sliderScale || this.areaAvailable[0]<=0 || this.areaAvailable[1]<=0){
      //   return;
      // }
      this.manualScale -= 0.1; 
      if(this.manualScale<this.sliderScale){
        this.manualScale = this.sliderScale;
      }
    }
    const imgElement = this.currentMediaElement.nativeElement;
    imgElement.style.scale = this.manualScale;
    this.changeAvailableSpace();
    if(!type){ this.adjustOnZoomOut()}
  }


  onMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault(); // Prevent default behavior (e.g., scrolling) on touch devices
  
    // Distinguish between mouse and touch events
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
  
    this.isResizing = true;
    this.startingY = clientY;
    this.initialHeight = this.sliderHeight;
  
    // Add event listeners for both mouse and touch
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onMouseUp.bind(this)); // Reuse onMouseUp for touchend
  }
  
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    let dy = event.clientY - this.startingY;
    this.currentMediaElement.nativeElement.style.transition = `transform 0s` 
    let oldSliderHeight = this.sliderHeight;
    const intermediateHeight = Math.min(this.sliderHeightMax, Math.max(this.sliderHeightMin, this.initialHeight + dy));
    if(intermediateHeight-oldSliderHeight!=0){
      
      this.sliderChangeHandle(intermediateHeight-oldSliderHeight, intermediateHeight);
    }
    this.sliderHeight = intermediateHeight
    setTimeout(() => {
      this.currentMediaElement.nativeElement.style.transition = `transform 0.1s ease`;
  }, 0);  
  }
  
  onTouchMove(event: TouchEvent) {
    if (!this.isResizing) return;
    const dy = event.touches[0].clientY - this.startingY;
    let oldSliderHeight = this.sliderHeight;
    const intermediateHeight = Math.min(this.sliderHeightMax, Math.max(this.sliderHeightMin, this.initialHeight + dy));
    if(intermediateHeight-oldSliderHeight!=0){
      this.sliderChangeHandle(intermediateHeight-oldSliderHeight, intermediateHeight);
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

    const imgElement = this.currentMediaElement.nativeElement;
    let newImagePositionY = 0;


    if(this.areaAvailable[0]==0){
      let toScale = intermediateHeight/(this.initialBoundingClient[0]);
      if(toScale>=this.initialScale){
        if(dy<1){this.adjustOnSliderZoomOut()}
        this.sliderScale = toScale;
        imgElement.style.scale = this.sliderScale;
        this.manualScale =this.sliderScale;
        this.changeAvailableSpace();
        return;
      }
    }
    
     this.areaAvailable[0] = Math.max(0,this.areaAvailable[0]-(dy/(2*this.manualScale)));
     this.areaAvailable[2] = Math.max(0,this.areaAvailable[2]-(dy/(2*this.manualScale)));
    //this.changeAvailableSpace();

    if(this.imagePositionY<0 && Math.abs(this.imagePositionY)>=this.areaAvailable[2]){
        newImagePositionY = this.imagePositionY + dy;
        if(Math.abs(newImagePositionY) > this.areaAvailable[2] ){
          if(newImagePositionY<0){newImagePositionY = -this.areaAvailable[2]}
          else{newImagePositionY = this.areaAvailable[2]}
        }
        imgElement.style.transform = `translate(0px, ${newImagePositionY}px)`;
        this.imagePositionY = newImagePositionY;  
    }
    else if(this.imagePositionY>0 && Math.abs(this.imagePositionY)>=this.areaAvailable[0]){
      newImagePositionY = this.imagePositionY - dy;
      if(Math.abs(newImagePositionY) > this.areaAvailable[2] ){
        if(newImagePositionY<0){newImagePositionY = -this.areaAvailable[2]}
        else{newImagePositionY = this.areaAvailable[2]}
      }
      imgElement.style.transform = `translate(0px, ${newImagePositionY}px)`;
      this.imagePositionY = newImagePositionY;  
    }

    console.log("imagePosition",this.imagePositionY,dy, this.areaAvailable);


    //this.imagePositionY = newImagePositionY;
    // const imgElement = this.imageElement.nativeElement;
    // imgElement.style.transform = `translate(0px, ${this.imagePositionY}px)`;  

  }


//video controls

isPlaying: boolean = false;
isMuted: boolean = false;
volumeValue: number = 1;
seekValue: number = 0;
intervalId: any = null;
isUserInteracting: boolean= true;


togglePlayPause() {
  
  if (this.currentMediaElement.nativeElement.paused) {
    this.currentMediaElement.nativeElement.play();
    this.isPlaying = true;
    this.intervalId = setInterval(() => {
      this.updateSeekValue();
    }, 200);
  } else {
    this.currentMediaElement.nativeElement.pause();
    this.isPlaying = false;
  }
}

toggleMute() {
  const video: HTMLVideoElement = this.currentMediaElement.nativeElement;
  this.isMuted = !this.isMuted;
  video.muted = this.isMuted;
}

changeVolume(event: any) {
  const video: HTMLVideoElement = this.currentMediaElement.nativeElement;
  video.volume = event.detail.value;
  this.volumeValue = video.volume;
}

seekVideo(event: any) {
  if(this.isUserInteracting){
    const video: HTMLVideoElement = this.currentMediaElement.nativeElement;
    const seekTime = (event.detail.value / 100) * video.duration;
    video.currentTime = seekTime;
  }
  this.isUserInteracting=true;
}

updateSeekValue() {
  this.isUserInteracting = false;
  
  const video: HTMLVideoElement = this.currentMediaElement.nativeElement;
    const seekProgress = (video.currentTime / video.duration) * 100;
  
  // Update the seekValue
  this.seekValue = seekProgress;
}
}
