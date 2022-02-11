import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCollegeComponent } from './create-college/create-college.component';
import { JoinCollegeComponent } from './join-college/join-college.component';
import { RoleChooseComponent } from './role-choose/role-choose.component';

import { SignupPage } from './signup.page';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
    path: '',
    component: SignupPage,
    children: [
      { path: '', redirectTo: 'role', pathMatch: 'full' },
      {
        path: 'role',
        component: RoleChooseComponent
      },
      {
        path: 'create-college',
        component: CreateCollegeComponent
      },
      {
        path: 'join-college',
        component: JoinCollegeComponent
      },
      {
        path: ':role',
        component: UserDetailsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule { }
