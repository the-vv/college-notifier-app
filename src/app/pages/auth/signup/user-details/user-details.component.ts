import { Component, OnDestroy, OnInit } from '@angular/core';
import { EBreakPoints } from 'src/app/interfaces/commons-enum';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
