import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from 'src/app/core/services/chat/chats.service';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.page.html',
  styleUrls: ['./chat-detail.page.scss'],
})
export class ChatDetailPage implements OnInit, OnDestroy {
  otherPartyUser: any = -1;
  @Input() otherValue: any;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public chatsService: ChatsService,
  ) {
    // const res = this.navParams.data!['user']!['state']!['data'];
    // if(this.navParams?.data && this.navParams.data!['state']){
    //   this.chatsService.selectedGroupId = 'new';
    //   this.otherPartyUser = this.navParams.data!['user']!['state']!['data'];
    // }else{

    // }
    // console.log("a", this.otherValue)
    // this.otherPartyUser = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    // console.log(this.otherPartyUser);

    
  }
  ngOnInit(){
    console.log("b", this.otherValue)
    this.route.params.subscribe((params: any) => {
      console.log("params", params?.id)
      if(this.otherValue?.state){
        if(this.otherValue?.state?.groupId === "") this.chatsService.selectedGroupId = 'new';
        else if(this.otherValue?.state?.groupId != "") this.chatsService.selectedGroupId = this.otherValue?.state?.groupId;
      }else this.chatsService.selectedGroupId = params.id;
      if(params?.id) this.otherPartyUser = this.router!.getCurrentNavigation()!.extras!.state!['data'];
      if(this.otherValue?.state){
        if(this.otherValue?.state?.data) this.otherPartyUser = this.otherValue?.state?.data;
      }
    }); 
  }
  ngOnDestroy() {
    
  }
  
}
