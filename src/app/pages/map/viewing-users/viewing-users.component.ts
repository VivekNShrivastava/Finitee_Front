import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { FiniteeUserOnMap } from 'src/app/pages/map/models/MapSearchResult';
import { environment } from 'src/environments/environment';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { NavigationExtras, Router } from '@angular/router';
import { MapService } from '../services/map.service';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { GreetingViewComponent } from '../greeting-view/greeting-view.component';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ReportService } from 'src/app/core/services/report.service';
import { userReport } from 'src/app/core/models/report';

export enum GreetingCode {
  GreetingSend = 'Send',
  GreetingAccept = 'Accept',
  GreetingReject = 'Reject',
  GreetingBlock = 'Block'
}

@Component({
  selector: 'viewing-users',
  templateUrl: './viewing-users.component.html',
  styleUrls: ['./viewing-users.component.scss'],
})
export class ViewingUsersComponent extends BasePage implements OnInit, OnDestroy {
  public viewType: number = 1;
  public activeOrExpired: number = 1;
  public activeRequestCount: number = 0;
  public activeRequestCount1: number = 0;
  public viewTemplate: string = "";
  public viewList: any = [];
  public greetList: any = [];
  public attachmentURL = environment.attachementUrl;
  public greetingListApi: any = [];
  public filteredGreetingList: any = [];
  textColor: string | undefined;
  loaded: boolean = false;
  greetStatus: string | undefined ;
  modalCanDismiss: boolean = false;
  constructor(
    public _commonService: CommonService,
    public navParams: NavParams,
    public _modalController: ModalController,
    private firestoreService: FirestoreService,
    public router: Router,
    private mapService: MapService,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    private reportService: ReportService
  ) {
    super(authService);
    const res = this.navParams.get('template');
    this.modalCanDismiss = this.navParams?.data?.['modal']?.['canDismiss'];
    console.log(this.modalCanDismiss)

    this.viewTemplate = res;
    console.log("view", this.viewTemplate)
    
    // if(this.viewTemplate === "Greeting") this.getUserGreetingHistory();

    // this.firestoreService.viewList$.subscribe(updatedData => {
    //   console.log("map updated data", updatedData);
    //   this.viewList = updatedData;
    // });



    this.firestoreService.greetingList$.subscribe(updatedData => {
      console.log("map updated data", updatedData);
      this.greetList = updatedData;
      if (this.viewTemplate === "Greeting") this.getUserGreetingHistory();
    });
  }

  ngOnInit() {}

  ngOnDestroy(){
    this.updateFirebaseGreeting();
  }

  goBack() {
    this._modalController.dismiss();
  }

  public handleClose(data: any): void {
    this.goBack();
    this.dismissModal();
    if(data === 'accepted'){
      setTimeout(() => {
        this.goBack();
      }, 1500)
    } 
  }

  changeIcon(status: any) {
    let iconName = 'acceptedgreendot';
    this.greetStatus = 'Accepted';
    this.textColor = 'green';
    if (status === 'E') {
      iconName = 'timeouticon';
      this.textColor = 'darkviolet';
      this.greetStatus = 'Timed Out';
      return iconName;
    } else if (status === 'R') {
      iconName = 'reddoticongreeting';
      this.textColor = 'red';
      this.greetStatus = 'Rejected';
      return iconName;
    }

    return iconName;
  }

  async updateFirebaseGreeting() {
    const res = await this.mapService.updateFirebaseGreeting();
  }

  async getUserGreetingHistory() {
    this.loaded = true;
    const res = await this.mapService.getGreetingHistory();
    if (res){
      this.greetingListApi = res?.ResponseData?.greetings;
      this.greetingListApi.sort((a: any, b: any) => new Date(b.ModifiedOn).getTime() - new Date(a.ModifiedOn).getTime())
    } 
    this.loaded = false;
    this.activeExpiredGreeting(1);
    
  }

  public dismissModal(data?: any): void {
    this._modalController.dismiss(data);
  }

  getDateAndTime(dateNtime: any, date?: boolean, time?: boolean) {
    const dateFromat = new Date(dateNtime);

    const istOffset = 5.5 * 60 * 60 * 1000;

    let istDate = new Date(dateFromat.getTime() + istOffset);

    if(date){
      let day = istDate.getDate();
      let month = istDate.getMonth() + 1;
      let year = istDate.getFullYear();
      let istDateString = `${day}/${month}/${year}`;
      return istDateString;
    }else if(time){
      let hours = istDate.getHours();
      let minutes = istDate.getMinutes();
      let period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      let istTime12String = `${hours}:${minutes} ${period}`;
      return istTime12String;
    }
    return;
  }

  openUser(user: FiniteeUserOnMap) {
    // this.goBack();
    const navigationExtras: NavigationExtras = {
      state: {
        data: user
      }
    };
    if (user.UserTypeId == AppConstants.USER_TYPE.BN_USER)
      this.router.navigateByUrl('business-user-canvas-other', navigationExtras);
    else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.router.navigateByUrl('free-user-canvas', navigationExtras);
  }

