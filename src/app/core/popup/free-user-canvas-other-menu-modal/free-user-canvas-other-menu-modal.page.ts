import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-free-user-canvas-other-menu-modal',
  templateUrl: './free-user-canvas-other-menu-modal.page.html',
  styleUrls: ['./free-user-canvas-other-menu-modal.page.scss'],
})
export class FreeUserCanvasOtherMenuModalPage implements OnInit {
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  referUserPage() {
    this.modalCtrl.dismiss(null, 'cancel').then((r) => r);
    this.router
      .navigateByUrl('/tabs/home/free-user-canvas-other/refer-user')
      .then((r) => r);
  }

  async openBlockUserAlert() {
    const alert = await this.alertController.create({
      header: 'Block user',
      message:
        'You are about to block <span>Luther Wilson</span>. Are you sure?',
      cssClass: 'block-user-alert',
      buttons: [
        {
          text: 'YES',
          role: 'yes',
          cssClass: 'block-user-alert-yes-button',
        },
        {
          text: 'NO',
          role: 'no',
          cssClass: 'block-user-alert-no-button',
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'block-user-alert-close-button',
        },
      ],
    });

    await alert.present();
    this.modalCtrl.dismiss(null, 'cancel').then((r) => r);
  }

  async openReportUserAlert() {
    const alert = await this.alertController.create({
      header: 'Report user',
      message: 'Luther Wilson',
      cssClass: 'report-user-alert',
      inputs: [
        {
          type: 'textarea',
          placeholder: 'Type your reason here..',
          cssClass: 'report-user-alert-textarea',
        },
      ],
      buttons: [
        {
          text: 'Send report',
          role: 'OK',
          cssClass: 'report-user-alert-send-button',
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'report-user-alert-close-button',
        },
      ],
    });

    await alert.present();
    this.modalCtrl.dismiss(null, 'cancel').then((r) => r);
  }
}
