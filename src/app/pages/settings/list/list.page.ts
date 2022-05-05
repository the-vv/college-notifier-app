import { Component, OnInit } from '@angular/core';
import { CollegeService } from 'src/app/services/college.service';

@Component({
  selector: 'app-settings-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class SettingsListPage implements OnInit {

  constructor(
    public collegeService: CollegeService
  ) { }

  ngOnInit() {
  }

}
