import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ChatsService } from 'src/app/core/services/chat/chats.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifiactions: any = [];
  constructor(private nav: NavController, 
    public commonService: CommonService, 
    private _storageService: StorageService,
    public chatService: ChatsService
  ) { }


  ngOnInit() {
    this.getAllNotification();
  }

  navigateToChat(notiData: any){
    console.log('data', notiData);
    if(notiData.title === 'Greeting' && notiData.body.includes('accepted')){
      var selctedUser: any = {
        UserId: notiData.data.fromId,
        DisplayName: notiData.body.split(' ')[0],
        ProfilePhoto: 'ProfileImage == undefined ? null : this.navParams.ProfileImage',
        groupId: ""
      }
      console.log('start-chatting...', selctedUser);
      this.chatService.openChat(selctedUser); 
    }
    
  }

  getAllNotification() {
    this.notifiactions = this._storageService.ReadNotification(this.commonService.getTodayDate());
    console.log("noti", this.notifiactions);
  }

  delete(){console.log('delete')}
  
  deleteNotificationById(notificationId: string) {
    console.log('delete function...', notificationId);
  
    // Get the current date from the common service
    const keyDate = this.commonService.getTodayDate();
    // Construct the object key using the date
    const objectKey = 'NOTIFICATION_' + keyDate;
    console.log(objectKey);
  
    // Retrieve the array of notifications from local storage
    const storedData = localStorage.getItem(objectKey);
    console.log(storedData);
  
    // Check if there is stored data
    if (storedData) {
      // Parse the stored JSON string into an array of objects
      let dataArray = JSON.parse(storedData);
      console.log(dataArray);
  
      // Find the index of the notification with the specified id
      const index = dataArray.findIndex((item: any) => item.notificationData.id === notificationId);
      
      // Check if the notification was found
      if (index !== -1) {
        console.log('Notification found:', dataArray[index]);
  
        // Remove the notification from the array
        dataArray.splice(index, 1);
  
        // Save the updated array back to local storage
        localStorage.setItem(objectKey, JSON.stringify(dataArray));
        console.log('Notification deleted and array updated in local storage');
        this.getAllNotification();
      } else {
        console.log('Notification with id does not exist:', notificationId);
      }
    } else {
      console.log('No stored data found for key:', objectKey);
    }
  }
  

  back() {
    this.nav.pop()
  }
}
