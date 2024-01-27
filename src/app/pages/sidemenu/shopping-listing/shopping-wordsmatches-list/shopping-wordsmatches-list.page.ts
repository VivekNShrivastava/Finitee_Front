import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SalesListingService } from 'src/app/core/services/sales-listing/sales-listing.service';

@Component({
  selector: 'app-shopping-wordsmatches-list',
  templateUrl: './shopping-wordsmatches-list.page.html',
  styleUrls: ['./shopping-wordsmatches-list.page.scss'],
})
export class ShoppingWordsmatchesListPage extends BasePage implements OnInit {


  constructor(public salesService: SalesListingService, private authService: AuthService, public commonService: CommonService) {
    super(authService)
   }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    var res = await this.salesService.getMatchedShoppingList();
    if (res) {
      this.salesService.shoppingWordsMatchesList = res;
      console.log(res)
    }
  }

}
