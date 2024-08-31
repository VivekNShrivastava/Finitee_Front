import { Component, OnInit } from '@angular/core';
import { ECardService } from 'src/app/core/services/e-card/e-card.service';
import { ECard } from 'src/app/core/models/ecard/ecard';
import { UserCanvasProfile, UserProfile } from 'src/app/core/models/user/UserProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/core/services/canvas-home/profile.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-e-card',
  templateUrl: './edit-e-card.page.html',
  styleUrls: ['./edit-e-card.page.scss'],
})
export class EditECardPage extends BasePage implements OnInit {
  userCanvasProfile: UserCanvasProfile = new UserCanvasProfile();
  eCard: ECard = new ECard();
  userProfile: UserProfile = new UserProfile();
  // Array to hold dynamic rows
  dynamicRows: Array<{ field: string; value: string }> = [{ field: '', value: '' }];
  UserId: string="";

  constructor(private eCardService:ECardService,
    private _activatedRoute: ActivatedRoute,
    private _userProfileService: ProfileService,
    private authService: AuthService,
  ) {
    super(authService);
    if (this._activatedRoute.snapshot.params["UserId"]){
      this.UserId = this._activatedRoute.snapshot.params["UserId"];
      if(this.UserId === 'loggedInUser'){
        this.UserId = this.logInfo.UserId;
      }
  }
}
async ngOnInit() {
  // this.userProfile = await this._userProfileService.getUserProfile(this.UserId, this.logInfo.UserId)
  var res = await this._userProfileService.getUserCanvas(this.UserId, this.logInfo.UserId)
  // this.userProfile = res;
  this.userCanvasProfile = res;
  // this.scanString = config.SACN_QRCODE + this.userCanvasProfile.canvasProfile.Id!;
}

  // Method to add a new empty row
  addRow() {
    this.dynamicRows.push({ field: '', value: '' });
    this.eCard.CustomFields = this.dynamicRows.reduce((fields, row) => {
    if (row.field && row.value) {
      fields[row.field] = row.value;
    }
    return fields;
  }, {} as { [key: string]: string });

     //method to add or update
  
    // Prepare the data to be sent to the API
    // const eCardData = {
      
      // this.eCard.Name = this.userProfile.user.UserName;
      // this.eCard.Email = this.userProfile.user.Email;
      // this.eCard.PhoneNumber = this.userProfile.user.Phone;
      // this.eCard.Website = this.userProfile.user.Website;
      
      // this.eCard.CustomFields =this.dynamicRows.filter(row => row.field || row.value) // Include only rows with data
    // };

    // Call the service method
    this. eCardService.addOrUpdateEcard(this.eCard).then(
      (response) => {
        console.log('E-Card updated successfully:', response);
        // Handle success (e.g., navigate to another page or show success message)
      },
      (error) => {
        console.error('Error updating eCard:', error);
        // Handle error
      }
    );
  }
  

  // Method to handle input changes and add a new row if needed
  // onInputChange(index: number) {
  //   // If the focused row is the last one and it has some content, add a new row
  //   if (index === this.dynamicRows.length - 1) {
  //     const lastRow = this.dynamicRows[index];
  //     if (lastRow.field || lastRow.value) {
  //       this.addRow();
  //     }
  //   }
  // }
  
  // Method to delete a dynamic row
  deleteDynamicRow(index: number) {
    this.dynamicRows.splice(index, 1); // Remove the row at the specified index

    // Ensure at least one empty row remains if all rows are deleted
    if (this.dynamicRows.length === 0) {
      this.addRow();
    }
  }
  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    await this.getEcard();
  }
  async getEcard() {
    var res = await this.eCardService.getEcard(this.UserId, this.logInfo.UserId)
    this.eCard=res.Ecard;
    console.log(this.eCard.Name)
  }
  
}
