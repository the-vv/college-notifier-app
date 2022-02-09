import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';

const components = [
  SideMenuComponent
];

@NgModule({
  declarations: [
    SideMenuComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
