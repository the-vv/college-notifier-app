import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage implements OnInit {

  public loading: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
