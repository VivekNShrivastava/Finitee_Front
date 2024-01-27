import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-work-section',
  templateUrl: './work-section.component.html',
  styleUrls: ['./work-section.component.scss'],
})
export class WorkSectionComponent implements OnInit {
  constructor(private alertController: AlertController) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Experience',
      message: 'Are you sure you want to delete this work experience?',
      cssClass: 'profile-alert',
      buttons: [
        {
          text: 'YES',
          role: 'yes',
          cssClass: 'profile-alert-yes-button',
        },
        {
          text: 'NO',
          role: 'no',
          cssClass: 'profile-alert-no-button',
        },
        {
          text: '',
          role: 'cancel',
          cssClass: 'profile-alert-close-button',
        },
      ],
    });

    await alert.present();
  }

  ngOnInit() {}
}
