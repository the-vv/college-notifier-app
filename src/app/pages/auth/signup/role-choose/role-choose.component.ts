import { Component, OnInit } from '@angular/core';
import { EUserRoles } from 'src/app/interfaces/commons-enum';

@Component({
  selector: 'app-role-choose',
  templateUrl: './role-choose.component.html',
  styleUrls: ['./role-choose.component.scss'],
})
export class RoleChooseComponent implements OnInit {

  public eUserRoles = EUserRoles;

  constructor() {
   }

  ngOnInit() {}

}
