import { Component, OnInit } from '@angular/core';
import { Post, AddPostRequest, Media } from 'src/app/core/models/post/post';



@Component({
  selector: 'app-add-post-test',
  templateUrl: './add-post-test.page.html',
  styleUrls: ['./add-post-test.page.scss'],
})
export class AddPostTestPage  implements OnInit {
  post: Post = new Post;
  photo: any[] = [];
  fileToUpload: any[] = [];


  constructor() { }

  ngOnInit() {
  }

 
  fileToUploadToServer(mediaObj: any) {
    // Update the array reference
    this.fileToUpload = [...this.fileToUpload, mediaObj];
  }
  imagePathMedia(imagePath: any){
    this.photo.push(imagePath);
  }

  addMedia(filePath: any) {
    if (filePath.indexOf("delete") != -1) {
      var filePathSplit = filePath.split("-");
      this.post.PostImages.splice(parseInt(filePathSplit[1]), 1)
    }
    else if (filePath.indexOf("localhost") != -1 || filePath.indexOf(";base64") != -1)
      this.post.PostImages.unshift(filePath);
    else
      this.post.PostImages[0] = filePath;
  }
}
