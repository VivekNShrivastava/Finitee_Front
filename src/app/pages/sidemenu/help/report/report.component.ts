import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BasePage } from 'src/app/base.page';
import { Post } from 'src/app/core/models/post/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessCanvasService } from 'src/app/core/services/canvas-home/business-canvas.service';
import { PostService } from 'src/app/core/services/post.service';
import _ from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { ReportService } from 'src/app/core/services/report.service';
import { genricReport } from 'src/app/core/models/report';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent extends BasePage implements OnInit {
  post: Post = new Post;
  paramsData: any;
  BelongsToId!: string;
  saveClicked: boolean = false;
  user: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private businessService: BusinessCanvasService,
    public _commonService: CommonService,
    private postService: PostService,
    private reportService: ReportService) {
    super(authService);
    this.user = this.authService.getUserInfo();

    // this.paramsData = this.router!.getCurrentNavigation()!.extras!.state!['data'];

    if (this.post.Privacy)
      this.post.Privacy = this._commonService.getPrivacyFullValue(this.post.Privacy);
    else
      this.post.Privacy = this.appConstants.GeneralPivacy[0].value;
  }

  ngOnInit() {
  }

  addMedia(filePath: string) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.post.PostImages.unshift(filePath);
    else
      this.post.PostImages[0] = filePath;
  }

  async savePost() {
    this.saveClicked = true;

    var uploadFileInprogress = _.filter(this.post.PostImages, function (v) {
      return v.indexOf("localhost") != -1
    });

    if (uploadFileInprogress.length) {
      this._commonService.presentToast("Please wait! File upload is inprogress");
      return;
    }
    if (this.post.PostDescription || this.post.PostImages.length > 0) {
      if (this.paramsData) {
        if (this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT) {
          if (this.paramsData.belongsToId == "") {
            var res = await this.postService.saveUserTrait(this.paramsData.TraitRequest);
            if (res)
              this.paramsData.belongsToId = res.TraitId.toString();
          }
        }
        this.post.BelongsToId = this.paramsData.belongsToId.toString();
        this.post.Type = this.paramsData.Type;
      }
      console.log(this.post);
      var result = await this.postService.createPost(this.post);
      if (result) {
        this.post["Id"] = result;
        this.post.CreatedBy = this.getCreatedByData();
        this.postService.postDataSbj.next({ event: "ADD", data: this.post, isTraitPost: this.paramsData.Type == this.appConstants.POST_TYPE.TRAIT ? true : false });
        if (this.paramsData && this.paramsData.Trait) {//individual tarit post section screen
          this.postService.traitpostData.next({ event: "ADD", data: this.post });
        }
      }
      this.navCtrl.pop();
    }
  }

  selectedPrivacy(data: any) {
    this.post.Privacy = data.detail.value;
  }

  async sendReport( ) {
    console.log("Report sent...")

    var newGenricReport = new genricReport();

    newGenricReport.UserId = this.user.UserId;
    newGenricReport.Title = this.post.Title;
    newGenricReport.Description = this.post.PostDescription;
    // newGenricReport.PostImages = this.

    var res = this.reportService.genricReport(newGenricReport)
    console.log(res);
  }
}



