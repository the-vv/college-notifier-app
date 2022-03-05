import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EUserRoles } from 'src/app/interfaces/common.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.authService.currentUserRole);
    switch(this.authService.currentUserRole) {
      case EUserRoles.superAdmin:
        this.router.navigate(['admin'], { relativeTo: this.activatedRoute });
        break;
      case EUserRoles.admin:
        this.router.navigate(['college-admin'], { relativeTo: this.activatedRoute });
        break;
      case EUserRoles.faculty:
        this.router.navigate(['faculty'], { relativeTo: this.activatedRoute });
        break;
      case EUserRoles.student:
        this.router.navigate(['student'], { relativeTo: this.activatedRoute });
        break;
      default:
        this.router.navigate(['auth'], { relativeTo: this.activatedRoute });
        break;
    }
  }

}
