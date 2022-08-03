import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { CommonFunctionService } from '../../function/commonFunction.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  _opened = false;
  curRoute: string = '';
  sidebarMinimized = false;
  user;
  currentLanguage = "english";
  timer;
  tmOb = {
    year: 0,
    month: 0,
    day: 0,
    h: 0,
    m: 0,
  }
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: Router,
    public cf: CommonFunctionService,
  ) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
}
