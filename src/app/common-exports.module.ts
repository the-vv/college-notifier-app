import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringPipe } from './pipes/string.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';



@NgModule({
  declarations: [StringPipe],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicSelectableModule
  ],
  exports: [StringPipe, FormsModule, ReactiveFormsModule, IonicSelectableModule]
})
export class CommonExportsModule { }
