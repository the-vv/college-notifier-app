import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IResource } from 'src/app/interfaces/common.model';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.page.html',
  styleUrls: ['./resources-list.page.scss'],
})
export class ResourcesListPage implements OnInit, OnDestroy {

  resourcesData: IResource[] = [];
  public loading = false;
  private subs: Subscription = new Subscription();

  constructor(
    public collegeService: CollegeService,
    private resourceService: ResourceService,
    private commonService: CommonService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.subs.add(this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && (event.url) === '/dashboard/resources') {
        this.getResources();
      }
    }));
  }

  ionViewWillEnter() {
    this.getResources();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async getResources() {
    const laoding = await this.commonService.showLoading();
    /* eslint no-underscore-dangle: 0 */
    this.resourceService.getByCollegeAsync(this.collegeService.currentCollege$.value._id)
      .subscribe((res) => {
        laoding.dismiss();
        console.log(res);
        this.resourcesData = res;
      }, err => {
        laoding.dismiss();
        this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
      });
  }

  onEdit(item: IResource, event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate(['/resource/manage', item._id]);
  }

  async onDelete(item: IResource, event: any) {
    event.stopPropagation();
    event.preventDefault();
    const alert = await this.alertController.create({
      header: EStrings.confirmDelete,
      message: `${EStrings.areYouSureWantToDelete} ${EStrings.resource.toLowerCase()} '${item.name}'?`,
      buttons: [
        {
          text: EStrings.cancel,
          role: 'cancel',
          id: 'cancel-button',
        }, {
          text: EStrings.delete,
          id: 'confirm-button',
          handler: () => {
            this.resourceService.deleteAsync(item._id).subscribe(() => {
              this.getResources();
            }, err => {
              this.commonService.showToast(err.error.message);
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
