import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/base.page';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';

@Component({
  selector: 'app-e-profile',
  templateUrl: './e-profile.page.html',
  styleUrls: ['./e-profile.page.scss'],
})
export class EProfilePage extends BasePage implements OnInit {
  UserId: string = "";
  userProfile: UserProfile = new UserProfile();
  scanString: string = "";
  constructor(
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService) {
    super(authService);
    if (this._activatedRoute.snapshot.params["UserId"])
      this.UserId = this._activatedRoute.snapshot.params["UserId"];
    else
      this.UserId = this.logInfo.UserId;
  }

  @ViewChild('popover') popover!: { event: Event };

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async ngOnInit() {
    var res = await this._userProfileService.getUserProfile(this.UserId, this.logInfo.UserId)
    this.userProfile = res;
    this.scanString = config.SACN_QRCODE + this.userProfile.user.Id!;
  }
}
