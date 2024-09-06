import { Component, OnInit } from '@angular/core';
import { ECardService } from 'src/app/core/services/e-card/e-card.service';
import { ECard } from 'src/app/core/models/ecard/ecard';
import { UserCanvasProfile, UserProfile } from 'src/app/core/models/user/UserProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActionSheetController, AlertController, IonicModule, IonInput, NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-e-card',
  templateUrl: './edit-e-card.page.html',
  styleUrls: ['./edit-e-card.page.scss'],
})
export class EditECardPage extends BasePage implements OnInit {
  loaded: boolean = false;
  userCanvasProfile: UserCanvasProfile = new UserCanvasProfile();
  eCard: ECard = new ECard();
  userProfile: UserProfile = new UserProfile();
  // Array to hold dynamic rows
  dynamicRows: Array<{ field: string; value: string }> = [{ field: '', value: '' }];
  UserId: string="";
  originalECard: ECard = new ECard();

  constructor(private alertController: AlertController,
    private eCardService:ECardService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService,
    private authService: AuthService,
    private router:Router
  ) {
    super(authService);
    if (this._activatedRoute.snapshot.params["UserId"]){
      this.UserId = this._activatedRoute.snapshot.params["UserId"];
      if(this.UserId === 'loggedInUser'){
        this.UserId = this.logInfo.UserId;
      }
  }
}

addRow() {
  if (this.dynamicRows.length < 15) {
    this.dynamicRows.push({ field: '', value: '' });
    console.log("Adding row")
  }
  
}
addECard() {
  // Transform dynamicRows into eCard.CustomFields
  this.eCard.CustomFields = {};

  this.dynamicRows.forEach(row => {
    if (row.field && row.value) {
      this.eCard.CustomFields[row.field] = row.value;
      
    }
  });

  // Now proceed with saving the eCard
  this.eCardService.addOrUpdateEcard(this.eCard).then(
    (response) => {
      alert("E-Card updated successfully");
      console.log('E-Card updated successfully:', response);
      
    },
    (error) => {
      console.error('Error updating eCard:', error);
      // Handle error
    }
  );
}

async ngOnInit() {
  this.getEcard();
}

  // Method to handle input changes and add a new row if needed
  onInputChange(index: number) {
    const row = this.dynamicRows[index];
  
    // Sync dynamicRows with eCard.CustomFields
    if (row.field && row.value) {
      this.eCard.CustomFields[row.field] = row.value;
    } else if (!row.field || !row.value) {
      // Remove empty fields from eCard.CustomFields
      delete this.eCard.CustomFields[row.field];
    }
  
    // Add a new row if the last row has content and the number of rows is less than 15
    if (index === this.dynamicRows.length - 1 && this.dynamicRows.length < 15) {
      if (row.field || row.value) {
        this.addRow();
      }
    }
  }
  
  
  // Method to delete a dynamic row
  deleteDynamicRow(index: number) {
    this.dynamicRows.splice(index,1); // Remove the row at the specified index

    this.eCard.CustomFields = {};

    this.dynamicRows.forEach(row => {
      if (row.field && row.value) {
        this.eCard.CustomFields[row.field] = row.value;
      }
    });
    
   
  }
  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
  
  }
  async getEcard() {
    
    var res = await this.eCardService.getEcard(this.UserId, this.logInfo.UserId)
    this.eCard=res.Ecard;
    console.log(this.eCard.Name)  

    if (this.eCard.CustomFields) {
      this.dynamicRows = Object.keys(this.eCard.CustomFields).map((key) => {
        return { field: key, value: this.eCard.CustomFields[key] };
      });
    }
    this.addRow();
    this.loaded = true;
     this.originalECard = JSON.parse(JSON.stringify(this.eCard));
  }
  hasChanges(): boolean {
    return JSON.stringify(this.eCard) !== JSON.stringify(this.originalECard);
    
  }

  // Handle back button click
  async handleBackButtonClick() {
    if (this.hasChanges()) {
      // Show confirmation popup if there are unsaved changes
      const alert = await this.alertController.create({
        message: 'Are you sure you want to exit without saving your changes?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              // Stay on the page
            },
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: () => {
              // Reset eCard to original state
              this.eCard = JSON.parse(JSON.stringify(this.originalECard));
              
              // Also reset dynamicRows based on originalECard
              this.dynamicRows = Object.keys(this.originalECard.CustomFields || {}).map(key => {
                return { field: key, value: this.originalECard.CustomFields[key] };
              });
              this.addRow();
  
              // Navigate back to eCard page
              this.router.navigateByUrl(`e-card/${this.UserId}`);
            },
          },
        ],
      });
      await alert.present();
    } else {
      // No changes, navigate back without confirmation
      this.router.navigateByUrl(`e-card/${this.UserId}`);
    }
  }
}