import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonResponse } from 'src/app/core/models/CommonResponse';
import { Country } from '../models/places/Country';
import { CommonService } from './common.service';
import * as config from 'src/app/core/models/config/ApiMethods';
import { catchError } from 'rxjs';
import { APIService } from './api.service';
import { State } from '../models/places/State';
import { City } from '../models/places/City';
import { BasicUser } from '../models/user/BasicUser';
import { AppConstants } from '../models/config/AppConstants';
import { formatDate } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    public commonService: CommonService,
    public apiService: APIService,
    private storageService: StorageService
  ) {
  }

  processRegistrationObj(user: any) {
    // user.u_titl = "";
    // if (user.u_gd > AppConstants.GENDER.NOT_SET) {
    //   user.u_titl = user.u_gd == AppConstants.GENDER.MALE ? "Mr." : (user.u_gd == AppConstants.GENDER.FEMALE ? "Ms." : "" );
    // }

    if (user.DateOfBirth) {
      user.DateOfBirth = formatDate(user.DateOfBirth, 'yyyy-MM-dd', "en-US");
    }
    if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER) {
      user.DisplayName = user.FirstName + " " + user.LastName;
    }
  }

  /** Get All Countries List */
  public registerIndividualUser(): void {
    // this.apiService.registerIndividualUser()
    // .subscribe(response => {

    // });
  }


  public async updateTempUser(user: any, step: number) {
    await this.storageService.storeTempUser(user, step);
  }

  public deleteTempUser() {
    this.storageService.clearTempUser();
  }

  public async getTempUser() {
    return await this.storageService.getTempUser();
  }


}
