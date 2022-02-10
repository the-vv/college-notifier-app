import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { StepsModule } from 'primeng/steps';
import { RoleChooseComponent } from './role-choose/role-choose.component';
import { CreateCollegeComponent } from './create-college/create-college.component';
import { JoinCollegeComponent } from './join-college/join-college.component';
import { UserDetailsComponent } from './user-details/user-details.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    CommonExportsModule,
    StepsModule
  ],
  declarations: [
    SignupPage,
    RoleChooseComponent,
    CreateCollegeComponent,
    JoinCollegeComponent,
    UserDetailsComponent
  ]
})
export class SignupPageModule { }
