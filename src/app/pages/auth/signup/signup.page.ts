import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { EUserRoles } from 'src/app/interfaces/commons-enum';
import { EStrings } from 'src/app/interfaces/strings';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  items: MenuItem[];

  constructor(
    private router: Router
  ) {
    router.events.subscribe((e) => {
      if(e instanceof NavigationEnd) {
        const url = e.url;
        const role = url.split('/')[3];
        if (role === EUserRoles.admin) {
          this.items = [...this.items, { label: [EStrings.user, EStrings.details].join(' ') }];
        }
      }
    });
  }

  ngOnInit() {
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
