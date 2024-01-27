import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-notification-icon',
  templateUrl: './app-notification-icon.component.html',
  styleUrls: ['./app-notification-icon.component.scss'],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppNotificationIconComponent implements OnInit {
  notifiactionsCount: any = 0;
  constructor(private commonService: CommonService, private _storageService: StorageService) { }

  ngOnInit() {
    this.getAllNotification();
  }

  getAllNotification() {
    var notifiactions = this._storageService.ReadNotification(this.commonService.getTodayDate());
    if (notifiactions)
      this.notifiactionsCount = notifiactions.length;
  }

  openNotofications() {
    this.commonService.navigatePage("notifications");
  }

}
