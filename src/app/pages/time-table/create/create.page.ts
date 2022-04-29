/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { endOfDay, startOfDay } from 'date-fns';
import { Subscription } from 'rxjs';
import { ECustomUserRoles, ESourceTargetType } from 'src/app/interfaces/common.enum';
import { IBatch, IClass, IDepartment, ISchedule, ITimeTable, ITimeTableSchedule, IUser } from 'src/app/interfaces/common.model';
import { ClassService } from 'src/app/services/class.service';
import { CollegeService } from 'src/app/services/college.service';
import { CommonService } from 'src/app/services/common.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { DragulaService } from 'ng2-dragula';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { TimeTableService } from 'src/app/services/time-table.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-timetable-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {


  dateRange: ISchedule = {
    start: this.commonService.toLocaleIsoDateString(startOfDay(new Date())),
    end: this.commonService.toLocaleIsoDateString(endOfDay(new Date())),
  };
  accordianVal: 'settings' = 'settings';
  tutorAccordian: 'tutor' = undefined;
  departmentControl = new FormControl([]);
  availableDpts: IDepartment[] = [];
  availableClasses: IClass[] = [];
  classesControl = new FormControl([]);
  hoursCtrl = new FormControl(3);
  finalHoursCount = 0;
  rolesCtrl = new FormControl([ECustomUserRoles.teachingStaff, ECustomUserRoles.assistProf]);
  hoursCount: string | number = 6;
  minDate = this.commonService.toLocaleIsoDateString(startOfDay(new Date()));
  customRoles = Object.keys(ECustomUserRoles).map(key => ({ name: key, value: ECustomUserRoles[key] }));
  eCustomUserRoles = ECustomUserRoles;
  allocationData: ITimeTable[] = [];
  showGrid = false;
  allTutorList: IUser[] = [];
  allFilteredTutorList: IUser[] = [];
  subs: Subscription = new Subscription();
  dragulaName = 'tutorGrid';
  tutorClassAllocations: { hour: number; classId: string }[] = [];
  dragging = false;
  loading = false;
  timeTableId: string;


  constructor(
    public commonService: CommonService,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private classServoce: ClassService,
    private userService: UserService,
    private dragulaService: DragulaService,
    private timeTableService: TimeTableService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    dragulaService.createGroup(this.dragulaName, {
      revertOnSpill: true,
      copy: true,
      copyItem: (item: any) => item,
      accepts: (el, target, source, sibling) => {
        const hour = target.id.split('-')[1];
        const allowed = !this.checkIsHourAllocated(+hour);
        return !target.classList.contains('nonDroppable') && target.classList.contains('dropable-area') && allowed;
      },
      moves: (el, container, handle) => handle.className.includes('drag-handle')
    });
    this.subs.add(dragulaService.over(this.dragulaName)
      .subscribe(({ el, container }) => {
        container.classList.add('drag-over');
      })
    );
    this.subs.add(dragulaService.out(this.dragulaName)
      .subscribe(({ el, container }) => {
        container.classList.remove('drag-over');
      })
    );
    this.subs.add(dragulaService.drop(this.dragulaName)
      .subscribe(({ el, target, source, sibling }) => {
        const classId = target.id.split('-')[0];
        const hour = target.id.split('-')[1];
        const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
        classAllocation.allocation[hour] = el.id;
      })
    );
    this.subs.add(dragulaService.drag(this.dragulaName)
      .subscribe(({ el, source }) => {
        this.dragging = true;
        this.tutorAccordian = undefined;
        $('body').addClass('prevent-scroll');
        const teacherid = el.id;
        this.tutorClassAllocations = [];
        this.allocationData.forEach(item => {
          Object.keys(item.allocation).forEach((hour) => {
            if (item.allocation[hour] === teacherid) {
              this.tutorClassAllocations.push({
                classId: (item.class as IClass)._id,
                hour: +hour
              });
            }
          });
        });
      })
    );
    this.subs.add(dragulaService.dragend(this.dragulaName)
      .subscribe(({ el }) => {
        this.dragging = false;
        this.tutorAccordian = 'tutor';
        $('body').removeClass('prevent-scroll');
      })
    );
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy(this.dragulaName);
  }

  removeClassHourAllocation(classId: string, hour: number) {
    const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
    classAllocation.allocation[hour] = undefined;
  }

  getClassHourAllocation(classId: string, hour: number) {
    const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
    if (classAllocation.allocation[hour]?.startsWith('TEXT:')) {
      return null;
    }
    return classAllocation.allocation[hour];
  }

  getClassHourTutotr(classId: string, hour: number): IUser | undefined {
    const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
    const tutorid = classAllocation.allocation[hour];
    const tutor = this.allTutorList.find(item => item._id === tutorid);
    return tutor;
  }

  checkIsHourAllocated(hour: number) {
    return !!this.tutorClassAllocations.find(item => item.hour === hour);
  }

  setCustomHourText(classId: string, hour: number, text: string) {
    const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
    classAllocation.allocation[hour] = `TEXT: ${text}`;
    // console.log(classAllocation.allocation);
  }

  getCustomHourText(classId: string, hour: number) {
    const classAllocation = this.allocationData.find(item => (item.class as IClass)._id === classId);
    if (classAllocation.allocation[hour]?.startsWith('TEXT:')) {
      return classAllocation.allocation[hour].split('TEXT:')[1].trim();
    } else {
      return '';
    }
  }

  ngOnInit() {
  }

  accChange(e: any) {
    if ((e?.path[0]?.classList as DOMTokenList)?.contains('accordion-group-expand-compact')) {
      this.accordianVal = e.detail.value;
    }
  }

  tutorAcccChange(e: any) {
    if ((e?.path[0]?.classList as DOMTokenList)?.contains('accordion-group-expand-compact')) {
      this.tutorAccordian = e.detail.value;
    }
  }

  setStartDate(date: string) {
    this.dateRange.start = date;
    if (new Date(this.dateRange.end) < new Date(date)) {
      this.dateRange.end = date;
    }
  }

  setEndDate(date: string) {
    this.dateRange.end = date;
    if (new Date(this.dateRange.start) > new Date(date)) {
      this.dateRange.start = date;
    }
  }

  ionViewWillEnter() {
    this.timeTableId = this.route.snapshot.paramMap.get('id');
    if (this.timeTableId) {
      this.timeTableService.getByIdAsync(this.timeTableId).subscribe(data => {
        if (!data) { return; }
        // console.log(data);
        this.dateRange = data.schedule;
        this.allocationData = data.classes;
        this.departmentControl.setValue(data.department);
        const clasList: IClass[] = [];
        this.allocationData.forEach(item => {
          clasList.push(item.class as IClass);
        });
        this.classesControl.setValue(clasList);
        this.hoursCount = data.hoursCount;
        this.onStart();
      }, err => {
        this.commonService.showToast(err.error.message);
      });
    }
    this.getDpts();
    this.subs.add(
      this.departmentControl.valueChanges.subscribe(async (val) => {
        if (val) {
          const loader = await this.commonService.showLoading();
          this.classServoce.getActiveClassesByDepartmentAsync(this.collegeService.currentCollege$.value._id, val._id)
            .subscribe(res => {
              this.availableClasses = res?.map(item => (
                {
                  ...item,
                  nameLong: `${item.name} (${(item.source.batch as IBatch).startDate} - ${(item.source.batch as IBatch).endDate})`
                }
              ));
              this.classesControl.setValue(this.availableClasses);
              loader.dismiss();
            }, err => {
              loader.dismiss();
              this.commonService.showToast(err.error.message);
            });
        }
      })
    );
    this.subs.add(
      this.rolesCtrl.valueChanges.subscribe(async (val) => {
        if (val) {
          const loader = await this.commonService.showLoading();
          this.userService.getBySourceCustomRoleAsync(
            ESourceTargetType.department, this.departmentControl.value?._id, this.rolesCtrl.value
          ).subscribe(res => {
            loader.dismiss();
            // console.log(res);
            this.accordianVal = undefined;
            this.showGrid = true;
            this.allTutorList = res;
            this.allFilteredTutorList = res;
            this.tutorAccordian = 'tutor';
          }, err => {
            loader.dismiss();
            this.commonService.showToast(err.error.message);
          });
        }
      })
    );
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    this.classesControl.setValue([]);
    this.departmentControl.setValue('');
  }

  async getDpts() {
    const loader = await this.commonService.showLoading();
    this.departmentService.getByCollegeAsync(this.collegeService.currentCollege$.value._id).subscribe(res => {
      this.availableDpts = res;
      if (res?.length) {
        this.departmentControl.setValue(res[0]);
      }
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.commonService.showToast(err.error.message);
    });
  }

  async onStart() {
    if (!(this.hoursCtrl.value && this.rolesCtrl.value?.length && this.departmentControl.value && this.classesControl.value)) {
      return;
    }
    if (this.showGrid && !await this.commonService.showOkCancelAlert(EStrings.areYouSure, EStrings.thisWillResetAllocationGrid)) {
      return;
    }
    this.finalHoursCount = this.hoursCtrl.value;
    if (this.showGrid || !this.timeTableId) { // donot reset if editing for first time
      this.allocationData = [];
      for (let i = 0; i < this.classesControl.value?.length; i++) {
        this.allocationData.push({
          class: this.classesControl.value[i] as IClass,
          allocation: {}
        });
      }
    }
    // console.log(this.allocationData);
    const loader = await this.commonService.showLoading();
    this.userService.getBySourceCustomRoleAsync(
      ESourceTargetType.department, this.departmentControl.value?._id, this.rolesCtrl.value
    ).subscribe(res => {
      loader.dismiss();
      // console.log(res);
      this.accordianVal = undefined;
      this.showGrid = true;
      this.allTutorList = res;
      this.allFilteredTutorList = res;
      this.tutorAccordian = 'tutor';
    }, err => {
      loader.dismiss();
      this.commonService.showToast(err.error.message);
    });
  }

  async resetGrid() {
    if (!await this.commonService.showOkCancelAlert(EStrings.areYouSure, EStrings.thisWillResetAllocationGrid)) {
      return;
    }
    this.allocationData.forEach(item => {
      item.allocation = {};
    });
    this.finalHoursCount = 0;
    setTimeout(() => { // for re-rendering the grid loop for faulty drag and drop bugs
      this.finalHoursCount = this.hoursCtrl.value;
    });
  }

  searchTutor(val: any) {
    const searchKey = val?.detail?.value as string;
    if (searchKey.trim()) {
      this.allFilteredTutorList = this.allTutorList.filter(item => item.name.toLowerCase().includes(searchKey.trim().toLowerCase()));
    } else {
      this.allFilteredTutorList = this.allTutorList;
    }
  }

  getRangeArray(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  async onSubmit() {
    if (!this.showGrid) {
      return;
    }
    const body: ITimeTableSchedule = {
      college: this.collegeService.currentCollege$.value._id,
      department: this.departmentControl.value?._id,
      hoursCount: this.finalHoursCount,
      schedule: this.dateRange,
      classes: this.allocationData.map(item => ({
        class: (item.class as IClass)._id,
        allocation: item.allocation
      }))
    };
    if (!this.timeTableId) {
      // console.log(body);
      const loader = await this.commonService.showLoading();
      this.timeTableService.postAsync(body).subscribe(res => {
        loader.dismiss();
        this.commonService.showToast(EStrings.timeTableCreatedSuccessfully);
        this.router.navigate(['/dashboard/time-table'], { replaceUrl: true });
      }, err => {
        loader.dismiss();
        this.commonService.showToast(err.error.message);
      });
    } else {
      body._id = this.timeTableId;
      const loader = await this.commonService.showLoading();
      this.timeTableService.putAsync(body).subscribe(res => {
        loader.dismiss();
        this.commonService.showToast(EStrings.timeTableUpdatedSuccessfully);
        this.router.navigate(['/dashboard/time-table'], { replaceUrl: true });
      }, err => {
        loader.dismiss();
        this.commonService.showToast(err.error.message);
      });
    }
  }

}
