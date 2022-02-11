import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EBreakPoints } from 'src/app/interfaces/commons-enum';
import { EStrings } from 'src/app/interfaces/strings';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-college',
  templateUrl: './create-college.component.html',
  styleUrls: ['./create-college.component.scss'],
})
export class CreateCollegeComponent implements OnInit, OnDestroy {

  public currentBreakPoint: EBreakPoints;
  private subs: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subs.add(this.commonService.breakPointChanges$.subscribe(
      (val: EBreakPoints) => this.currentBreakPoint = val
    ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    console.log('onSubmit');
    this.commonService.successMessageDescription = [EStrings.collegeRequestedText].join(' ');
    this.commonService.successMessageTitle = [EStrings.collegeCreated].join(' ');
    this.router.navigate(['/', 'success']);
  }

}
