import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { BasePage } from 'src/app/base.page';
import { UserProfile, UserCanvasProfile,ECard } from 'src/app/core/models/user/UserProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { ECardService } from 'src/app/core/services/e-card/e-card.service';


@Component({
  selector: 'app-e-card',
  templateUrl: './e-card.page.html',
  styleUrls: ['./e-card.page.scss'],
})
export class ECardPage extends BasePage implements OnInit {
  UserId: string = "";
  eCard:ECard=new ECard();
  userCanavasProfile: UserCanvasProfile = new UserCanvasProfile();
  scanString: string = "";

  constructor(
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService,
    private router: Router) {
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
    // this.userProfile = res;
    this.userCanavasProfile = res;
    this.scanString = config.SACN_QRCODE + this.userProfile.user.Id!;
  }

  editecard(){
    this.router.navigateByUrl('/edit-e-card');
  }
  openGmail() {
    const recipient = 'recipient@example.com'; // Replace with the recipient email address
    const subject = 'Your Subject Here';
    const body = 'Your message here.';
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
  }
  openPhoneDialer() {
    window.open('tel:' + this.userProfile.user.Phone, '_self');
  }
  shareContent() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this e-Card',
        text: `View the e-Card for ${this.userProfile.user.DisplayName}.`,
        url: window.location.href // Replace with the specific URL you want to share
      }).then(() => {
        console.log('Content shared successfully');
      }).catch((error) => {
        console.error('Error sharing content:', error);
      });
    } else {
      console.error('Web Share API not supported in this browser.');
    }

  }
  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    await this.getEcard();
  }

  async getEcard() {
    var res = await this._EcardService.getEcard(this.UserId, this.logInfo.UserId)
    this.eCard=res.Ecard;
    console.log(this.eCard.Name)
  }
}


