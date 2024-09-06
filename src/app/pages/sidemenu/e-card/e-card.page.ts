import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { UserProfile, UserCanvasProfile, ECard } from 'src/app/core/models/user/UserProfile';
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
  eCard: ECard = new ECard();
  userCanvasProfile: UserCanvasProfile = new UserCanvasProfile();
  scanString: string = "";
  isNoteVisible: boolean = false;
  isEditMode: boolean = false; // Controls whether the note is in edit mode
  noteContent: string = ''; // Stores the content of the note
  showDeleteIcon: boolean = false; // Controls delete icon visibility
  showPlaceholder: boolean = true; // Controls placeholder visibility

  constructor(
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService,
    private router: Router,
    private alertController: AlertController
  ) {
    super(authService);
    if (this._activatedRoute.snapshot.params["UserId"]) {
      this.UserId = this._activatedRoute.snapshot.params["UserId"];
      if (this.UserId === 'loggedInUser') {
        this.UserId = this.logInfo.UserId;
      }
    }
  }

  @ViewChild('popover') popover!: { event: Event };

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async ngOnInit() {
    var res = await this._userProfileService.getUserCanvas(this.UserId, this.logInfo.UserId);
    this.userCanvasProfile = res;
    this.scanString = config.SACN_QRCODE + this.userCanvasProfile.canvasProfile.Id!;
  }

  toggleNoteSection() {
    this.isNoteVisible = !this.isNoteVisible; // Toggle the visibility of the note section
    if (!this.isNoteVisible) {
      this.isEditMode = false; // Exit edit mode when collapsing the note section
      this.showPlaceholder = true; // Show placeholder when note section is collapsed
      this.showDeleteIcon = false; // Hide delete icon when note section is collapsed
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode; // Toggle edit mode on and off
    if (!this.isEditMode) {
      this.showPlaceholder = true; // Show placeholder if exiting edit mode without focusing on textarea
    }
    this.showDeleteIcon = this.noteContent.length > 0; // Show delete icon if there is content
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Note',
      message: 'Are you sure you want to delete the note?',
      cssClass: 'add-user-alert',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          cssClass: 'add-user-alert-send-without-button',
          handler: () => {
            this.deleteNote();
          },
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'add-user-alert-send-button' ,
        },
      ],
    });

    await alert.present();
  }

  deleteNote() {
    this.noteContent = ''; // Clear the note content
    this.isEditMode = false; // Exit edit mode after deletion
    this.showDeleteIcon = false; // Hide delete icon after deletion
    this.toggleNoteSection(); // Collapse the note section after deletion
  }

  saveNote() {
    // Logic to save the note goes here
    this.toggleEditMode(); // Exits edit mode after saving
  }

  onTextareaFocus() {
    this.showPlaceholder = false; // Hide placeholder when textarea is focused
  }

  onTextareaInput(event: any) {
    this.noteContent = event.target.value; // Update note content
    this.showDeleteIcon = this.noteContent.length > 0; // Show delete icon if there is content
  }

  editecard() {
    this.router.navigateByUrl('/edit-e-card');
  }

  openGmail() {
    const recipient = 'recipient@example.com';
    const subject = 'Your Subject Here';
    const body = 'Your message here.';
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
  }

  openPhoneDialer() {
    window.open('tel:' + this.userCanvasProfile.canvasProfile, '_self');
  }

  shareContent() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this e-Card',
        text: `View the e-Card for ${this.userCanvasProfile.canvasProfile.DisplayName}.`,
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
}
