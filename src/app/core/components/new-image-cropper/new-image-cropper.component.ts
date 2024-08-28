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
  sliderHeight: number = 300;
  sliderOpts = {
    allowTouchMove: false
  };

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLElement>;
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;


  cropArray: any[] = [];
  isResizing: boolean = false;
  isDragging: boolean = false;
  startingY: number = 0;
  initialHeight: number = 0;
  public scale: number = 1;
  public translateX: number = 0;
  public translateY: number = 0;
  private startX: number = 0;
  private startY: number = 0;

  constructor(private gestureCtrl: GestureController) {}

  ngOnInit() {
    if (this.imageUri) {
      console.log('Image URI:', this.imageUri);
    }
  }

  calculateCropArea(img: HTMLImageElement, container: HTMLElement) {
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    // Calculate the difference between the container and image position to get the visible area in device pixels
    const visibleXInDevicePixels = Math.max(containerRect.left, imgRect.left) - imgRect.left;
    const visibleYInDevicePixels = Math.max(containerRect.top, imgRect.top) - imgRect.top;
  
    // Calculate the width and height of the visible area in device pixels
    const visibleWidthInDevicePixels = Math.min(containerRect.right, imgRect.right) - Math.max(containerRect.left, imgRect.left);
    const visibleHeightInDevicePixels = Math.min(containerRect.bottom, imgRect.bottom) - Math.max(containerRect.top, imgRect.top);
  
    // Calculate the scaling factor between the device pixels and the image's actual pixels
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
  
    // Calculate the x, y coordinates in the image's actual pixels
    const cropX = visibleXInDevicePixels * scaleX;
    const cropY = visibleYInDevicePixels * scaleY;
  
    // Calculate the width and height of the crop area in the image's actual pixels
    const cropWidth = visibleWidthInDevicePixels * scaleX;
    const cropHeight = visibleHeightInDevicePixels * scaleY;
  
    console.log(`Crop area in source image pixels: x=${cropX}, y=${cropY}, width=${cropWidth}, height=${cropHeight}`);
    
    return { cropX, cropY, cropWidth, cropHeight };
  }
  
  
 
  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.imageElement.nativeElement,
      gestureName: 'move-crop',
      onStart: (ev) => this.onGestureStart(ev),
      onMove: (ev) => this.onGestureMove(ev),
      onEnd: (ev) => this.onGestureEnd(ev),
    });
    gesture.enable();
  }

  onGestureStart(ev: any) {
    this.startX = ev.currentX - this.translateX;
    this.startY = ev.currentY - this.translateY;
  }

  onGestureMove(ev: any) {
    this.translateX = ev.currentX - this.startX;
    this.translateY = ev.currentY - this.startY;
  }

  onGestureEnd(ev: any) {
    // Optionally save the final positions here if needed
  }

  getImageTransform() {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }



  

  // // Function to handle slider value change
  // onSliderChange(event: any) {
  //   this.sliderHeight = event.detail.value; // Access the value from the event
  // }

  onMouseDown(event: MouseEvent, imageElement: HTMLImageElement, containerElement: HTMLElement) {
    this.calculateCropArea(imageElement, containerElement);
    this.isResizing = true;
    this.startingY = event.clientY;
    this.initialHeight = this.sliderHeight;

    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const dy = event.clientY - this.startingY;
    this.sliderHeight = Math.min(500, Math.max(200, this.initialHeight + dy));
  }

  onMouseUp() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
