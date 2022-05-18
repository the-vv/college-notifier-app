import { Component, OnInit } from '@angular/core';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ReportListPage implements OnInit {

  public eUserRoles = EUserRoles;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

}
