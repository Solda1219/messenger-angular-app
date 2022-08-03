import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonFunctionService } from '../../function/commonFunction.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  formGroup: FormGroup;
  currentLanguage = "english";
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public cf:CommonFunctionService,
  ) {}

  async ngOnInit() {
    this.formGroup = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  //LanguageChagePart
  changeLang(language: string) {
    this.currentLanguage = language;
    localStorage.setItem('language', language)
  }
  login() {
    if(!this.formGroup.valid) {
      this.userService.errorMessage('Please input account and password correctly.')
      return
    }
    const loginData = this.formGroup.value;
    this.loading = true;
    this.userService.postRequest('_api/user/login', loginData, false).subscribe(
      res => {
        this.loading = false;
        this.userService.setToken(
          {
            token: res['token'],
            userInfo: res['userInfo'],
            expiresAt: res['expiresAt'],
          }
        );
        this.userService.setUserInfo(
          res['userInfo']
        );
        this.userService.gotoFirstPage()
      },
      err => {
        this.loading = false;
        this.userService.handleError(err)
      }
    )
  }
  gotoLogin(){
    this.userService.gotoLogin();
  }
}
