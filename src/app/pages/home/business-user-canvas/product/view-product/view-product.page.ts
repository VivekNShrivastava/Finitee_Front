import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { Product } from 'src/app/core/models/product/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { InflowsService } from 'src/app/core/services/inflows/inflows.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-product-screen',
  templateUrl: './view-product.page.html',
  styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage extends BasePage implements OnInit {
  selectedProductIndex: number = 0;
  product: any = new Product();
  postList: Array<Post> = [];

  postSaveSubscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private businessService: BusinessCanvasService,
    private authService: AuthService,
    private navCtrl: NavController,
    private _postService: PostService,
    private _inflowService: InflowsService
  ) {
    super(authService);
    this.product = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    if (this.product.Id)
      this.selectedProductIndex = this.router!.getCurrentNavigation()!.extras!.state!['extraParams'];
  }

  ngOnInit() {
    var p1 = this.businessService.getProductByProductId(this.product.Id!);
    var p2 = this._postService.getPostByBelongsToId(this.product.Id!);
    Promise.all([p1, p2]).then(async (data) => {
      console.log(data);
      this.product = data[0];
      this.postList = data[1];
    });
    this.subscribePostSubject();
  }

  subscribePostSubject() {
    this._postService.postDataSbj.subscribe({
      next: (result: any) => {
        console.log(`observerA: ${result}`);
        if (result.event == "ADD")
          this.postList.unshift(result.data);
        else if (result.event == "DELETE") {
          var deletedPostId = result.data;
          var deletedPostIndex = _.findIndex(this.postList, { Id: deletedPostId });
          this.postList.splice(deletedPostIndex, 1);
        }
      }
    });
  }


  async openProductOption() {
    var buttons = [
      {
        text: 'Edit privacy',
        icon: 'privacy',
        cssClass: 'product-option-action-sheet-button',
        data: 'edit privacy',
      },
      {
        text: 'Edit product',
        icon: 'edit-product',
        cssClass: 'product-option-action-sheet-button',
        data: 'edit product',
      },
      {
        text: 'Delete',
        icon: 'delete-product',
        cssClass: ['product-option-action-sheet-button', 'red-text'],
        data: 'delete',
      },
    ];

    if (this.product.CreatedBy.Id != this.logInfo.UserId) {
      buttons = [
        {
          text: 'Start receiving inflows',
          icon: 'inflowset',
          cssClass: 'product-option-action-sheet-button',
          data: 'inflows',
        },
        {
          text: 'Recommend',
          icon: 'business-recommend',
          cssClass: 'product-option-action-sheet-button',
          data: 'recommend',
        }
      ];

      if (this.product.IsInflowsStarted) {
        buttons[0].text = "Stop receiving inflows";
        buttons[0].icon = "inflowsred";
      }
    }

    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'product-option-action-sheet',
      buttons: buttons
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    var aresult = JSON.stringify(result);
    if (result.data == 'recommend') {
      await this.openRecommendBusinessScreen();
    } else if (result.data == 'delete') {
      this.deleteProduct();
    } else if (result.data == 'edit product') {
      this.editProduct();
    } else if (result.data == 'edit privacy') {
      this.editPrivacy(this.product.Id);
    } else if (result.data == 'inflows') {
      var response = await this._inflowService.startStopRecivingInflows(this.product.Id, !this.product.IsInflowsStarted);
      if (response)
        this.product.IsInflowsStarted = !this.product.IsInflowsStarted;
    }
  }

  async deleteProduct() {
    await this.businessService.deleteProduct(this.product.Id);
    //this.products.splice(this.selectedProductIndex, 1);
    this.navCtrl.pop();
  }

  editProduct() {
    this.navEx!.state!['data'] = this.product;
    this.navEx!.state!['extraParams'] = this.selectedProductIndex;
    this.router.navigateByUrl('business/add-edit-product', this.navEx);
  }

  editPrivacy(productId: any) {
    this.router.navigateByUrl(`business/edit-privacy/${productId}`);
  }

  openPostScreen(post: any) {
    this.navEx!.state!['postlist'] = this.postList;
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.PINTREST;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  addPostScreen() {
    this.navEx!.state!['data'] = { belongsToId: this.product.Id, Type: this.appConstants.POST_TYPE.Product };
    this.router.navigateByUrl(`post/add-post`, this.navEx);
  }

  openRecommendBusinessScreen() {
    this.navEx!.state!['data'] = this.product;
    this.navEx!.state!['extraParams'] = this.selectedProductIndex;
    this.router.navigateByUrl('business/recommend-product', this.navEx);
  }

  ngDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this._postService.postDataSbj) {
      this._postService.postDataSbj.unsubscribe();
    }
  }
}
