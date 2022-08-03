import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
//import for table widget and modals
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent implements OnInit {
  loading;
  group = [];
  selected_id;
  formGroup: FormGroup;
  formSetting = [];
  @Input('userContentChanged') userContentChanged;
  @Output() selectedItems = new EventEmitter();
  @ViewChild('createModal') public createModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  willdelete;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  async ngOnInit() {
    this.formSet()
    this.loading = true;
    await this.search()
    this.loading = false;
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["userContentChanged"]) {
      this.search()
    }
  }
  async search() {
    try {
      const res = await this.userService.postRequest('_api/group/group/getGroup').toPromise()
      this.group = res['result'];
      if(this.group.length>0 && !this.selected_id) this.selectGroup(this.group[0]);
    } catch (err) {
      this.userService.handleError(err)
    }
  }
  showCreateModal(){
    this.formSet();
    this.createModal.show();
  }
  showEditModal(item){
    this.formSet(item);
    this.createModal.show();
  }
  showDeleteModal(item){
    this.willdelete = item;
    this.warningModal.show();
  }
  selectGroup(item){
    this.selected_id = item.id;
    this.selectedItems.emit(item);
  }
  checkForm(){
    if(!this.formGroup.valid){
      this.userService.errorMessage('Please input items correctly');
      return false
    }else return true;
  }
  formSet(item=null) {
    if(item==null){
      this.formGroup = this._formBuilder.group({
        id: [''],
        name: ['',Validators.required],
      });
      this.formSetting = [//0-hidden,1-enabled,2-disabled,3-readonly
        {label:'',name:'id',placeText:'', required:true,status:0,error:'This field is required.'},
        {label:'Group Name',name:'name',placeText:'Group Name',required:true,status:1,error:'This field is required.'},
      ];
    }else{
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        name: [item.name,Validators.required],
      });
      this.formSetting = [//0-hidden,1-enabled,2-disabled,3-readonly
        {label:'',name:'id',placeText:'', required:true,status:0, error:''},
        {label:'Group Name',name:'name',placeText:'Group Name',required:true,status:1,error:'This field is required.'},
      ];
    }
  }
  async create(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/group/group/createGroup',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async edit(){
    try {
      const res = await this.userService.postRequest('_api/group/group/editGroup',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/group/group/delGroup',this.willdelete).toPromise()
      this.userService.handleSuccess(res['message']);
      if(this.selected_id == this.willdelete.id) this.selected_id = undefined;
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
}