  public async greetingRecieved(user: any): Promise<void> {
    const modal = await this._modalController.create({
      component: GreetingViewComponent,
      componentProps: {
        fromUserId: this.greetingListApi.user
      }
    });
    modal.onDidDismiss()
    .then(result => {
    });

    return await modal.present();
  }

  async presentMenuModalForOther(id: string) {
    var btns = [
      {
        text: 'Report',
        icon: 'user-report',
        cssClass: 'product-option-action-sheet-button',
        data: 'Report',
      },
      {
        text: 'Block User',
        icon: 'user-block',
        cssClass: 'product-option-action-sheet-button',
        data: 'Block',
      },
    ];
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'three-dot-action-sheet',
      buttons: btns
    });
    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    if(result.data === 'Report'){
      this.presentRadioAlert(id);
    }

  }

  async presentRadioAlert(id: string) {
    const alert = await this.alertController.create({
      header: 'Report User',
      cssClass: 'custom-alerts',
      inputs: [
        {
          name: 'option1',
          type: 'radio',
          label: 'I disagree with this user',
          value: 'I disagree',
          checked: true, // Set this to true for the default selected option
        },
        {
          name: 'option2',
          type: 'radio',
          label: 'Targeted harassment',
          value: 'Targeted harassment',
        },
        {
          name: 'option3',
          type: 'radio',
          label: 'Spam',
          value: 'Spam',
        },{
          name: 'option4',
          type: 'radio',
          label: 'Inappropriate name',
          value: 'Inappropriate name',
        },{
          name: 'option5',
          type: 'radio',
          label: 'Threatening content',
          value: 'Threatening content',
        },{
          name: 'option6',
          type: 'radio',
          label: 'Impersonation',
          value: 'Impersonation',
        },{
          name: 'option7',
          type: 'radio',
          label: 'Private information',
          value: 'Private information',
        },
      ],
      buttons: [
        {
          text: 'Send Report',
          cssClass:'infos alertreport',
          handler: async(selectedValue) => {
            // Handle the selected value here
            try{
              this._commonService.showLoader();
              var user_Report = new userReport();
              user_Report.nodeId = id;
              user_Report.report = selectedValue;
              console.log('Selected Value:', selectedValue);
              const res = await this.reportService.userReport(user_Report);
              if(res) this._commonService.hideLoader();
            }catch(e:any){
              this._commonService.hideLoader();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  public onViewTypeChange(viewType: number): void {
    this.viewType = viewType;
  }
  public viewConnection(user: FiniteeUserOnMap): void {}

  public viewUserOnMap(user: FiniteeUserOnMap): void {}

  public startChat(user: FiniteeUserOnMap): void {}

  public greetingUpdate(user: FiniteeUserOnMap, greetingStatus: string): void {}

  public blockUser(): void {}

  // public activeExpiredGreeting(viewType: number): void {
  //   this.activeOrExpired = viewType;
  //   this.firestoreService.greetingListSubject.subscribe((ListOfActiveGreeting:any)=>{
  //     console.log("tempstoregreet",ListOfActiveGreeting)
  //     if (viewType === 1) {
  //       console.log("a",this.filteredGreetingList)
       
  //       this.filteredGreetingList = this.greetingListApi.filter((x: any) => {
  //        for(i=){
         
  //         return x.Id  === ListOfActiveGreeting.Id;
  //        }
  //       });
  //       this.activeRequestCount = this.filteredGreetingList.length;
  //     } else if (viewType === 2) {
  //       this.filteredGreetingList = this.greetingListApi.filter((x: any) => {
  //         return x.Id! === ListOfActiveGreeting.Id;
  //       });
  //       // this.activeRequestCount1 = this.filteredGreetingList.length;
  //     }
  //   })

  

  // }



  public activeExpiredGreeting(viewType: number): void {
    this.activeOrExpired = viewType;
    this.firestoreService.greetingListSubject.subscribe((listOfActiveGreeting: any[]) => {
      console.log("tempstoregreet", listOfActiveGreeting);
  
      if (viewType === 1) {        
        listOfActiveGreeting.forEach(activeGreeting => {
          this.filteredGreetingList = this.greetingListApi.filter((x: any) => {
            const tocheck = "u-" + x.CreatedBy.Id;
            return tocheck == activeGreeting;
          })
        });
        console.log("filtered Results",this.filteredGreetingList );
        
        this.activeRequestCount = this.filteredGreetingList.length;

      } 
      else if (viewType === 2) { 
        listOfActiveGreeting.forEach(activeGreeting => {
          this.filteredGreetingList = this.greetingListApi.filter((x: any) => {
            const tocheck = "u-" + x.CreatedBy.Id;
            return tocheck !== activeGreeting;
          })
        });

        console.log("filtered Results",this.filteredGreetingList );
      }
    });
  }
}
