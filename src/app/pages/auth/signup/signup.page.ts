import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EUserRoles } from 'src/app/interfaces/commons-enum';
import { EStrings } from 'src/app/interfaces/strings';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {

  public items: MenuItem[] = [];
  public activeStep = 0;
  private subs: Subscription = new Subscription();

  constructor(
    private router: Router
  ) {
    this.items = [
      { label: [EStrings.choose, EStrings.role].join(' ') },
      { label: [EStrings.user, EStrings.details].join(' ') },
    ];
    this.subs.add(
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          const url = e.url;
          console.log(url);
          const urlEnding = url.split('/')[3];
          if (urlEnding === EUserRoles.admin) {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.admin, EStrings.details].join(' ') },
              { label: [EStrings.create, EStrings.college].join(' ') },
            ];
            this.activeStep = 1;
          }
          else if (urlEnding === EUserRoles.faculty) {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.faculty, EStrings.details].join(' ') },
              { label: [EStrings.join, EStrings.college].join(' ') },
            ];
            this.activeStep = 1;
          }
          else if (urlEnding === EUserRoles.student) {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.student, EStrings.details].join(' ') },
              { label: [EStrings.join, EStrings.college].join(' ') },
            ];
            this.activeStep = 1;
          }
          else if (urlEnding === EUserRoles.parent) {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.parent, EStrings.details].join(' ') },
              { label: [EStrings.join, EStrings.college].join(' ') },
            ];
            this.activeStep = 1;
          }
          else if (urlEnding === 'role') {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.admin, EStrings.details].join(' ') },
              { label: [EStrings.create, EStrings.college].join(' ') },
            ];
            this.activeStep = 0;
          }
          else if (urlEnding === 'create-college') {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.user, EStrings.details].join(' ') },
              { label: [EStrings.create, EStrings.college].join(' ') },
            ];
            this.activeStep = 2;
          }
          else if (urlEnding === 'join-college') {
            this.items = [
              { label: [EStrings.choose, EStrings.role].join(' ') },
              { label: [EStrings.user, EStrings.details].join(' ') },
              { label: [EStrings.join, EStrings.college].join(' ') },
            ];
            this.activeStep = 2;
          }
        }
      })
    );
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }

  onRoleSelect(role: EUserRoles) {
    if (role === EUserRoles.admin) {
      this.items = [...this.items, { label: [EStrings.user, EStrings.details].join(' ') }];
    }
  }

}
