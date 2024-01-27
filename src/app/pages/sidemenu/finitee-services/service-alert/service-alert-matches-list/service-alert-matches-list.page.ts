import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/base.page';
import { FiniteeService } from 'src/app/core/models/finitee-services/finitee.services';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';

@Component({
  selector: 'app-service-alert-matches-list',
  templateUrl: './service-alert-matches-list.page.html',
  styleUrls: ['./service-alert-matches-list.page.scss'],
})
export class ServiceAlertMatchesListPage extends BasePage implements OnInit {

  serviceAlertMatches: Array<FiniteeService> = [];
  currencySymbol?: string;
  constructor(private finiteeService: FiniteeServicesService, public commonService: CommonService, private authService: AuthService) { 
    super(authService)
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.currencySymbol = this.commonService.currentCurrency.CurrencySymbol;

    var res = await this.finiteeService.getServiceAlertMatched();
    if (res) {
      this.serviceAlertMatches = res;
console.log(res)
    }
  }

}
