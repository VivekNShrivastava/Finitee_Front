import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { userConnection } from 'src/app/core/models/connection/connection';
import { Product } from 'src/app/core/models/product/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { ConnectionsService } from 'src/app/core/services/connections.service';

@Component({
  selector: 'app-recommend-screen',
  templateUrl: './recommend-screen.page.html',
  styleUrls: ['./recommend-screen.page.scss'],
})
export class RecommendScreenPage extends BasePage implements OnInit {
  selectedProductIndex: number = 0;
  product: Product = new Product;
  userConnections: Array<userConnection> = [];
  loaded: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    public businessService: BusinessCanvasService,
    private authService: AuthService,
    private navCtrl: NavController,
    private connectionsService: ConnectionsService
  ) {
    super(authService);
    this.product = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    if (this.product.Id)
      this.selectedProductIndex = this.router!.getCurrentNavigation()!.extras!.state!['extraParams'];
  }

  ngOnInit() {
    this.getUserConnections();
  }
  async getUserConnections() {
    this.userConnections = await this.connectionsService.getUserConnections();
    this.loaded = true;
  }

}
