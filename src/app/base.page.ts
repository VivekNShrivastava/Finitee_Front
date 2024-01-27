import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppConstants } from './core/models/config/AppConstants';
import { FiniteeUser } from './core/models/user/FiniteeUser';
import { AuthService } from './core/services/auth.service';
import { AlertController } from '@ionic/angular';
import { CreatedByDto } from './core/models/user/createdByDto';
// import * as lodash from 'lodash';
import lodash from 'lodash'

export class BasePage {
  lodash: any = lodash;
  readonly appConstants: any = AppConstants;
  logInfo: FiniteeUser = new FiniteeUser();
  navEx: NavigationExtras = {
    state: {
      data: null,
      extraParams: null
    }
  };
  constructor(authService: AuthService) {
    this.logInfo = authService.getUserInfo();
    console.log("a", this.logInfo);
  }

  getCreatedByData() {
    var createdBy = new CreatedByDto();
    createdBy.Id = this.logInfo.UserId;
    createdBy.DisplayName = this.logInfo.DisplayName;
    createdBy.ProfileImage = this.logInfo.UserProfilePhoto;
    createdBy.UserName = this.logInfo.UserName;
    createdBy.UserTypeId = this.logInfo.UserTypeId;
    return createdBy;
  }

}
