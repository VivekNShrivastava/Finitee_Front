import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { NgOtpInputModule } from 'ng-otp-input';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { SelectSearchableComponent } from 'src/app/core/components/select-searchable/select-searchable.component';
import { PinLocationComponent } from 'src/app/core/components/pin-location/pin-location.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    NgOtpInputModule,
    // RecaptchaV3Module,
    // RecaptchaModule,
    // RecaptchaFormsModule,
    SelectSearchableComponent,
    PinLocationComponent
  ],
  // providers: [
  //   {
  //     provide: RECAPTCHA_V3_SITE_KEY,
  //     useValue: environment.captchaSiteKey,
  //   },
  // ],
  declarations: [RegisterPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPageModule {}
