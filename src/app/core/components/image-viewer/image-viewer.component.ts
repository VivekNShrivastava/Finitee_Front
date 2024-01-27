import { Component, HostBinding, Input } from '@angular/core';
import * as config from 'src/app/core/models/config/ApiMethods';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {
  _src = '';
  _alt = '';
  configUrl = config.VIEW_URL;
  timeOutCompleted = false;
  imageAttributes: any[] = [
    { element: 'crossorigin', value: 'anonymous' },
    { element: 'crossOrigin', value: '' },
    { element: 'onerror', value: (event: Error) => { console.log('imgerror'); } },
    { element: 'loading', value: 'lazy' },
    { element: 'onclick', value: () => { console.log('clicked'); } }
  ];
  @HostBinding('class.img-loaded') imageLoaded = false;

  @Input() type?: string;

  @Input() set src(val: string) {
    if (this.type == 'PO' || this.type == 'PE') {
      if (val && !val.startsWith('http') && !val.startsWith('blob:')) {
        val = this.configUrl + val;
      }
    }
    if (this.type == 'PE') {
    }
    this._src = (val !== undefined && val !== null) ? val : '';
  }

  @Input()
  set alt(val: string) {
    this._alt = (val !== undefined && val !== null) ? val : '';
  }

  constructor() {
    setTimeout(() => {
      this.timeOutCompleted = true;
    }, 15000);
  }

  _imageLoaded(event: Event): void {
    this.imageLoaded = true;
    this.timeOutCompleted = false;
  }
}
