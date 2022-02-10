import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringPipe } from './pipes/string.pipe';



@NgModule({
  declarations: [StringPipe],
  imports: [
    CommonModule
  ],
  exports: [StringPipe]
})
export class CommonExportsModule { }
