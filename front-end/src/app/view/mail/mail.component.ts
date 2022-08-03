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
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  loading;
  dept = [];
  param = {
    dept:'all',
    key:''
  };
  item = [];
  root_item = [];
  moveTo;
  send_msg = {
    from:'',
    to: '',
    subject: '',
    content:'',
  };
  detailMsgId = 0;
  is_lock = true;
  is_show = false;
  tbHeader = ['From', 'To', 'Subject'];
  tbCol = ['mail_from','mail_to','subject'];
  displayedColumns: string[] = ['select','No','mail_from','mail_to','subject','status','Action'];
  specialCol = ['permission']
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  formSetting = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
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
    console.log("this.pagenator", this.paginator);
    // this.deptget();
    // this.setTableList();
    this.getMsgData();
    // await this.search()
  }
  ngAfterViewInit() {
    // this.tableList.paginator = this.paginator;
    // this.tableList.sort = this.sort;
  }
  async getMsgData() {
    try {
      var receiver= this.userService.getUserInfo().email;
      const res = await this.userService.postRequest('_api/mails/get', { receiverMail: receiver }).toPromise();
      // this.tableList = res['result'];
      this.item = res['result'];
      this.tableList = new MatTableDataSource(this.item)
      this.tableList.paginator = this.paginator;
      this.tableList.sort = this.sort;
    } catch (err) {
      this.userService.handleError(err);
    }
  }
 
  // async search() {
  //   this.loading = true;
  //   try {
  //     const res = await this.userService.postRequest('_api/user/get').toPromise()
  //     this.item = res['result'];
  //     this.setTableList();
  //   } catch (err) {
  //     this.userService.handleError(err)
  //   }
  //   this.loading = false;
  // }
  formSet(item=null) {
    this.is_lock = false;
    this.is_show = false;
    if(item==null){
      this.formGroup = this._formBuilder.group({
        // memberId: [false],
        mail_from: [''],
        mail_to: [''],
        subject: [''],
        status:[''],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        mail_from: [''],
        mail_to: [''],
        subject: [''],
        status:[''],
      });
    }
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/mails/del', this.selected_items).toPromise()
      this.getMsgData();
      this.userService.handleSuccess(res['message']);
      this.selection.clear();
      // await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }

  async sendmessage(){
    if(!this.send_msg.content) {
      this.userService.errorMessage('Please input message to send.');
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/user/sendmessage',this.send_msg).toPromise()
      this.userService.handleSuccess(res['message']);
      this.closeModal('sendModal');
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
  closeModal(id){
    $(`#${id}`).modal('hide')
  }
  async showDetailModal (item){
    this.send_msg = {
      from: item.mail_from,
      to: item.mail_to,
      subject: item.subject,
      content: item.content
    }
    const res = await this.userService.postRequest('_api/mails/read', {id: item.id}).toPromise()
    this.getMsgData();
    $('#viewDetailModal').modal('show')
  }
  showMailModal() {
    var from= this.userService.getUserInfo().email;
    this.send_msg = {
      from: from,
      to: '',
      subject: '',
      content:'',
    };
    $('#sendModal').modal('show')
  }
  //table

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
    const selected = this.tableList.data.filter(t => this.selection.isSelected(t))
    this.selectedItems.emit(selected)
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableList? this.tableList.data.length: '0';
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


