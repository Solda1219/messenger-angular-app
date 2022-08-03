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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading;
  dept = [];
  item = [];
  moveTo = -1;
  formGroup: FormGroup;
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
    // this.deptget();
    await this.getMyprofile()
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
        nativeName: ['',Validators.required],
        email: [''],
        phone: [''],
        password:[''],
        re_pass:[''],
        dept_name:[''],
        allow_share:[1],
        avatar:[],
        avatar_file:[],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        email: [item.email],
        nativeName: [item.nativeName,Validators.required],
        phone: [item.phone],
        password:[''],
        re_pass:[''],
        dept_name:[item.dept_name], 
        allow_share:[item.allow_share],
        avatar:[item.avatar],
        avatar_file:[],
      });
      console.log(this.formGroup.value)
    }
  }
  setFile(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
        this.avatar_tag.nativeElement.src = reader.result
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
    if(this.formGroup.value['password']!=this.formGroup.value['re_pass']){
      this.userService.errorMessage('Please retype password correctly');
      return;
    }
    let formData = new FormData();
    const datetimestamp = Date.now();
    const data = JSON.parse(JSON.stringify(this.formGroup.value))
    delete data['re_pass'];
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
      const res = await this.userService.postRequest('_api/profile/edit',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      this.userService.setUserInfo(res['result'])
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


