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
  hasUnsavedChanges:boolean=false;
  loaded: boolean = false;
  userCanvasProfile: UserCanvasProfile = new UserCanvasProfile();
  eCard: ECard = new ECard();
  userProfile: UserProfile = new UserProfile();
  // Array to hold dynamic rows
  dynamicRows: Array<{ field: string; value: string }> = [{ field: '', value: '' }];
  UserId: string="";
  originalECard:ECard = new ECard();
  originalECard1:Array<{ field: string; value: string }> = [{ field: '', value: '' }];
  
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
  if (this.dynamicRows.length < 10) {
    this.dynamicRows.push({ field: '', value: '' });
    
    console.log("Adding row")
  }

}
 // Handle Save button click
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
     // alert("E-Card updated successfully");
      console.log('E-Card updated successfully:', response);
      
      // Reset hasUnsavedChanges after successful save
      this.hasUnsavedChanges = false;
      
      // Update originalECard to match the saved eCard
      this.originalECard = JSON.parse(JSON.stringify(this.eCard));
    },
    (error) => {
      console.error('Error updating eCard:', error);
      // Handle error
    }
  );
this.router.navigateByUrl(`e-card/${this.UserId}`);
}
async ngOnInit() {

}

onPrimaryFieldChange() {
  this.hasUnsavedChanges = this.hasChanges();
}

  // Method to handle input changes and add a new row if needed
  onInputChange(index: number) {
    const row = this.dynamicRows[index];
    
    if (this.hasChanges()==true) {
     this.hasUnsavedChanges=true
      console.log('Changes detected!');
    } else {
      this.hasUnsavedChanges=false
      console.log('No changes detected.');
    }
    
    
    
    this.hasUnsavedChanges = this.hasChanges();

    // Add a new row if the last row has content and the number of rows is less than 10
    if (index === this.dynamicRows.length - 1 && this.dynamicRows.length < 10) {
      if (row.field || row.value) {
        this.addRow();
      }
    }
  }

  hasChanges(): boolean {
    console.log(this.dynamicRows);
    console.log(this.originalECard1);
    
    return JSON.stringify(this.dynamicRows) !== JSON.stringify(this.originalECard1);
    
  }
  
  // Method to delete a dynamic row
    deleteDynamicRow(index: number) {
    const deletedRow = this.dynamicRows[index];
    this.dynamicRows.splice(index, 1); // Remove the row at the specified index
    
    const wasRowInOriginalECard = this.originalECard1.some(
      row => row.field === deletedRow.field && row.value === deletedRow.value
    );
    
    // If the row was part of the original eCard (not a newly added row)
    if (wasRowInOriginalECard) {
        this.hasUnsavedChanges = true;  // Enable the save button
    } else {
        // If the row was not part of the original eCard, check if there are still unsaved changes
        this.hasUnsavedChanges =   this.originalECard1.some(
          row => row.field === deletedRow.field && row.value === deletedRow.value
        );
        this.hasUnsavedChanges=false
    }
      this.eCard.CustomFields = {};

      this.dynamicRows.forEach(row => {
        if (row.field && row.value) {
          this.eCard.CustomFields[row.field] = row.value;
        }
      });
     
    
    
    }
  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.loaded=true
    this.getEcard();
    this.hasUnsavedChanges = false;
    this.loaded=false
  }
  async getEcard() {
    
    var res = await this.eCardService.getEcard(this.UserId, this.logInfo.UserId)
    this.eCard=res.Ecard;
    
    console.log(this.eCard)  

  // Initialize dynamicRows with the Name field
  this.dynamicRows = [{ field: "Name", value: this.eCard["Name"] }];

  // Append CustomFields to dynamicRows if they exist
  if (this.eCard.CustomFields) {
    this.dynamicRows = this.dynamicRows.concat(
      Object.keys(this.eCard.CustomFields).map((key) => {
        return { field: key, value: this.eCard.CustomFields[key] };
      })
    );
    
  }

    this.addRow();
    this.loaded = true;
     this.originalECard1 = JSON.parse(JSON.stringify(this.dynamicRows));
     
    //  console.log(this.originalECard1)
     
  }
 

  // Handle back button click
  async handleBackButtonClick() {
    if (this.hasChanges()) {
      // Show confirmation popup if there are unsaved changes
      const alert = await this.alertController.create({
        
        header: 'Are you sure you want to exit without saving your changes?',
        cssClass: 'add-user-alert',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'add-user-alert-send-button',
            handler: () => {
              // Stay on the page
            },
          },
          {
            text: 'Yes',
            role: 'confirm',
            cssClass: 'add-user-alert-send-without-button',
            handler: () => {
              // Reset eCard and dynamicRows to original state
              this.eCard = JSON.parse(JSON.stringify(this.originalECard));
              this.dynamicRows = Object.keys(this.originalECard.CustomFields || {}).map(key => {
                return { field: key, value: this.originalECard.CustomFields[key] };
              });
              this.addRow();
              
              // Navigate back to eCard page
              this.router.navigateByUrl(`e-card/${this.UserId}`);
              this.hasUnsavedChanges = false;
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