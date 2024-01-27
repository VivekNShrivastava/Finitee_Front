import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { UserProfile, UserCanvasProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';

import * as config from 'src/app/core/models/config/ApiMethods';


@Component({
  selector: 'app-e-card',
  templateUrl: './e-card.page.html',
  styleUrls: ['./e-card.page.scss'],
})
export class ECardPage extends BasePage implements OnInit {
  UserId: string = "";
  userProfile: UserProfile = new UserProfile();
  userCanavasProfile: UserCanvasProfile = new UserCanvasProfile();
  scanString: string = "";

  constructor(
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService) {
    super(authService);
    if (this._activatedRoute.snapshot.params["UserId"]){
      this.UserId = this._activatedRoute.snapshot.params["UserId"];
      if(this.UserId === 'loggedInUser'){
        this.UserId = this.logInfo.UserId;
      }
    }
    // else{
      
    // }
      
  }

  @ViewChild('popover') popover!: { event: Event };

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async ngOnInit() {
    // this.userProfile = await this._userProfileService.getUserProfile(this.UserId, this.logInfo.UserId)
    var res = await this._userProfileService.getUserCanvas(this.UserId, this.logInfo.UserId)
    this.userProfile = res;
    this.userCanavasProfile = res;
    this.scanString = config.SACN_QRCODE + this.userProfile.user.Id!;
  }
}
