import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
//import for table widget and modals
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare var $:any;
@Component({
  selector: 'app-cloud-disk',
  templateUrl: './cloud-disk.component.html',
  styleUrls: ['./cloud-disk.component.scss']
})
export class CloudDiskComponent implements OnInit {
  loading;
  item = [];
  tbHeader = ['Title','Keyword','File name', 'Upload time', 'Size'];
  tbCol = ['title','keyword','file_realname', 'created_at', 'size'];
  specialCol = [];
  displayedColumns: string[] = ['select','title', 'keyword','file_realname','created_at', 'size','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  uploadForm: FormGroup;
  shareForm: FormGroup;
  contactList = [];
  userList = [];
  selectedUsers = [];
  dropdownSettingsOfUser:IDropdownSettings = {
    singleSelection: false,
    idField: 'memberId',
    textField: 'nativeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileinput') public fileinput:ElementRef;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  async ngOnInit() {
    this.formSet();
    this.uploadFormSet();
    this.shareFormSet();
    this.setTableList();
    this.search();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      $(".datepicker").flatpickr({
        enableTime: false,
        altFormat: "F j, Y",
        dateFormat: "m/d/Y",
    });
    },300)
  }
  async search() {
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    data['from'] = ''+this.cf.getDateStringYYYYMMDD(data['from'])+' 00:00:00';
    data['to'] = ''+this.cf.getDateStringYYYYMMDD(data['to'])+' 23:59:59';
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/cloudDiskController/get',data).toPromise()
      this.item = res['result'];
      this.userList = res['users'];
      this.contactList = res['contact'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  formSet(item=null) {
      this.formGroup = this._formBuilder.group({
        from:[this.cf.getDateStringMMDDYYYY(new Date())],
        to:[this.cf.getDateStringMMDDYYYY(new Date())],
        title:[''],
      });
  }
  uploadFormSet(item=null) {
    if(item){
      this.uploadForm = this._formBuilder.group({
        id:[item.id],
        title: [item.title,Validators.required],
        key:[item.keyword,Validators.required],
        file_path:[item.path,Validators.required],
        path:[item.path],
        file:[],
      });
    }
    else{
      this.uploadForm = this._formBuilder.group({
        id:[],
        title: ['',Validators.required],
        key:['',Validators.required],
        file_path:['',Validators.required],
        path:[''],
        file:[],
      });
    }
    if(this.fileinput) this.fileinput.nativeElement.value="";
  }
  shareFormSet(item=null) {
    this.shareForm = this._formBuilder.group({
      cloudId:[item?item.id:'',Validators.required],
      shareTo: [0,Validators.required],
      users:[''],
    });
  }
  refreshShareForm(){
    this.shareForm.patchValue({
      shareTo: 0, //0-all users, 1-all contacts, 2-special
      users:-1,
    })
  }
  showShareModal(item){
    this.shareFormSet(item);
    $('#sharemodal').modal('show')
  }
  async share(){
    const data = JSON.parse(JSON.stringify(this.shareForm.value));
    const {shareTo} = data;
    if(shareTo==0) data['users'] = this.userList;
    if(shareTo==1) data['users'] = this.contactList;
    if(shareTo==2){
      if(this.selectedUsers.length==0){
        this.userService.errorMessage('Please select users to share.');
        return;
      }      
      data['users'] = JSON.parse(JSON.stringify(this.selectedUsers));
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/cloudDiskController/share',data).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async upload(){
    if(this.uploadForm.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    let formData = new FormData();
    const datetimestamp = Date.now();
    const data = JSON.parse(JSON.stringify(this.uploadForm.value))
    if(this.uploadForm.value['file']){
      const nn =''+ datetimestamp + "." + this.uploadForm.value['file'].name.split('.')[this.uploadForm.value['file'].name.split('.').length -1];
      data['path'] = '_public/cloud/'+nn;
      formData.append("files", this.uploadForm.value['file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/cloudDiskController/upload',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      // this.closeModal('upload');
      this.search();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async edit(){
    if(this.uploadForm.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    let formData = new FormData();
    const datetimestamp = Date.now();
    const data = JSON.parse(JSON.stringify(this.uploadForm.value))
    if(this.uploadForm.value['file']){
      const nn =''+ datetimestamp + "." + this.uploadForm.value['file'].name.split('.')[this.uploadForm.value['file'].name.split('.').length -1];
      data['path'] = '_public/cloud/'+nn;
      formData.append("files", this.uploadForm.value['file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/cloudDiskController/edit',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      // this.closeModal('upload');
      this.search();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/cloudDiskController/del',this.selected_items).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  showDeleteModal(item){
    if(item.length==0){
      this.userService.errorMessage('Please select items to delete')
      return
    }
    this.selected_items = item;
    $('#deleteModal').modal('show')
  }
  setFile(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
        this.uploadForm.patchValue(
          {
            file:event.target.files[0],
            file_path:event.target.files[0].name,
          }
        );
      }
    }
  }
  openFileInput(){
    this.fileinput.nativeElement.click();
  }
  closeModal(id){
    $(`#${id}`).modal('hide');
  }
  //table
  setTableList() {
    let data = [];
    const key = this.formGroup.value['title'];
    if(key) data = this.item.filter(x=>x.title==key||String(x.keyword).indexOf(key)!=-1);
    else data = this.item;
    this.tableList = new MatTableDataSource(data)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  //mat-table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableList.filter = filterValue.trim().toLowerCase();

    if (this.tableList.paginator) {
      this.tableList.paginator.firstPage();
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableList.data.forEach(row => this.selection.select(row));
  }
  
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/avtars.png';
   //Do other stuff with the event.target
   }
}


