import { Component, OnInit } from '@angular/core';
import { ICollege } from 'src/app/interfaces/common.model';
import { CollegeService } from 'src/app/services/college.service';
import { Toast } from '@capacitor/toast';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-college-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class CollegeListPage implements OnInit {

  public collegeData: ICollege[] = [];

  constructor(
    private collegeService: CollegeService,
    private commonService: CommonService
  ) { }

  async ngOnInit() {
    const loader = await this.commonService.showLoading();
    this.collegeService.getAllCollegeAsync()
      .subscribe(res => {
        this.collegeData = res;
        console.log(this.collegeData);
        loader.dismiss()
      }, err => {
        Toast.show({
          text: [EStrings.error + ':', , err.error.message].join(' '),
        });
        loader.dismiss()
      });
  }

}
