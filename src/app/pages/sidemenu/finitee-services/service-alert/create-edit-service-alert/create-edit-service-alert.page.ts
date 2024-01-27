import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAlertWord } from 'src/app/core/models/finitee-services/finitee.services';
import { FiniteeServicesService } from 'src/app/core/services/finitee-services/finitee.service';

@Component({
  selector: 'app-create-edit-service-alert',
  templateUrl: './create-edit-service-alert.page.html',
  styleUrls: ['./create-edit-service-alert.page.scss'],
})
export class CreateEditServiceAlertPage implements OnInit {

  ServiceAlertWords: ServiceAlertWord[] = [
    new ServiceAlertWord(),
    new ServiceAlertWord(),
    new ServiceAlertWord(),
    new ServiceAlertWord(),
    new ServiceAlertWord(),
  ];
  constructor(private finiteeService: FiniteeServicesService, private router: Router) { }

  ngOnInit() {
  } 

  ionViewWillEnter() {
    this.ServiceAlertWords = this.finiteeService.ServiceAlertWords
    this.fillEmptyItems();

  }

  fillEmptyItems() {
    const emptyItemCount = 5 - this.ServiceAlertWords.length;
    if (emptyItemCount > 0) {
      for (let i = 0; i < emptyItemCount; i++) {
        this.ServiceAlertWords.push(new ServiceAlertWord());
      }
    }
  }
  async submit() {
    this.finiteeService.ServiceAlertWords = this.ServiceAlertWords.filter(item => item.TraitWord.trim() !== '');
    const result = await this.finiteeService.updateServiceAlertWords(this.finiteeService.ServiceAlertWords);
    if (result) {
      this.router.navigateByUrl('/service-alert')
    }
  }
}

 