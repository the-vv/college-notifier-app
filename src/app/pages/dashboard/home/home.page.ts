import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  homeListItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.setHomeListItems();
  }

  setHomeListItems() {
    this.homeListItems = [
      {
        title: 'Dashboard',
        icon: 'home',
        route: '/dashboard',
        description: 'primary'
      }
    ];
  }

}
