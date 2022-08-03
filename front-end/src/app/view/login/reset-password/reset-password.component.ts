import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  AccountFormGroup: FormGroup;
  NewPasswordFormGroup: FormGroup;
  password_reseted = false;
  notRobot = false;
  isEditable = false;
  captcha;
  @ViewChild('captchaImage') captchaImageTag: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public cf:CommonFunctionService,
  ) {}

  async ngOnInit() {
    this.resetFormSet();
  }
  async resetFormSet() {
    this.notRobot = false;
    this.AccountFormGroup = this._formBuilder.group({
      phone: ['', [Validators.required,Validators.pattern(this.cf.regex_chinesePhoneNumber)]],
      verification:['', Validators.required],
      code:['',Validators.required],
      pass:['',Validators.required],
    });
    this.NewPasswordFormGroup = this._formBuilder.group({
      new: ['', [Validators.required,Validators.pattern(this.cf.regex_numberAndPassword)]],
      confirm:['',Validators.required],
      pass:['',Validators.required],
    });
    await this.getCaptcha();
  }
  //captcha
  async getCaptcha(){
    try{
      const res = await this.userService.getRequest('_api/captchaBlob/100/50/',false).toPromise();
      this.captcha = res['text'];
      this.AccountFormGroup.patchValue(
        {verification:''}
      );
      this.captchaImageTag.nativeElement.src = res['image'];
    }
    catch(err){

    }
  }
  async getVerification(){
    const inputed_verification = this.AccountFormGroup.value['verification'];
    if(this.AccountFormGroup.controls['phone'].invalid){
      this.userService.errorMessage('Please input valid phone number.');
      return
    }
    if(!inputed_verification){
      this.userService.errorMessage('Please input verification code.');
      return
    }else{
      //check captcah
      if(inputed_verification!= this.captcha){
        this.userService.errorMessage('Captcha is not corret!');
        await this.getCaptcha();
        return
      }else{
       this.notRobot = true;
      }
    }
    try{
      const res = await this.userService.postRequest('_api/sendPhoneverify',this.AccountFormGroup.value,false).toPromise();
      this.userService.handleSuccess(res['message'])
    }
    catch(err){
     this.userService.handleError(err)
    }
  }
  async checkVerification(){
    const inputed_verification = this.AccountFormGroup.value['verification'];
    if(this.AccountFormGroup.controls['phone'].invalid){
      this.userService.errorMessage('Please input valid phone number.');
      return
    }
    if(!inputed_verification){
      this.userService.errorMessage('Please input verification code.');
      return
    }
    if(!this.notRobot){
      this.userService.errorMessage('Please input captcha to verify no robot.');
      return
    }
    if(!this.AccountFormGroup.value['code']){
      this.userService.errorMessage('Please input sms code.');
      return
    }
    try{
      const res = await this.userService.postRequest('_api/checkPhoneverify',this.AccountFormGroup.value,false).toPromise();
      this.AccountFormGroup.patchValue({
        pass:'ok'
      })
      this.stepper.next();
    }
    catch(err){
     this.userService.handleError(err)
    }
  }
  confirmResetPassword(){
    if(this.NewPasswordFormGroup.controls['new'].invalid){
      this.userService.errorMessage("Password must be at least 8 letter and number.");
      return
    }
    if(this.NewPasswordFormGroup.value['new']!==this.NewPasswordFormGroup.value['confirm']){
      this.userService.errorMessage('Password must be match.');
      return
    }
    this.userService.postRequest('_api/user/resetPasswordByPhone',{
      phone:this.AccountFormGroup.value['phone'],
      password:this.NewPasswordFormGroup.value['new'],
      code:this.AccountFormGroup.value['code'],
    },false).subscribe(
      res=>{
        this.NewPasswordFormGroup.patchValue({
          pass:'ok',
        })
        this.stepper.next();
      },
      err=>{
        this.userService.handleError(err);
      }
    )
    
  }
  //LanguageChagePart
  gotoLogin(){
    this.userService.gotoLogin();
  }
}
