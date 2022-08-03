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
declare var $:any;
@Component({
  selector: 'app-address-book-user-content',
  templateUrl: './address-book-user-content.component.html',
  styleUrls: ['./address-book-user-content.component.scss']
})
export class AddressBookUserContentComponent implements OnInit {
  loading;
  dept = [];
  param = {
    dept:'all',
    key:'',
    group:''
  };
  item = [];
  root_item = [];
  moveTo;
  send_msg = {
    from:'',
    to:'',
    content:'',
  };
  is_lock = true;
  is_show = false;
  tbHeader = ['Name', 'Phone', 'Email', 'Dept','Role'];
  tbCol = ['nativeName','phone','email','dept_name','role_name'];
  displayedColumns: string[] = ['select','No','nativeName','phone','email','dept_name','role_name'];
  specialCol = ['permission']
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  formSetting = [];
  @Input('groups') groups = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort ) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @Output() userCreated = new EventEmitter();
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) {
  }
  async ngOnInit() {
    this.deptget();
    this.setTableList();
    await this.search()
  }
  async deptget(message=true){
    try{
       const res = await this.userService.postRequest('_api/dept/get').toPromise();
       this.dept = res['result'].filter(x=>x.dept_level!=0);
       this.makeTree(res['result'])
    }catch(err){
      this.userService.handleError(err);
    }
  }
  getdept(dept_id){
    for(let i = 0; i < this.dept.length; i++)
      if(this.dept[i].id == dept_id) return this.dept[i].dept_name
    return '';
  }
  setDept(dept_id){
    this.formGroup.patchValue({
      dept_id:dept_id
    })
  }
  async search() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/getInsideUser').toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
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
        data[i].children = JSON.parse(JSON.stringify(getChildren(data,data[i])));
        for(let k = 0 ; k < data[i].children.length; k++){
          const {dept_level} = data[i].children[k];
          if(dept_level==1){
            data[i].children[k].children= JSON.parse(JSON.stringify(getChildren(data,data[i].children[k])));
          }
        }
        this.root_item.push(data[i]);
      }
    }
    if(this.root_item.length>0) this.root_item[0].is_collapse = true;
  }
  async createUser(){
    if(this.selection.selected.length==0) {
      this.userService.errorMessage('Please select items to add address.');
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/createIn',{data:this.selection.selected,group_name:this.param.group}).toPromise()
      this.userService.handleSuccess(res['message']);
      this.userCreated.emit();
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  //table
  setTableList() {
    this.selection.clear();
    let data = [];
    if(this.param.dept!='all') data = this.item.filter(x=>x.dept_id==this.param.dept)
    else data = this.item
    if(this.param.key) data = data.filter(x=>x.nativeName==this.param.key||x.phone==this.param.key||x.email==this.param.key||x.dept_name==this.param.key)
    this.tableList = new MatTableDataSource(data)
    setTimeout(()=>{
      this.tableList.paginator = this.paginator;
      this.tableList.sort = this.sort;
    },300);
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
  onSelectionChange(){
    const selected = this.tableList.data.filter(t=>this.selection.isSelected(t))
    this.selectedItems.emit(selected)
  }
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


