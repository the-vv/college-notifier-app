import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { CommonExportsModule } from 'src/app/common-exports.module';import {AvatarModule} from 'primeng/avatar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CommonExportsModule,
    AvatarModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
