import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EBreakPoints } from 'src/app/interfaces/commons-enum';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public currentBreakPoint: EBreakPoints;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
  }

}
