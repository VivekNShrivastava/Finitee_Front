import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage extends BasePage implements OnInit {

  subscription!: Subscription;
  menuItemList: Array<string> = [];
  constructor(
    private attachmentService: AttachmentHelperService,
    public businessCanvasService: BusinessCanvasService,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    super(authService);
  }

  async ngOnInit() {
    this.menuItemList = await this.businessCanvasService.getMenuItemList(this.logInfo.UserId, this.logInfo.UserId);
  }


  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.menuItemList.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.menuItemList.push(filePath);
    else
      this.menuItemList[this.menuItemList.length - 1] = filePath;
  }



  async saveMenuItems() {
    if (this.menuItemList.length > 0) {
      var res = await this.businessCanvasService.saveMenuItem(this.menuItemList);
      if (res) {
        this.businessCanvasService.businessData.next({ type: "add_menulist", data: this.menuItemList });
        this.navCtrl.pop();
      }
    }
  }

}
