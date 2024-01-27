import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-business-product-modal',
  templateUrl: './business-product-modal.page.html',
  styleUrls: ['./business-product-modal.page.scss'],
})
export class BusinessProductModalPage implements OnInit {
  constructor(private router: Router, private modalCtrl: ModalController) {}

  ngOnInit() {}

  editProduct() {
    this.router.navigateByUrl('/tabs/home/business-screen--own/edit-product');
    this.modalCtrl.dismiss(null, 'cancel').then((r) => r);
  }
  
  deleteProduct(){
    
  }
}
