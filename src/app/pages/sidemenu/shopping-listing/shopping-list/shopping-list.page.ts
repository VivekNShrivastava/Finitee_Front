import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';
import { CommonService } from 'src/app/core/services/common.service';
import { EventItem } from 'src/app/core/models/event/event';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {
  navEx: any = {};


  constructor(private router: Router, 
    public salesService: SalesListingService,
    public commonService: CommonService
  ) {  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    
    const result = await this.salesService.getShoppingListWords();
    if (result) {
      this.salesService.shoppingListWords = result;
    }

  }

  viewMatchedResult(){
   this.router.navigateByUrl('shopping-list/shopping-wordsmatches-list')
  }

  edit() {
     
    this.router.navigateByUrl('shopping-list/create-edit-shopping-list')
  }
  

  openCreateShoppingPage() {

    this.router.navigateByUrl('/shopping-list/create-edit-shopping-list')

    // this.navEx!.state!['data'] = new EventItem();
    // this.router.navigateByUrl('shopping-listing/create-edit-shopping', this.navEx);
  }



  
}
