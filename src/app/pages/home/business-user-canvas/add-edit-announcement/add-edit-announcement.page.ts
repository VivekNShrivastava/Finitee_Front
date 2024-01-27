import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Announcement } from 'src/app/core/models/announcement/announcement';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';

@Component({
  selector: 'app-add-edit-announcement',
  templateUrl: './add-edit-announcement.page.html',
  styleUrls: ['./add-edit-announcement.page.scss'],
})
export class AddEditAnnouncementPage extends BasePage implements OnInit {
  announcement: Announcement = new Announcement();
  saveClicked: boolean = false;
  isEdit: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private businessCanvasService: BusinessCanvasService,
    private navCtrl: NavController
  ) {
    super(authService);
    this.announcement = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    if (this.announcement.Id) {
      this.isEdit = true;
    }
  }

  ngOnInit() { }

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.announcement.Images.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.announcement.Images.push(filePath);
    else
      this.announcement.Images[this.announcement.Images.length - 1] = filePath;
  }

  validateForm(announcement: any) {
    var valid = true;
    for (var key in announcement) {
      if (announcement.hasOwnProperty(key)) {
        var val = '';
        if (key == "AnnouncementId" || key == "AnnouncementDescription")
          val = announcement[key];
        if (val == '') {
          valid = false;
          break;
        }
      }
    }
    return valid;
  }

  async saveAnnouncement() {
    this.saveClicked = true;

    //var isFormValid = this.validateForm(this.announcement);
    if (this.announcement.AnnouncementDescription != "" && this.announcement.AnnouncementTitle != "") {
      if (this.isEdit) {
        var result = await this.businessCanvasService.saveAnnouncement(this.announcement);
        /*  if (result)
           this.announcements[0] = this.announcement; */
      }
      else {
        var result = await this.businessCanvasService.saveAnnouncement(this.announcement);
        if (result) {
          this.announcement.Id = result;
          //this.announcements.push(this.announcement);
        }
      }
      this.navCtrl.pop();
    }
    else {

    }
  }
}
