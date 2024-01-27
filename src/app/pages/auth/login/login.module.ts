import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SelectSearchableComponent } from 'src/app/core/components/select-searchable/select-searchable.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
// import { SelectSearchableComponent } from 'src/app/core/components/select-searchable/select-searchable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    SelectSearchableComponent,
    NgOtpInputModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  declarations: [LoginPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPageModule {}
