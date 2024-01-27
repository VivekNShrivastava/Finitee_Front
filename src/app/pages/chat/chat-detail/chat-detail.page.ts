import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from 'src/app/core/services/chat/chats.service';


@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.page.html',
  styleUrls: ['./chat-detail.page.scss'],
})
export class ChatDetailPage implements OnInit, OnDestroy {
  otherPartyUser: any = -1;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public chatsService: ChatsService,
  ) {
    this.route.params.subscribe((params: any) => {
      console.log("params", params)
      this.chatsService.selectedGroupId = params.id;
      this.otherPartyUser = this.router!.getCurrentNavigation()!.extras!.state!['data'];
    });
  }
  ngOnInit(){
    
  }
  ngOnDestroy() {
    
  }
  
}
