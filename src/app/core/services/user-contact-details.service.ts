import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Subject } from 'rxjs';
import * as config from 'src/app/core/models/config/ApiMethods';
import { CommentDto, CommentReplyDto } from '../models/post/commentDto';
import { Post } from '../models/post/post';
import { UserTrait } from '../models/post/userTrait';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class UserContacvtDetailsService {
  postData: Subject<any> = new Subject();
  postTraits: Subject<any> = new Subject();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  //post
  getByUserId(userId?: string) {
    return new Promise<Array<Post>>((resolve, reject) => {
      var url = config.API.USER_PROFILE.CONTACT.GET + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
         
        resolve(response.ResponseData[0]);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  editUsername(username?: string, password?: string) {
    return new Promise<Array<Post>>((resolve, reject) => {
      const body = {
        username,
        password
      }
      var url = config.API.USER_PROFILE.EDIT_USERNAME.POST;
      return this.http.post<any>(url, body).subscribe((response: any) => {
         
        resolve(response.ResponseData[0]);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }
}
