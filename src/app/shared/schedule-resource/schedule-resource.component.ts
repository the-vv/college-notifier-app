import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IResource } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-schedule-resource',
  templateUrl: './schedule-resource.component.html',
  styleUrls: ['./schedule-resource.component.scss'],
})
export class ScheduleResourceComponent implements OnInit {

  @Input() public resourceId: string;

  scheduleForm: FormGroup;
  submitted = false;
  loading = false;
  showErrors = false;
  isUpdate = false;
  currentResource: IResource;

  constructor(
    private modalCtrl: ModalController,
    private resourceServoce: ResourceService,
    private commonService: CommonService
  ) { }

  get f() { return this.scheduleForm.controls; }

  async ngOnInit() {
    this.scheduleForm = new FormGroup({
      description: new FormControl(''),
    });
    if (this.resourceId) {
      const loading = await this.commonService.showLoading();
      this.resourceServoce.getByIdAsync(this.resourceId).subscribe(res => {
        loading.dismiss();
        this.currentResource = res;
      }, err => {
        loading.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.err.message}`);
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() { }

}
