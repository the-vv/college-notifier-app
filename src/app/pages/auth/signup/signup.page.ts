import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { EUserRoles } from 'src/app/interfaces/commons-enum';
import { EStrings } from 'src/app/interfaces/strings';
import { trigger, transition, group, query, style, animate } from '@angular/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {

  public items: MenuItem[] = [];
  public activeStep = 0;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;
        const role = url.split('/')[3];
        if (role === EUserRoles.admin) {
          this.items = [...this.items, { label: [EStrings.create, EStrings.college].join(' ') }];
          this.activeStep = 1;
        }
        else if (role === EUserRoles.faculty) {
          this.items = [...this.items, { label: [EStrings.join, EStrings.college].join(' ') }];
          this.activeStep = 1;
        }
        else if (role === EUserRoles.student) {
          this.items = [...this.items, { label: [EStrings.join, EStrings.class].join(' ') }];
          this.activeStep = 1;
        }
        else if (role === EUserRoles.parent) {
          this.items = [...this.items, { label: [EStrings.access, EStrings.child, EStrings.account].join(' ') }];
          this.activeStep = 1;
        }
        else if (role === 'role') {
          this.items = [
            { label: [EStrings.choose, EStrings.role].join(' ') },
            { label: [EStrings.user, EStrings.details].join(' ') },
          ];
          this.activeStep = 0;
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.items = [
      { label: [EStrings.choose, EStrings.role].join(' ') },
      { label: [EStrings.user, EStrings.details].join(' ') },
    ];
  }

  onRoleSelect(role: EUserRoles) {
    if (role === EUserRoles.admin) {
      this.items = [...this.items, { label: [EStrings.user, EStrings.details].join(' ') }];
    }
  }

}
