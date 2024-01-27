import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss'],
})
export class AccountManagementComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log("accountManagement")
    
  }

  edit(temp: string) : void {
    console.log(temp)
    this.router.navigateByUrl(`account-management/${temp}`);
  }

}
