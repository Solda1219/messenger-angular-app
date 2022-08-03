import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-group-organize',
  templateUrl: './group-organize.component.html',
  styleUrls: ['./group-organize.component.scss']
})
export class GroupOrganizeComponent implements OnInit {
  _opened = true;
  selected_group;
  userContentChanged;
  constructor(
    public cf: CommonFunctionService,
  ) { }

  ngOnInit(): void {
  }
}
