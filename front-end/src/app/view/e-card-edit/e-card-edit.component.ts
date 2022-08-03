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

@Component({
  selector: 'app-e-card-edit',
  templateUrl: './e-card-edit.component.html',
  styleUrls: ['./e-card-edit.component.scss']
})
export class ECardEditComponent implements OnInit {
  loading;
  dept = [];
  item = [];
  moveTo = -1;
  formGroup: FormGroup;
  currentLanguage = "english";
  replace_text = false;
  time_now;
  file;
  qrcode= "This user not set e-card yet.";
  @ViewChild('preview_avatar') public avatar_tag:ElementRef;
  @ViewChild('fileinput') public fileinput:ElementRef;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  //LanguageChagePart
  changeLang() {
      localStorage.setItem('language', this.currentLanguage)
  }
  async ngOnInit() {
    this.formSet();
    this.getCard();
    // this.deptget();
  }
  async deptget(message=true){
    try{
       const res = await this.userService.postRequest('_api/dept/get').toPromise();
       this.dept = res['result'].filter(x=>x.dept_level==1);
    }catch(err){
      this.userService.handleError(err);
    }
  }
  async getCard() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/e-card/get').toPromise();
      if(res['result']==false){
        this.getMyprofile();
      }else{
        this.formSet(res['result']);
        this.qrcode = res['result']['qr_code'];
      }
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async getMyprofile() {
    try {
      const res = await this.userService.postRequest('_api/profile/get').toPromise();
      this.formSet(
        {
          email:res['result']['email'],
          duty:res['result']['duty'],
          company:res['result']['company'],
          phone:res['result']['phone'],
          name:res['result']['nativeName']
        });
    } catch (err) {
      this.userService.handleError(err)
    }
  }
  preview(){
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    data.file  = this.file;
    this.time_now = String(new Date().getTime());
    localStorage.setItem(this.time_now,JSON.stringify(data));
  }
  formSet(item=null) {
    if(item==null){
      this.formGroup = this._formBuilder.group({
        name: ['',Validators.required],
        duty: [''],
        company: ['',Validators.required],
        email:[''],
        phone:[''],
        avatar:[],
        avatar_file:[],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        name: [item.name?item.name:"",Validators.required],
        duty: [item.duty?item.duty:""],
        company: [item.company?item.company:"",Validators.required],
        email:[item.email?item.email:""],
        phone:[item.phone?item.phone:""],
        avatar:[item.avatar?item.avatar:""],
        avatar_file:[],
      });
    }
  }
  setFile(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
        this.avatar_tag.nativeElement.src = reader.result;
        this.file = reader.result;
        this.formGroup.patchValue(
          {
            avatar_file:event.target.files[0]
          }
        );
      }
    }
  }
  openFileInput(){
    this.fileinput.nativeElement.click();
  }
  async edit(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    let formData = new FormData();
    const datetimestamp = Date.now();
    const data = JSON.parse(JSON.stringify(this.formGroup.value))
    if(this.formGroup.value['avatar_file']){
      const nn = 'avatar'+'-'+datetimestamp+'.' + this.formGroup.value['avatar_file'].name.split('.')[this.formGroup.value['avatar_file'].name.split('.').length -1];
      data['avatar'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['avatar_file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='avatar_file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/e-card/edit',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      this.file = undefined;
      this.getCard();      
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/avatar_22.jpg';
   //Do other stuff with the event.target
  }
}


