import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-meeting-status',
  templateUrl: './meeting-status.component.html',
  styleUrls: ['./meeting-status.component.scss']
})
export class MeetingStatusComponent implements OnInit {

  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

}
