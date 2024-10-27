import { Injectable } from '@angular/core';
import { AddPostRequestForWeb, AddPostRequest } from '../../models/post/post';
import * as config from 'src/app/core/models/config/ApiMethods';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { CommonService } from '../common.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class VideoCropCompressService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  cropVideoForWeb(postRequestForWeb: AddPostRequestForWeb, fileNames: string[]){
    const formData = new FormData();
    formData.append('Post', JSON.stringify(postRequestForWeb.post));
    formData.append('AspectRatio', JSON.stringify(postRequestForWeb.AspectRatio));
    formData.append('cropAreas', JSON.stringify(postRequestForWeb.cropAreas));
    formData.append('Passcode', "THIS_IS_A_WEB_ONLY_API_FOR_DEVS");

    console.log("Pre formData", postRequestForWeb.media);


    for(let i =0 ; i < postRequestForWeb.media.length; i++){
      formData.append('file', postRequestForWeb.media[i], fileNames[i]);
    }

    console.log("formData", formData);

    return new Promise<any>((resolve,reject)=>{
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.ADD_POST_WEB, formData).subscribe((response: any) => {
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
    })
  }


  
  addPost(postRequest: AddPostRequest, fileNames: string[]){
    const formData = new FormData();
    formData.append('Post', JSON.stringify(postRequest.post));
    formData.append('AspectRatio', JSON.stringify(postRequest.AspectRatio));
    console.log("Pre formData", postRequest.media);


    for(let i =0 ; i < postRequest.media.length; i++){
      formData.append('file', postRequest.media[i], fileNames[i]);
    }

    console.log("formData", formData);

    return new Promise<any>((resolve,reject)=>{
      this.commonService.showLoader();
      return this.http.post<any>(config.API.POST.SAVE, formData).subscribe((response: any) => {
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
    })
  }

  

  // getEventInviteRequestList(eventId: string) {
  //   return new Promise<any>((resolve, reject) => {
  //     return this.http.get<any>(`${config.GET_REQ_LIST_BY_ID}/${eventId}`).subscribe({
  //       next: (response: any) => {
  //         resolve(response.ResponseData);
  //       },
  //       error: (error) => {
  //         console.log("abc error", error.error.text);
  //         this.commonService.presentToast(AppConstants.TOAST_MESSAGES.SOMETHING_WENT_WRONG);
  //         reject(false);
  //       },
  //       complete: () => {
  //         console.log("Request completed");
  //       }
  //     });
  //   });
  // }
  


}
