import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { UserService } from '../../service/user.service';
//import for table widget and modals
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-weboffice-setting',
  templateUrl: './weboffice-setting.component.html',
  styleUrls: ['./weboffice-setting.component.scss']
})
export class WebofficeSettingComponent implements OnInit {
  loading;
  dept = [];
  item = [];
  moveTo = -1;
  formGroup: FormGroup;
  visiturl;
  msgurl;
  @ViewChild('preview_avatar') public avatar_tag:ElementRef;
  @ViewChild('fileinput') public fileinput:ElementRef;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  async ngOnInit() {
    this.formSet();
    const userid = this.userService.getUserInfo()['memberId'];
    // this.deptget();
    await this.getMyprofile();
    this.visiturl = `http://117.21.178.36/mmc/gotomeeting.php?u=${userid}&c=visit`;
    this.msgurl = `http://117.21.178.36/mmc/gotomeeting.php?u=${userid}&c=msg`;
  }
  async deptget(message=true){
    try{
       const res = await this.userService.postRequest('_api/dept/get').toPromise();
       this.dept = res['result'].filter(x=>x.dept_level==1);
    }catch(err){
      this.userService.handleError(err);
    }
  }
  async getMyprofile() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/profile/get').toPromise()
      this.formSet(res['result']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  formSet(item=null) {
    if(item==null){
      this.formGroup = this._formBuilder.group({
        messageLimit: [0,Validators.required],
        emailPrivacy: [0,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        leaveMessagePrivacy: [0,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        onlinePrivacy:[0,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        leaveMessageOutside:[1,Validators.required],//1-yes,0-no
        maxGuest:[100,Validators.required],
        diskQuota:[1000,Validators.required],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        messageLimit: [item.messageLimit,Validators.required],
        emailPrivacy: [item.emailPrivacy,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        leaveMessagePrivacy: [item.leaveMessagePrivacy,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        onlinePrivacy:[item.onlinePrivacy,Validators.required],//0-all,1-onlytomycontact,2-never,3-tomymembers
        leaveMessageOutside:[item.leaveMessageOutside,Validators.required],//1-yes,0-no
        maxGuest:[item.maxGuest,Validators.required],
        diskQuota:[item.diskQuota,Validators.required],
      });
    }
  }
  async edit(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/webofficesetting/edit',{data:this.formGroup.value}).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/avtars.png';
   //Do other stuff with the event.target
   }
}


