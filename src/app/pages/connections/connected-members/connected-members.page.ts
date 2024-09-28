import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { userConnection } from 'src/app/core/models/connection/connection';
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
  filteredUserConnections: Array<userConnection> = [];
  userId: string = "";
  searchQuery: string = '';
  isSearchEnabled: boolean = false; // Track search bar visibility

  constructor(
    private authService: AuthService,
    private connectionService: ConnectionsService,
    private navCtrl: NavController,
    private router: Router
  ) {
    super(authService);
    this.userId = this.router.getCurrentNavigation()!.extras!.state!['data'];
  }

  async ionViewWillEnter() {
    this.userId = history.state!['data'];
    this.userConnections = await this.connectionService.getUserConnections(this.userId);
    this.filteredUserConnections = [...this.userConnections]; 
    this.loaded = true;
  }

  async ngOnInit() {
    // Optionally handle any initialization logic here
  }

  // Method to toggle the search bar visibility
  toggleSearch() {
    this.isSearchEnabled = !this.isSearchEnabled;
    if (!this.isSearchEnabled) {
      this.searchQuery = ''; // Reset search query when hiding search bar
      this.filteredUserConnections = [...this.userConnections]; // Reset to all connections
    }
  }

  filterUsers(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredUserConnections = this.userConnections.filter(user =>
        user.DisplayName.toLowerCase().includes(query) ||
        user.UserName.toLowerCase().includes(query)
      );
    } else {
      this.filteredUserConnections = [...this.userConnections];
    }
  }

  viewProfile(user: userConnection) {
    console.log("viewprofile", user);
    if (user.UserId !== this.logInfo.UserId && user.UserTypeId === AppConstants.USER_TYPE.FR_USER) {
      const navigationExtras1s: NavigationExtras = {
        state: {
          data: user.UserId  
        }
      };
      if (user.UserTypeId !== AppConstants.USER_TYPE.FR_USER) {
        this.navCtrl.navigateForward('business-user-canvas-other', navigationExtras1s);
      } else if (user.UserTypeId === AppConstants.USER_TYPE.FR_USER) {
        this.navCtrl.navigateForward('free-user-canvas', navigationExtras1s);
      }
    }
  }
}
