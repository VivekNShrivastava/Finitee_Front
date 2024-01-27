import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { FiniteeServicesService } from "src/app/core/services/finitee-services/finitee.service";
import { BasePage } from "src/app/base.page";
import { ServiceAlertWord } from "src/app/core/models/finitee-services/finitee.services";

@Component({
  selector: "app-service-alert-main",
  templateUrl: "./service-alert-main.page.html",
  styleUrls: ["./service-alert-main.page.scss"],
})
export class ServiceAlertMainPage implements OnInit {


  constructor(private router: Router, private alertCtrl: AlertController, public finiteeService: FiniteeServicesService) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    const result = await this.finiteeService.getServiceAlertByUser();
    if (result) {
      this.finiteeService.ServiceAlertWords = result;
    }
  }

  async deleteTraitWord(id: any) {
      
    const alert = await this.alertCtrl.create({
      header: "Delete",
      message: "Are you sure you want to delete this service alert trait word?",
      buttons: [
        {
          text: "Keep",
          cssClass: "info",
        },
        {
          text: "Delete",
          cssClass: "danger",
          handler: async () => {
            try {
              await alert.present();
              const result = await this.finiteeService.deleteServiceAlertById(id);
              if (result) {
                const index = this.finiteeService.ServiceAlertWords.findIndex(item => item.Id === id);
                if (index !== -1) {
                  this.finiteeService.ServiceAlertWords.splice(index, 1);
                }
              }
            } catch (error) {
              // Handle errors if needed
            }
          },
        },
      ],
    });
    await alert.present();


  }
  viewMatchedResult() {
    this.router.navigateByUrl('service-alert/service-alert-matches-list')
  }
  edit() {
    this.router.navigateByUrl('service-alert/create-edit-service-alert')
  }

}
