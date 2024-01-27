import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.page.html',
  styleUrls: ['./rolodex.page.scss'],
})
export class RolodexPage extends BasePage implements OnInit, OnDestroy {
  isContentHide: any = false;
  constructor(
    private authService: AuthService,) {
    super(authService);
  }


  async ngOnInit() {

  }

  async startScan() {
    this.isContentHide = true;
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
    document.querySelector('body')!.classList.add('scanner-active');

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      document.querySelector('body')!.classList.remove('scanner-active');
      this.isContentHide = false;
      alert(result.content);
      console.log(result.content); // log the raw scanned content
    }
  };

  async ngOnDestroy() {
    await BarcodeScanner.stopScan();
    document.querySelector('body')!.classList.remove('scanner-active');
  }

}
