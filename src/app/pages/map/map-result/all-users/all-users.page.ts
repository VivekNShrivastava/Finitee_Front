import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular'; // Import NavController
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { FiniteeUserOnMap } from '../../models/MapSearchResult';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.page.html',
  styleUrls: ['./all-users.page.scss'],
})
export class AllUsersPage implements OnInit {
  users: any[] = []; 
  appConstants: any = AppConstants;
  navController: NavController;  // Inject NavController
  dismissModal: any;

  constructor(private router: Router, private _navController: NavController) {
    this.navController = _navController;  // Initialize navController
    const state = history.state;
    if (state && state.users) {
      this.users = state.users;
      console.log('Users received from history.state:', this.users);
    } else {
      console.log('No users found in history.state');
    }
  }

  ngOnInit() {
    const state = history.state;
    if (state && state.users) {
      this.users = state.users;
      console.log('Users received from history.state:', this.users);
    } else {
      console.log('No users found in history.state');
    }
  
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['users']) {
      this.users = navigationState['users'];
      console.log('Users received from router navigation state:', this.users);
    } else {
      console.log('No users found in navigation state');
    }
  
    if (this.users.length === 0) {
      console.log('No users to display');
    }
  }

  // Function to navigate to '/app-map-result2' on back button click
  goBack() {
    this.navController.navigateForward('/app-map-result2');  // Use NavController to navigate
  }

  public viewConnection(user: FiniteeUserOnMap): void {
    this.dismissModal("VIEW_CONNECTION", user);
  }
  
}
