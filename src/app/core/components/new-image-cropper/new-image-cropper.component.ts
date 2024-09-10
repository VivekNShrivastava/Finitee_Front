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
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

  //up,right,bottom,left
  noZoomHeight: number = 0;
  areaAvailable: number[] = [0,0,0,0];
  k: number=0;
  scale: number=1;
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

  constructor() {}

  ngOnInit() {
    if (this.imageUri) {
      console.log('Image URI:', this.imageUri);
    }
    this.sliderHeightMax = window.innerWidth * 1.29;
    this.sliderHeightMin = window.innerWidth * 0.509;
    this.sliderHeight = window.innerWidth * 1;
  }

  resizeMediaToFit(img: HTMLImageElement){

    if(img.naturalHeight/img.naturalWidth>1){
      const imageWidth = this.imageElement.nativeElement.offsetWidth; // Get the rendered width of the image on the screen
      if(imageWidth!=window.innerWidth){
        const imgElement = this.imageElement.nativeElement;
        this.scale = window.innerWidth/imageWidth; //precision issue
        this.manualScale = this.scale;
        imgElement.style.scale = `${window.innerWidth/imageWidth}`;
      }
    }
    else if(img.naturalHeight/img.naturalWidth<1){
      const imageHeight = this.imageElement.nativeElement.offsetHeight; // Get the rendered width of the image on the screen
      if(imageHeight!=window.innerWidth){
        const imgElement = this.imageElement.nativeElement;
        this.scale = window.innerWidth/imageHeight; //precision issue
        this.manualScale = this.scale;
        imgElement.style.scale = `${window.innerWidth/imageHeight}`;
      }
    }
    // console.log("natural",img.naturalHeight,"x", img.naturalWidth, "view", this.imageElement.nativeElement.offsetWidth, 
    //   "x", this.imageElement.nativeElement.offsetHeight, "also",  this.imageElement.nativeElement.getBoundingClientRect().width,
    //   "x",this.imageElement.nativeElement.getBoundingClientRect().height)

  }

  calculatePixelToScreen(img: HTMLImageElement){

    this.initialBoundingClient[0]= this.imageElement.nativeElement.getBoundingClientRect().height;
    this.initialBoundingClient[1]= this.imageElement.nativeElement.getBoundingClientRect().width;
    if(img.naturalHeight/img.naturalWidth>1){
      this.k = img.naturalWidth/window.innerWidth;
      console.log("ratio", this.k)
      const imageHeight = window.innerWidth;
      console.log("calculate height", imageHeight, "real height", this.imageElement.nativeElement.getBoundingClientRect().height)
      // const upBottom = (img.naturalHeight-imageHeight)/2;
      // this.areaAvailable[0] = upBottom / this.k;
      // this.areaAvailable[2] = upBottom / this.k;
      let upBottom = (this.imageElement.nativeElement.getBoundingClientRect().height-imageHeight)/2;
      if(img.naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-img.naturalWidth)/2}
      this.areaAvailable[0] = upBottom;
      this.areaAvailable[2] = upBottom;
      this.initialSpaces = upBottom;
    
    }else if(img.naturalHeight/img.naturalWidth<1){
      this.k = img.naturalHeight/window.innerWidth;
      console.log("ratio", this.k)
      const imageWidth = window.innerWidth;
      const multiply = img.naturalHeight/this.imageElement.nativeElement.getBoundingClientRect().height;
      console.log("check this shit out",window.innerWidth,"and",  this.imageElement.nativeElement.getBoundingClientRect().height);
      let rightLeft = ((img.naturalWidth)-imageWidth)/2;
      rightLeft = (window.innerWidth-this.imageElement.nativeElement.getBoundingClientRect().height)/2;
      //doesn't get affected but check once
      //if(img.naturalHeight<window.innerHeight){rightLeft=(window.innerWidth-this.imageElement.nativeElement.getBoundingClientRect().height)/2}
      this.areaAvailable[1] = rightLeft;
      this.areaAvailable[3] = rightLeft;
      this.initialSpaces = rightLeft;

    }
    this.resizeMediaToFit(img);
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
    const imgElement = this.imageElement.nativeElement;
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
    const naturalWidth = this.imageElement.nativeElement.naturalWidth;
    const naturalHeight = this.imageElement.nativeElement.naturalHeight;
    if(naturalHeight/naturalWidth>1){
    //   const ToChange = this.sliderHeight/(this.manualScale-this.scale+1);
    //   console.log(ToChange, "=", window.innerWidth,"/",this.manualScale,"-",this.scale,"+1");
      // let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
      //slider-window works for
      let upBottom = ((this.initialBoundingClient[0]-(this.sliderHeight-window.innerWidth))-this.initialBoundingClient[1])/2;
      console.log(this.initialBoundingClient[0], this.initialBoundingClient[1],this.sliderHeight,window.innerWidth,this.manualScale);
      if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-naturalWidth)/2}
      console.log("zoom change space", upBottom);
      this.areaAvailable[0] = upBottom;
      this.areaAvailable[2] = upBottom;
      this.areaAvailable[1] = upBottom - (this.initialBoundingClient[0]-this.sliderHeight)/2;
      this.areaAvailable[3] = upBottom - (this.initialBoundingClient[0]-this.sliderHeight)/2;
      console.log("calculations", this.initialSpaces, this.sliderHeight, this.imageElement.nativeElement.getBoundingClientRect().height)

    }
    else if(naturalHeight/naturalWidth<1){
      const ToChange = this.initialBoundingClient[0]/(this.manualScale/this.scale);
      let rightLeft = (window.innerWidth-ToChange)/2;
      console.log("zoom change space", rightLeft);
      this.areaAvailable[1] = rightLeft;
      this.areaAvailable[3] = rightLeft;
      this.areaAvailable[0] = rightLeft - this.initialSpaces;
      this.areaAvailable[2] = rightLeft - this.initialSpaces;
    }
  }

  changeAvailableSpace(type: boolean){
    const naturalWidth = this.imageElement.nativeElement.naturalWidth;
    const naturalHeight = this.imageElement.nativeElement.naturalHeight;
    if(naturalHeight/naturalWidth>1){
    //   const ToChange = this.sliderHeight/(this.manualScale-this.scale+1);
    //   console.log(ToChange, "=", window.innerWidth,"/",this.manualScale,"-",this.scale,"+1");
      // let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
      //slider-window works for
      let tryThis = ((this.initialBoundingClient[0]*(this.manualScale-this.scale+1)-this.sliderHeight)/2)-(window.innerWidth-this.initialBoundingClient[1]*(this.manualScale-this.scale+1))/2
      // let availableUpAndDown = (this.initialBoundingClient[0]-this.sliderHeight);
      // let init = (this.initialBoundingClient[0] - availableUpAndDown)*(this.manualScale-1-0.1)/2;
      // let  upBottom= availableUpAndDown/2 + init;

      const ToChange = this.sliderHeight/(this.manualScale-this.scale+1);
      let upBottom = (this.initialBoundingClient[0]-ToChange)/2;
      console.log("real calculations", tryThis, upBottom);
      console.log("availablespace", this.areaAvailable[0]);
      // console.log(this.initialBoundingClient[0], this.initialBoundingClient[1],this.sliderHeight,window.innerWidth,this.manualScale);
      if(naturalWidth<window.innerWidth){upBottom+=(window.innerWidth-naturalWidth)/2}
      console.log("zoom change space", upBottom);
      this.areaAvailable[0] = upBottom;
      this.areaAvailable[2] = upBottom;
      // this.areaAvailable[1] = upBottom - (this.initialBoundingClient[0]-window.innerWidth)/2;
      // this.areaAvailable[3] = upBottom - (this.initialBoundingClient[0]-window.innerWidth)/2;  //solve this
      this.areaAvailable[1] = ((this.manualScale-1)*window.innerWidth)/(this.manualScale*2);
      this.areaAvailable[3] = ((this.manualScale-1)*window.innerWidth)/(this.manualScale*2);
      console.log("calculations", this.initialSpaces, this.sliderHeight, this.imageElement.nativeElement.getBoundingClientRect().height)

    }
    else if(naturalHeight/naturalWidth<1){
      const ToChange = this.initialBoundingClient[0]/(this.manualScale/this.scale);
      let rightLeft = (window.innerWidth-ToChange)/2;
      console.log("zoom change space", rightLeft);
      this.areaAvailable[1] = rightLeft;
      this.areaAvailable[3] = rightLeft;
      this.areaAvailable[0] = ((this.manualScale-this.scale)*this.initialBoundingClient[0])/(this.manualScale*2);  //solve this too
      this.areaAvailable[2] = ((this.manualScale-this.scale)*this.initialBoundingClient[0])/(this.manualScale*2);
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
        
    const imgElement = this.imageElement.nativeElement;
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

    
    const imgElement = this.imageElement.nativeElement;
    imgElement.style.transition = `transform 0s` 
    imgElement.style.transform = `translate(${this.imagePositionX}px, ${this.imagePositionY}px)`;
    setTimeout(() => {
      imgElement.style.transition = `transform 0.1s ease`;
  }, 0);
  }

  //zooming
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
  
    const scaleChange = event.deltaY > 0 ? 0.9 : 1.1; // Zoom out or zoom in
    this.scale *= scaleChange;
    const imgElement = this.imageElement.nativeElement;
    //imgElement.style.scale = scaleChange;
  }

  OnZoom(type:boolean){
    if(type){
      if(this.manualScale>=5){
        return;
      }
      this.manualScale += 0.1;
    }else{
      console.log(this.manualScale, this.scale, this.areaAvailable[0],this.areaAvailable[1])
      if(this.manualScale <= this.scale || this.areaAvailable[0]<=0 || this.areaAvailable[1]<=0){
        return;
      }
      this.manualScale -= 0.1; 
    }
    console.log("zoom prev",  this.imageElement.nativeElement.getBoundingClientRect().height, "initial", this.initialBoundingClient[0])
    const imgElement = this.imageElement.nativeElement;
    imgElement.style.scale = this.manualScale;
    console.log("zoom after", this.imageElement.nativeElement.getBoundingClientRect().height)
    this.changeAvailableSpace(type);
    if(!type){ this.adjustOnZoomOut()}
  }


  onMouseDown(event: MouseEvent | TouchEvent, imageElement: HTMLImageElement, containerElement: HTMLElement) {
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
    this.imageElement.nativeElement.style.transition = `transform 0s` 
    let oldSliderHeight = this.sliderHeight;
    const intermediateHeight = Math.min(this.sliderHeightMax, Math.max(this.sliderHeightMin, this.initialHeight + dy));
    if(intermediateHeight-oldSliderHeight!=0){
      
      this.sliderChangeHandle(intermediateHeight-oldSliderHeight, intermediateHeight);
    }
    this.sliderHeight = intermediateHeight
    setTimeout(() => {
      this.imageElement.nativeElement.style.transition = `transform 0.1s ease`;
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
  
  // if slider height is increasing
  //if height is more uncover the image itslef
  //if height ends start scaling

  //if slider height is decreasing
  //if scaled previously unscale until the original
  //if uncovered originally 

  sliderChangeHandle(dy: number, intermediateHeight:number){
    console.log("dy",dy);

    const imgElement = this.imageElement.nativeElement;
    let newImagePositionY = 0;

    //when imagePositionY==0 ?
    // console.log("manual scale prev", this.manualScale, imgElement.getBoundingClientRect().height, this.sliderHeight);
    //if(imgElement.getBoundingClientRect().height <= this.sliderHeight)
    if(this.areaAvailable[0]==0){
      let toScale = intermediateHeight/(this.initialBoundingClient[0]);
      if(dy<1){this.adjustOnSliderZoomOut()}
        this.scale = toScale;
        imgElement.style.scale = this.scale;
        this.manualScale =this.scale;
        this.changeAvailableSpaceForZoomSlider();
        this.areaAvailable[0] = 0;
        this.areaAvailable[2] = 0;
        // console.log("manual scale", this.manualScale, imgElement.getBoundingClientRect().height, this.sliderHeight);
        return;
    }
    // else if( Math.abs(imgElement.getBoundingClientRect().height - this.sliderHeight)<2){
    //   if(dy<0 && this.manualScale>1){
    //     this.manualScale -= 0.01;
    //     imgElement.style.scale = this.manualScale;
    //     this.changeAvailableSpace();
    //     this.areaAvailable[0] = 0;
    //     this.areaAvailable[2] = 0;
    //     console.log("manual scale down", this.manualScale, imgElement.getBoundingClientRect().height, this.sliderHeight);
    //     return;
    //   }
    // }

    // this.areaAvailable[0] = Math.max(0,this.areaAvailable[0]-((this.manualScale-this.scale+1)*dy/2));
    // this.areaAvailable[2] = Math.max(0,this.areaAvailable[2]-((this.manualScale-this.scale+1)*dy/2));
    
    
    this.areaAvailable[0] = Math.max(0,this.areaAvailable[0]-(dy/(2*(this.manualScale-this.scale+1))));
    this.areaAvailable[2] = Math.max(0,this.areaAvailable[2]-(dy/(2*(this.manualScale-this.scale+1))));
    
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
}
