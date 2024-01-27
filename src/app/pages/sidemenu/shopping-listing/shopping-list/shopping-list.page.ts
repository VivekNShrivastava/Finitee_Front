import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  constructor(private router: Router, public salesService: SalesListingService) {  }

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
}
