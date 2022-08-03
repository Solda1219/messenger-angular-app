import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $:any;
@Component({
  selector: 'app-dept-manage',
  templateUrl: './dept-manage.component.html',
  styleUrls: ['./dept-manage.component.scss']
})
export class DeptManageComponent implements OnInit {
  loading = false;
  formGroup: FormGroup;
  root_level = 0;
  root_item = [];
  item = [];
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public cf:CommonFunctionService,
  ) {
  }
 
  ngOnInit(): void {
    this.formset();
    this.get();
  }
  formset(item:any=false){
    if(item==false){
      this.formGroup = this._formBuilder.group({
        id:[''],
        dept_id: [String(new Date().getTime()), Validators.required],
        dept_name: ['', Validators.required],
        super_dept:this.root_level==0?['']:['', Validators.required],
        dept_phone: ['', Validators.required],
        dept_fax: [''],
        dept_detail: [''],
        dept_level: [this.root_level, Validators.required],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        id:[item.id],
        dept_id: [item.dept_id, Validators.required],
        dept_name: [item.dept_name, Validators.required],
        super_dept: this.root_level==0?[item.super_dept]:[item.super_dept, Validators.required],
        dept_phone: [item.dept_phone, Validators.required],
        dept_fax: [item.dept_fax],
        dept_detail: [item.dept_detail],
        dept_level: [this.root_level, Validators.required],
      });
    }
  }
  superdept_set(id){
    this.formGroup = this._formBuilder.group({
      id:[''],
      dept_id: [String(new Date().getTime()), Validators.required],
      dept_name: ['', Validators.required],
      super_dept: [id],
      dept_phone: ['', Validators.required],
      dept_fax: [''],
      dept_detail: [''],
      dept_level: [this.root_level, Validators.required],
    });
  }
  async get(message=true){
    try{
       const res = await this.userService.postRequest('_api/dept/get').toPromise();
       this.makeTree(res['result']);
       this.item = res['result'];
       if(message){
         if(this.item.length==0) this.userService.errorMessage('Depts is empty now.')
       }
    }catch(err){
      this.userService.handleError(err);
    }
  }
  async create(){
    try{
       if(this.formGroup.invalid){
         console.log(this.formGroup.value)
         this.userService.errorMessage('Please input all fields correctly');
         return
       }
       const res = await this.userService.postRequest('_api/dept/create',this.formGroup.value).toPromise();
       this.userService.handleSuccess(res['message']);
       this.get();
    }catch(err){
      this.userService.handleError(err);
    }
  }
  async del(){
    try{
       if(!this.formGroup.value['id']){
         this.userService.errorMessage('Please select item to delete.');
         return
       }
       const res = await this.userService.postRequest('_api/dept/del',this.formGroup.value).toPromise();
       this.userService.handleSuccess(res['message']);
       this.get();
       this.formset();
    }catch(err){
      this.userService.handleError(err);
    }
  }
  showDeleteModal(){
    if(!this.formGroup.value['id']){
      this.userService.errorMessage('Please select items to delete.');
      return
    }
    $('#deleteModal').modal('show')
  }
  makeTree(item){
    const previos = JSON.parse(JSON.stringify(this.root_item));
    const getChildren = (arr,c)=>{
      const result = [];
      for(let i = 0; i < arr.length; i++){
        if(c.id == arr[i].super_dept) result.push(arr[i])
      }
      return result
    }
    const data = JSON.parse(JSON.stringify(item));
    this.root_item = [];
    for(let i = 0 ; i < data.length; i++){
      const {dept_level} = data[i];
      if(dept_level==0){
        data[i].is_collapse = this.getCollapse(previos,data[i].id);
        data[i].children = JSON.parse(JSON.stringify(getChildren(data,data[i])));
        for(let k = 0 ; k < data[i].children.length; k++){
          const {dept_level} = data[i].children[k];
          if(dept_level==1){
            data[i].children[k].is_collapse = this.getCollapse(previos,data[i].children[k].id);
            data[i].children[k].children= JSON.parse(JSON.stringify(getChildren(data,data[i].children[k])));
          }
        }
        this.root_item.push(data[i]);
      }
    }
    if(this.root_item.length>0) this.root_item[0].is_collapse = true;
  }
  getCollapse(arr,id){
    for(let i = 0; i < arr.length; i++)
     {
       if(arr[i].id == id) return arr[i].is_collapse;
       for(let k = 0; k < arr[i]['children'].length; k++)
        {
          if(arr[i]['children'][k].id == id) return arr[i]['children'][k].is_collapse;
        }
     }
    return false; 
  }
  getSuperiorRoot(){
    let result = [];
    if(this.root_level==1) result = this.item.filter(x=>x.dept_level==0)
    if(this.root_level==2) result = this.item.filter(x=>x.dept_level==1)
    return result
  }
}
