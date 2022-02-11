import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints, EUserRoles } from 'src/app/interfaces/commons-enum';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;
  private subs: Subscription = new Subscription();
  private currentRole: EUserRoles;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
    this.currentRole = this.route.snapshot.params.role;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    console.log('onSubmit');
    console.log(this.currentRole);
    if(this.currentRole === EUserRoles.admin) {
      this.router.navigate(['/', 'auth', 'signup', 'create-college']);
    }
  }

}
