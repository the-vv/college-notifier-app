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
        const urlEnding = url.split('/')[3];
        if (urlEnding === EUserRoles.admin) {
          this.items = [...this.items, { label: [EStrings.create, EStrings.college].join(' ') }];
          this.activeStep = 1;
        }
        else if (urlEnding === EUserRoles.faculty) {
          this.items = [...this.items, { label: [EStrings.join, EStrings.college].join(' ') }];
          this.activeStep = 1;
        }
        else if (urlEnding === EUserRoles.student) {
          this.items = [...this.items, { label: [EStrings.join, EStrings.class].join(' ') }];
          this.activeStep = 1;
        }
        else if (urlEnding === EUserRoles.parent) {
          this.items = [...this.items, { label: [EStrings.access, EStrings.child, EStrings.account].join(' ') }];
          this.activeStep = 1;
        }
        else if (urlEnding === 'role') {
          this.items = [
            { label: [EStrings.choose, EStrings.role].join(' ') },
            { label: [EStrings.user, EStrings.details].join(' ') },
          ];
          this.activeStep = 0;
        }
        else if(urlEnding === 'create-college') {
          this.activeStep = 2;
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
