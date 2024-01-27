import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Product } from 'src/app/core/models/product/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { CreatedByDto } from 'src/app/core/models/user/createdByDto';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.page.html',
  styleUrls: ['./add-edit-product.page.scss'],
})
export class AddEditProductPage extends BasePage implements OnInit {
  product: Product = new Product();
  saveClicked: boolean = false;
  isEdit: boolean = false;
  editItemIndex!: number;
  constructor(
    private router: Router,
    private businessCanvasService: BusinessCanvasService,
    private commonService: CommonService,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    super(authService);
    this.product = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    if (this.product.Id) {
      this.editItemIndex = this.router!.getCurrentNavigation()!.extras!.state!['extraParams'];
      this.isEdit = true;
      this.product.Privacy = this.commonService.getPrivacyFullValue(this.product.Privacy);
    }
    else
      this.product.Privacy = this.appConstants.GeneralPivacy[0].value;
  }


  ngOnInit(): void {
    this.initiliazeForm();
  }


  initiliazeForm() {
    this.saveClicked = false;
  }

  allTraits(traits: any) {
    this.product.Traits = traits;
  }

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.product.ProductImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.product.ProductImages.push(filePath);
    else
      this.product.ProductImages[this.product.ProductImages.length - 1] = filePath;
  }

  validateForm(product: Product) {
    var valid = true;
    console.log("product", product);
    if (product.Title == "" || product.ProductImages.length == 0)
      valid = false;
    return valid;
  }

  async saveProduct() {
    this.saveClicked = true;
    var isFormValid = this.validateForm(this.product);
    if (isFormValid) {
      var uploadFileInprogress = _.filter(this.product.ProductImages, function (v) {
        return v.indexOf("localhost") != -1
      });

      if (uploadFileInprogress.length) {
        this.commonService.presentToast("Please wait! File upload is inprogress");
        return;
      }
      //this.product.UserId = this.logInfo.UserId;
      this.product.Privacy = this.product.Privacy.substring(0, 1);
      if (this.isEdit) {
        var result = await this.businessCanvasService.saveProduct(this.product);
        if (result)
          this.businessCanvasService.businessData.next({ type: "edit_product", index: this.editItemIndex, data: this.product });
        //this.businessCanvasService.products[this.editItemIndex] = this.product; 
      }
      else {
        var result = await this.businessCanvasService.saveProduct(this.product);
        if (result) {
          this.product.Id = result;
          this.product.CreatedBy = this.getCreatedByData();
          this.businessCanvasService.businessData.next({ type: "add_product", data: this.product });
        }
      }
      this.navCtrl.pop();

    }
    else {
      //alert("error");
    }
  }

  selectedPrivacy(data: any) {
    this.product.Privacy = data.detail.value;
  }



}
