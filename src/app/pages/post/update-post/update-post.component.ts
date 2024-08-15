import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/core/services/post.service';


@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
})
export class UpdatePostComponent implements OnInit {
  
  paramsData: any;

  constructor(
    private router: Router,
    private postServies: PostService

  ) { }

  ngOnInit() {
    if (this.router?.getCurrentNavigation()?.extras.state) {
      this.paramsData = this.router?.getCurrentNavigation()?.extras.state;
      console.log("paramsdata",this.paramsData);
    }
  }

  async edit_post(){
    const res = await this.postServies.UpdatePost(this.paramsData.selectedPost.PostDescription, this.paramsData.selectedPost.Id)
    console.log("res", res);
    if(res) this.paramsData.selectedPost.IsEdited = true;
    this.router.navigateByUrl("post/view-post");

  }
  addMedia(filePath: string) {
    // if (filePath.indexOf("delete") != -1) {
    //   var filePathSplit = filePath.split("-");
    //   this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    // }
    // else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
    //   this.post.PostImages.unshift(filePath);
    // else
    //   this.post.PostImages[0] = filePath;

    // console.log("len", this.post.PostImages.length);
  }



}
