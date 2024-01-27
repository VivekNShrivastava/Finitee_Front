import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { ShoppingListWord } from 'src/app/core/models/sales-item/shopping-list-word';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';

@Component({
  selector: 'app-create-edit-shopping-list',
  templateUrl: './create-edit-shopping-list.page.html',
  styleUrls: ['./create-edit-shopping-list.page.scss'],
})
export class CreateEditShoppingListPage implements OnInit {
  conditionList = ['New', 'Like new', 'Refurbished', 'Used', 'Not working', 'Any condition']
  shoppingListWords: ShoppingListWord[] = [
    new ShoppingListWord(),
    new ShoppingListWord(),
    new ShoppingListWord(),
    new ShoppingListWord(),
    new ShoppingListWord(),
  ];
  conditionPopovers: any[] = [];


  constructor(private salesService: SalesListingService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.shoppingListWords = this.salesService.shoppingListWords
    this.fillEmptyItems();

  }

  fillEmptyItems() {
    const emptyItemCount = 5 - this.shoppingListWords.length;
    if (emptyItemCount > 0) {
      for (let i = 0; i < emptyItemCount; i++) {
        this.shoppingListWords.push(new ShoppingListWord());
      }
    }
  }

  async submit() {
    this.salesService.shoppingListWords = this.shoppingListWords.filter(item => item.Word.trim() !== '');
    const result = await this.salesService.updateShoppingListWords(this.salesService.shoppingListWords);
    if (result) {
      this.router.navigateByUrl('/shopping-list')
    }
    console.log(this.salesService.shoppingListWords);
  }

}
