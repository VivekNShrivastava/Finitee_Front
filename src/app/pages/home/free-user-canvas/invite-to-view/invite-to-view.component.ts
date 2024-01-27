import { Component, OnInit } from '@angular/core';
import { userConnection } from 'src/app/core/models/connection/connection';
import { ConnectionsService } from 'src/app/core/services/connections.service';
import { Router } from '@angular/router';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-invite-to-view',
  templateUrl: './invite-to-view.component.html',
  styleUrls: ['./invite-to-view.component.scss'],
})
export class InviteToViewComponent implements OnInit {
  userConnections: Array<userConnection> = [];
  loaded: boolean = false;
  paramsData: any;
  selectedUserIds: string[] = [];


  constructor(
    private connectionsService: ConnectionsService,
    private router: Router,
    public postService: PostService

  ) {}

  ngOnInit() {
    this.getUserConnections();

    if (this.router?.getCurrentNavigation()?.extras.state) {
      this.paramsData = this.router?.getCurrentNavigation()?.extras.state;
      console.log("paramsdata",this.paramsData);
    }
  }
  async getUserConnections() {
    this.userConnections = await this.connectionsService.getUserConnections();
    this.loaded = true;
    console.log(this.userConnections)
  }

  async handleCheckboxChange(id: string) {
    
    const index = this.selectedUserIds.indexOf(id);

    if (index > -1) {
      // User is unchecking, remove from the array
      this.selectedUserIds.splice(index, 1);
      console.log("unchecked", id)
      console.log(this.selectedUserIds)
    } else {
      // User is checking, add to the array
      this.selectedUserIds.push(id);
      console.log("checked", id)
      console.log(this.selectedUserIds)
    }
  }

  async inviteToViewPost() {
    this.postService.inviteToViewPost(this.selectedUserIds, this.paramsData.selectedPost!.Id)
    console.log("send");
  }

}
