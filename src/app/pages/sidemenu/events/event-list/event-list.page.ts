import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';
import { EventItem } from 'src/app/core/models/event/event';
import { BasePage } from 'src/app/base.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, IonMenu } from '@ionic/angular';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})
export class EventListPage extends BasePage implements OnInit {
  loading: boolean = false;
  upcomingEventList: Array<EventItem> = [];
  completedEventList: Array<EventItem> = [];
  @ViewChild('menu') menu!: IonMenu; 

  selectedTab: any = 'active'
  loaded: boolean = false;
  
  constructor(
    private router: Router,
    public eventService: EventsService,
    private authService: AuthService, private alertController: AlertController,
  ) {
    super(authService);
  //  this.subscribeEventListSubject();
  }


  openMenu() {
    this.menu.open();
  }
  ngOnInit() {
   
  }

  ionViewWillEnter(){
    this.upcomingEventList = [];
    this.completedEventList = [];
  this.getAllEvents();

  }
  subscribeEventListSubject() {
    this.eventService.eventListData.subscribe({
      next: (result: any) => {
        if (typeof (result) == 'number') {
          this.upcomingEventList.splice(result, 1)
        } else {
          var diff = new Date(result.StartDate).getTime() - new Date().getTime();
          result.daysLeft = Math.floor(diff / (1000 * 3600 * 24));
          this.upcomingEventList.push(result);
        }
      }
    });
  }

  segmentChange(data: any) {
    console.log(data);
    this.loaded = false;
    switch (data.detail.value) {
      case 'active':
        // this.getConnectionRequests();
        break;
      case 'expired':
        // this.getUserBlockList();
        break;
    }
  }

  async getAllEvents() {
    this.loading = true;

    await this.eventService.getAllEventByUser();
    this.loading = false;

    for (var i = 0; i < this.eventService.eventList.length; i++) {
      if (new Date(this.eventService.eventList[i].EndDate) > new Date()) {
        var diff = new Date(this.eventService.eventList[i].StartDate).getTime() - new Date().getTime();
        this.eventService.eventList[i].daysLeft = Math.floor(diff / (1000 * 3600 * 24));
        this.upcomingEventList.push(this.eventService.eventList[i]);
      } else {
        this.completedEventList.push(this.eventService.eventList[i]);
      }
    }
  }

  openEventViewPage(eventId: any) {
    this.router.navigateByUrl(`/events/event-view/${eventId}`);
  }

  openCreateEventPage() {
    this.navEx!.state!['data'] = new EventItem();
    this.router.navigateByUrl('events/create-edit-event', this.navEx);
  }

  editEvent(e: any, event: EventItem, index: number) {
    e.stopPropagation();
    e.preventDefault();
    this.navEx!.state!['data'] = event;
    this.navEx!.state!['extraParams'] = index;
    this.router.navigateByUrl('events/create-edit-event', this.navEx);
  }


  async deleteEvent(e: any, event: EventItem, index: number, val: any) {
    const alert = await this.alertController.create({
      header: 'Delete event',
      message: 'Are you sure you want to delete this event?',
      cssClass: 'custom-alert-message',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'infos',
          role: 'cancel',
          handler: async () => {
            // Handle cancel action if needed.
          },
        },
        {
          text: 'Delete',
          cssClass: 'dangers',
          role: 'confirm',
          handler: async () => {
            try {
              e.stopPropagation();
              e.preventDefault();
              var result = await this.eventService.deleteEvent(event.Id!);
              if (result)
                if (val == 'upcoming') {
                  this.upcomingEventList.splice(index, 1);
                } else if (val == "complete") {
                  this.completedEventList.splice(index, 1);
                }
            } catch (error) {
              console.error('Error while deleting work experience:', error);
              // this.commonService.presentToast('Something went wrong. Please try again later.');
            }
          },
        },
      ],
    });

    await alert.present();
  }
}

// async deleteEvent(e: any, event: EventItem, index: number, val: any) {
//   e.stopPropagation();
//   e.preventDefault();
//   var result = await this.eventService.deleteEvent(event.Id!);
//   if (result)
//     if (val == 'upcoming') {
//       this.upcomingEventList.splice(index, 1);
//     } else if (val == "complete") {
//       this.completedEventList.splice(index, 1);
//     }
//   //this.eventService.eventList.splice(index, 1);
// }
