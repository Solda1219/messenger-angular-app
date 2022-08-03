import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.scss']
})
export class SysteminfoComponent implements OnInit {

  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

}
