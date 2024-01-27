import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifiactions: any = [];
  constructor(private nav: NavController, private commonService: CommonService, private _storageService: StorageService) { }


  ngOnInit() {
    this.getAllNotification();
  }

  getAllNotification() {
    this.notifiactions = this._storageService.ReadNotification(this.commonService.getTodayDate());
    console.log("noti", this.notifiactions);
  }

  back() {
    this.nav.pop()
  }
}
