import { Component, OnInit } from '@angular/core';
import { UserContacvtDetailsService } from 'src/app/core/services/user-contact-details.service';

@Component({
  selector: 'app-edit-username',
  templateUrl: './edit-username.component.html',
  styleUrls: ['./edit-username.component.scss'],
})
export class EditUsernameComponent implements OnInit {

  newUserName : string = "";
  password : string = "";

  constructor(private userContacvtDetailsService: UserContacvtDetailsService) { }

  ngOnInit() {}

  onInputChange(event: any) {
    this.newUserName = event.target.value;
  }

  onInputChangePassword(event: any) {
    this.password = event.target.value;
  }

  async submit () {
    console.log(this.newUserName, this.password);
    const res = await this.userContacvtDetailsService.editUsername(this.newUserName, this.password);
    console.log(res);
  }
}
