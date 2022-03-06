import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    
  }

  goToHome() {
    if(this.router.url.includes('/dashboard')) {
      return
    }
    this.commonService.goToDashboard();
  }

}
