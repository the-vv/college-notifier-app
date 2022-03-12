import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  public eUserRoles = EUserRoles;

  constructor(
    public authService: AuthService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
  }

  goToHome() {
    if(this.router.url.includes('/dashboard')) {
      return;
    }
    this.commonService.goToDashboard();
  }

  goToSettings() {
    if(this.router.url.includes('/settings')) {
      return;
    }
    this.router.navigate(['/', 'settings']);
  }

}
