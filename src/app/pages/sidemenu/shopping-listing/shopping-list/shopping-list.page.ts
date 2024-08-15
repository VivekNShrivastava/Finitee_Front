import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';
import { CommonService } from 'src/app/core/services/common.service';
import { EventItem } from 'src/app/core/models/event/event';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {
  navEx: any = {};


  constructor(private router: Router, 
    public salesService: SalesListingService,
    public commonService: CommonService,
    private title: Title,
    
  ) {  }

  ngOnInit() {
    this.title.setTitle('Shopping List');
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
    // Navigate to the edit-shop page with the desired title as a query parameter
    this.router.navigate(['shopping-list/create-edit-shopping-list'], { queryParams: { title: 'Edit Item' } });
  }

  openCreateShoppingPage() {
    this.router.navigate(['shopping-list/create-edit-shopping-list'], { queryParams: { title: 'Add Item' } });
  }



  
}
