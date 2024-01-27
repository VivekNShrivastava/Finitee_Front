import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import _lodash from 'lodash';
import { BasePage } from 'src/app/base.page';
import { UserProfile } from 'src/app/core/models/user/UserProfile';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-traits',
  templateUrl: './edit-traits.page.html',
  styleUrls: ['./edit-traits.page.scss'],
})
export class EdittraitsPage extends BasePage implements OnInit, OnDestroy 
{
  selectedTraits: any = [];
  traitsData: any = [{
    category: "Traits",
    subCategory: ["Soccer", "Music", "Yoga", "Swimming", "Fiction reading"]
  }]
  userProfile: UserProfile = new UserProfile();

  constructor(private postService: PostService, private router: Router,  authService: AuthService,private navCtrl: NavController,public businessCanvasService: BusinessCanvasService) {
    super(authService);
    this.userProfile = this.router!.getCurrentNavigation()!.extras.state!['data'];
  
   }

  ngOnInit() { 
    this.userProfile.user.Traits.forEach((trait: any) => {
      this.selectTrait(trait);
    });
  }

  selectTrait(trait: any) {
    let index = _lodash.findIndex(this.selectedTraits, (e) => {
      return e == trait;
    }, 0);
    if (index != -1) {
      this.selectedTraits.splice(index, 1);
    }
    else {
      this.selectedTraits.push(trait);
    }
  }

  getColor(trait: any) {
    let index = _lodash.findIndex(this.selectedTraits, (e) => {
      return e == trait;
    }, 0);
    if (index != -1)
      return 'primary';
    else
      return 'medium';
  }
  async saveTraitsProfile() {
    
      if (this.selectedTraits)
        this.userProfile.user.Traits= this.selectedTraits
     
      delete this.userProfile.user.Id;
      var result = await this.businessCanvasService.saveBusinessUserProfile(this.userProfile.user);
      if (result) {
        this.businessCanvasService.businessData.next(this.userProfile);
        this.navCtrl.pop();
      }
 
  }
  // saveTraits() {
    
  //   this.navCtrl.pop();
  // }

  ngOnDestroy() {
    this.postService.postTraits.next(this.selectedTraits);
  }
}
