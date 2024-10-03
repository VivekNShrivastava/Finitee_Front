import { EventEmitter, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailHelperService {
  navEx: NavigationExtras = {
    state: {
      data: null,
      extraParams: null
    }
  };

  
  public onMediaSave: EventEmitter<any> = new EventEmitter<any>();
  public onMediaCoverSelction: EventEmitter<any> = new EventEmitter<any>();
  public serviceCallerCode: string | null = null;
  public serviceCallerEvent: string | null = null;
  progress: any;
  public selectedVideoPath = "";
  constructor( ) {  }
}