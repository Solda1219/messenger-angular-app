import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
//import for table widget and modals
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.component.html',
  styleUrls: ['./user-content.component.scss']
})
export class UserContentComponent implements OnInit {
  loading;
  @Input('group') group;
  item = [];
  tbHeader = ['Email'];
  tbCol = ['email'];
  displayedColumns: string[] = ['No','email','Action'];
  specialCol = ['permission']
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  formGroup: FormGroup;
  formSetting = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @Output() componentChange = new EventEmitter();
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
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["group"]) {
      this.loading = true;
      this.search()
      this.loading = false;
    }
  }
  async search() {
    if(!this.group) return;
    try {
      const res = await this.userService.postRequest('_api/group/user/getUser',this.group).toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      console.log(err)
      this.userService.handleError(err)
    }
  }
  showCreateModal(){
    if(!this.group){
      this.userService.errorMessage("Please select group.");
      return
    }
    this.formSet();
    this.createModal.show();
  }
  showEditModal(item){
    this.formSet(item);
    this.createModal.show();
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
        email: ['',[Validators.required,Validators.email]],
        group_id:[this.group.id]
      });
      this.formSetting = [//0-hidden,1-enabled,2-disabled,3-readonly
        {label:'',name:'id',placeText:'', required:true,status:0,error:'This field is required.'},
        {label:'Email',name:'email',placeText:'Email',required:true,status:1,error:'Please input valid email.'},
      ];
    }else{
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        email: [item.email,[Validators.required,Validators.email]],
        group_id:[this.group.id]
      });
      this.formSetting = [//0-hidden,1-enabled,2-disabled,3-readonly
        {label:'',name:'id',placeText:'', required:true,status:0, error:''},
        {label:'Email',name:'email',placeText:'Email',required:true,status:1, error:'This field is required.'},
      ];
    }
  }
  async create(){
    try {
      const res = await this.userService.postRequest('_api/group/user/createUser',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
      this.componentChange.emit(Date.now())
    } catch (err) {
      this.userService.handleError(err)
    }
  }
  async edit(){
    try {
      const res = await this.userService.postRequest('_api/group/user/editUser',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/group/user/delUser',this.willdelete).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
      this.componentChange.emit(Date.now())
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  //table
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
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
}


