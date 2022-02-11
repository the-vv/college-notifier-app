import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { CommonExportsModule } from 'src/app/common-exports.module';
import { StepsModule } from 'primeng/steps';
import { RoleChooseComponent } from './role-choose/role-choose.component';
import { CreateCollegeComponent } from './create-college/create-college.component';
import { JoinCollegeComponent } from './join-college/join-college.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    CommonExportsModule,
    StepsModule,
    AvatarModule,
    SharedModule,
    ReactiveFormsModule
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
