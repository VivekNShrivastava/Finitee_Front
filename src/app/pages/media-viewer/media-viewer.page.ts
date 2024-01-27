import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/core/models/config/AppConstants';


@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.page.html',
  styleUrls: ['./media-viewer.page.scss'],
})
export class MediaViewerPage implements OnInit {

  image: any = "";
  constructor(
    private router: Router
  ) {
    var data = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    this.image = AppConstants.mediaPrefix + data;
  }

  ngOnInit(): void {

    // throw new Error('Method not implemented.');
  }

}
