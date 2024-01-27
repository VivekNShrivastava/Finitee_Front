import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { userConnection } from 'src/app/core/models/connection/connection';
import { Product } from 'src/app/core/models/product/product';
import { User, UserProfile, UserCanvasProfile } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';


@Component({
  selector: 'app-user-screen',
  templateUrl: './recommend-user.page.html',
  styleUrls: ['./recommend-user.page.scss'],
})
export class RecommendUserPage extends BasePage implements OnInit {
  selectedProductIndex: number = 0;
  userProfile: UserProfile = new UserProfile;
  userConnections: Array<userConnection> = [];
  loaded: boolean = false;
  selectedUserIds: string[] = [];
  userMessage: string = '';
  canvasProfile: UserCanvasProfile = new UserCanvasProfile();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    public businessService: BusinessCanvasService,
    private authService: AuthService,
    private navCtrl: NavController,
    private connectionsService: ConnectionsService
  ) {
    super(authService);
    this.canvasProfile = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    
  }

  ngOnInit() {
    this.getUserConnections();
  }
  async getUserConnections() {
    this.userConnections = await this.connectionsService.getUserConnections();
    this.loaded = true;
    console.log(this.userConnections)
  }

  async handleTextareaChange(event: any) {
    this.userMessage = event.target.value;
    // console.log(this.userMessage);
  }

  async handleCheckboxChange(id: string) {
    
    const index = this.selectedUserIds.indexOf(id);

    if (index > -1) {
      // User is unchecking, remove from the array
      this.selectedUserIds.splice(index, 1);
      console.log("unchecked", id)
      console.log(this.selectedUserIds)
    } else {
      // User is checking, add to the array
      this.selectedUserIds.push(id);
      console.log("checked", id)
      console.log(this.selectedUserIds)
    }
  }

  async referConnections () {

    this.connectionsService.referToConnections(this.selectedUserIds, this.canvasProfile.canvasProfile.Id, this.userMessage);
  }
}
