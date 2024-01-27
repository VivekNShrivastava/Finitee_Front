import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonPopover } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Product } from 'src/app/core/models/product/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';

@Component({
  selector: 'app-edit-privacy',
  templateUrl: './edit-privacy.page.html',
  styleUrls: ['./edit-privacy.page.scss'],
})
export class EditPrivacyPage extends BasePage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;
  productId: any;
  product: Product = new Product;
  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private businessService: BusinessCanvasService) {
    super(authService);
    this.route.params.subscribe((params: any) => {
      console.log("params", params)
      this.productId = params.productId;
    });
  }

  ngOnInit() {
    this.getProductByProductId();
  }

  async getProductByProductId() {
    var result = await this.businessService.getProductByProductId(this.productId);
    if (result) {
      this.product = result;
    }


  }
}
