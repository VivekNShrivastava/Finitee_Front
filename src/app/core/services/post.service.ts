import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { Subject } from 'rxjs';
import * as config from 'src/app/core/models/config/ApiMethods';
import { CommentDto, CommentReplyDto } from '../models/post/commentDto';
import { Post } from '../models/post/post';
import { UserTrait, UserTraitWithPost } from '../models/post/userTrait';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  postDataSbj: Subject<any> = new Subject();
  traitpostData: Subject<any> = new Subject();
  postTraits: Subject<any> = new Subject();
  traitList: Subject<any> = new Subject();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  //post
  getPostByBelongsToId(traitOrProductId: string) {
    return new Promise<Array<Post>>((resolve, reject) => {
      var url = config.API.POST.GET_ALL_BY_BELONGSTO + "/" + traitOrProductId;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //post
  getPostByUserId(userId: string, type: string) {
    return new Promise<Array<Post>>((resolve, reject) => {
      var url = config.API.POST.GET_ALL_BY_USER + "/" + userId + "/" + type;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //create post
  createPost(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.SAVE, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.POST_CREATED);
        resolve(response.ResponseData.PostId);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  UpdatePost(PostDescription: string, PostId: string) {
    return new Promise<any>((resolve, reject) => {
      const description = { 
        PostDescription,
        PostId
      }
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.UPDATE_POST, description).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.POST_UPDATED);
        resolve(response.ResponseData.PostId);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  getPostByPostId(postId: string) {
    return new Promise<Post>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.get<any>(config.API.POST.GET + "/" + postId).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(response.ResponseData);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  favorToggle(data: any) {
    return new Promise<any>((resolve) => {
      //this.commonService.showLoader();
      return this.http.put<any>(config.API.POST.FAVOR + "/" + data.Id + "/" + data.CreatedBy.Id + "/" + data.FavouredByCU, {}).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(true);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }

  commentfavorToggle(data: any) {
    return new Promise<any>((resolve) => {
      //this.commonService.showLoader();
      return this.http.put<any>(config.API.POST.COMMENT_FAVOR + "/" + data.Id + "/" + data.CreatedBy.Id + "/" + data.FavouredByCU, {}).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(true);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          resolve(false);
        }
      );
    });
  }
  //delete post
  deletePost(postId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(config.API.POST.DELETE + "/" + postId).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.POST_DELETED);
        resolve(true);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //beam post
  beamPost(postId: string) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.BEAM + "/" + postId, {}).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.POST_BEAMED);
        resolve(true);
        //send count in response, do same as in favour
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }



  ////coments
  getCommentsByPostId(postId: string, userId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.POST.GET_ALL_COMMENTS + "/" + postId + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  getCommentReplies(CommentId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.POST.GET_COMMENT_REPLIES + "/"+ CommentId ;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  getTopPostCommentReplies(CommentId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.POST.GET_TOP_REPLIES + "/"+ CommentId ;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }


  addUpdateComment(comment: CommentDto) {
    return new Promise<any>((resolve, reject) => {
      return this.http.post<any>(config.API.POST.SAVE_COMMENT, comment).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  ////reply
  addUpdateCommentReply(commentReply: CommentReplyDto, id: any) {
    return new Promise<any>((resolve, reject) => {
      return this.http.post<any>(config.API.POST.SAVE_REPLY + "/" + id, commentReply).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  deleteComment(id: any, postId: any) {
    return new Promise<any>((resolve, reject) => {
      return this.http.delete<any>(config.API.POST.DELETE_COMMENT + "/" + id + "/" + postId).subscribe((response: any) => {
        resolve(response);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  deleteCommentReply(id: any, postId: any) {
    return new Promise<any>((resolve, reject) => {
      return this.http.delete<any>(config.API.POST.DELETE_COMMENT_REPLY + "/" + id + "/" + postId).subscribe((response: any) => {
        resolve(response);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //post
  getUserTraitWithPost(userId: any) {
    return new Promise<Array<UserTraitWithPost>>((resolve, reject) => {
      var url = config.API.POST.GET_USER_TRAITS_WITH_COUNT_AND_SERIALIZED + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }


  getUserTrait(userId: any) {
    return new Promise<Array<UserTrait>>((resolve, reject) => {
      var url = config.API.POST.GET_USER_TRAITS + "/" + userId;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  //add user trait
  saveUserTrait(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.SAVE_USER_TRAIT, body).subscribe((response: any) => {
        this.commonService.hideLoader();
        this.commonService.presentToast(AppConstants.TOAST_MESSAGES.TRAIT_POST_CREATED);

        resolve(response.ResponseData);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  deleteUserTrait(id: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.showLoader();
      return this.http.delete<any>(config.API.POST.DELETE_USER_TRAIT + "/" + id).subscribe((response: any) => {
        this.commonService.hideLoader();
        resolve(response);
      },
        (error) => {
          this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }


  ////donation post payemnts
  getDonationCalimsOnPost(postId: string) {
    return new Promise<any>((resolve, reject) => {
      var url = config.API.POST.DONATION_CLAIMS_LIST + "/" + postId;
      return this.http.get<any>(url).subscribe((response: any) => {
        resolve(response.ResponseData);
      },
        (error) => {
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  madeDonation(postId: string) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.MADE_DONATION + "/" + postId, {}).subscribe((response: any) => {
        //this.commonService.hideLoader();
        resolve(response.ResponseData);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  donationConfimAction(postId: string, userIdWhoMadePayment: string, status: string) {
    return new Promise<any>((resolve, reject) => {
      //this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.DOANTION_CLAIM_ACTION + "/" + postId + "/" + userIdWhoMadePayment + "/" + status, {}).subscribe((response: any) => {
        //this.commonService.hideLoader();
        resolve(response.ResponseData);
      },
        (error) => {
          //this.commonService.hideLoader();
          console.log("abc error", error.error.text);
          this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
          reject(false);
        }
      );
    });
  }

  inviteToViewPost(InvitedUsers: string[], postId: string) {
    return new Promise<any>((resolve, reject) => {
      // var url = config.API.POST.DONATION_CLAIMS_LIST;
      var payload = {
        InvitedUsers,
        postId
      }
      return this.http.post<any>(config.API.POST.INVITE_TO_VIEW_POST, payload).subscribe((response: any) => {
        resolve(response.ResponseData);
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
