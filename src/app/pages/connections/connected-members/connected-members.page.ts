import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { userConnection } from 'src/app/core/models/connection/connection';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';

@Component({
  selector: 'app-connected-members',
  templateUrl: './connected-members.page.html',
  styleUrls: ['./connected-members.page.scss'],
})
export class ConnectedMembersPage extends BasePage implements OnInit {
  loaded: boolean = false;
  userConnections: Array<userConnection> = [];
  userId: string = "";
  constructor(private authService: AuthService, private connectionService: ConnectionsService, private navCtrl: NavController, private router: Router) {
    super(authService);
    this.userId = this.router.getCurrentNavigation()!.extras!.state!['data'];
  }

  async ionViewWillEnter() {
    this.userId = history.state!['data'];
    this.userConnections = await this.connectionService.getUserConnections(this.userId);

    // this.userConnections = await this.connectionService.getUserConnections(this.userId);
    this.loaded = true;
  }
  async ngOnInit() {

  }

  viewProfile(user: userConnection) {
    console.log("viewprofile", user);
    if (user.UserId != this.logInfo.UserId && user.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
      // console.log("user", user);

      const navigationExtras1s: NavigationExtras = {
        state: {
          data: user
        }
      };
      if (user.UserTypeId != AppConstants.USER_TYPE.FR_USER)
        this.navCtrl.navigateForward('business-user-canvas-other', navigationExtras1s);
      else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
        this.navCtrl.navigateForward('free-user-canvas', navigationExtras1s);
    }
    // console.log("user-else", user);
  }

}
