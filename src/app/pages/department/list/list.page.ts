import { Component, OnInit } from '@angular/core';
import { IDepartment } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  departmentsData: IDepartment[] = []

  constructor(
    public collegeService: CollegeService
  ) { }

  ngOnInit() {
  }

}
