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
  selector: 'app-check-message', 
  templateUrl: './check-message.component.html',
  styleUrls: ['./check-message.component.scss']
})
export class CheckMessageComponent implements OnInit {
  loading;
  item = [];
  tbHeader = ['Title', 'Content','Sender','Receiver','R/S','MessageTime','RecordingSize','CloudCopied','PlaybackCount'];
  tbCol = ['title', 'content','sender','receiver','received','created_at','cloudCopy','fileSize','is_read'];
  specialCol = [];
  displayedColumns: string[] = ['select','title', 'sender','receiver', 'received','created_at','cloudCopy','fileSize','is_read','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  formGroupEdit: FormGroup;
  uploadForm: FormGroup;
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
    this.editformSet();
    this.uploadFormSet();
    this.setTableList();
    this.search();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      $(".datepicker").flatpickr({
        enableTime: false,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
    },300)
  }
  async search() {
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    data.from = data.from+' 00:00:00';
    data.to = data.to+' 23:59:59'; 
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/messageBoard/checkMessage',data).toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  formSet(item=null) {
      this.formGroup = this._formBuilder.group({
        from:[this.cf.getDateStringYYYYMMDD(new Date())],
        to:[this.cf.getDateStringYYYYMMDD(new Date())],
        type:[0],//0-all,1-received,2-sent
        title:[''],
        read:[-1],//-1-all,0-unread,1-read
      });
  }
  editformSet(item=null) {
    if(!item){
      this.formGroupEdit = this._formBuilder.group({
        meetingId:[''],
        title:['',Validators.required],
        content:[''],
        is_mine:[1]
      });
    }else{
      this.formGroupEdit = this._formBuilder.group({
        meetingId:[item.meetingId],
        title:[item.is_mine==1?item.title_s:item.title_r,Validators.required],
        content:[item.is_mine==1?item.content_s:item.content_r,Validators.required],
        is_mine:[item.is_mine]
      });
    }
  }
  uploadFormSet(item:any=null) {
    if(item){
      this.uploadForm = this._formBuilder.group({
        title: ['',Validators.required],
        key:['',Validators.required],
        meetingId:[item.meetingId],
        ownerId:[item.coordinatorId],
        filename:[item.fileName]
      });
    }else{
      this.uploadForm = this._formBuilder.group({
        title: ['',Validators.required],
        key:['',Validators.required],
        meetingId:[''],
        ownerId:[''],
        filename:['']
      });
    }
  }
  async edit() {
    if(this.formGroupEdit.invalid){
      this.userService.errorMessage('Please input all fields correctly.');
      return;
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/messageBoard/editMessage',this.formGroupEdit.value).toPromise()
      this.userService.handleSuccess(res['message'])
      this.search();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
    //read
    async read(item,status){
      this.loading = true;
      try{
        const res = await this.userService.postRequest('_api/messageBoard/read',{data:item,status:status}).toPromise();
        this.search();
       }catch(err){
        this.userService.handleError(err);
       }
       this.loading = false;
    }
  async playback(item){
    this.loading = true;
    try{
     const res = await this.userService.postRequest('_api/meeting/getplayback',item).toPromise();
     this.search();
     window.open(res['result'], "_blank");
    }catch(err){
     this.userService.handleError(err);
    }
    this.loading = false;
  }
  async ToCloud(){
    this.loading = true;
    if(this.uploadForm.invalid){
      this.userService.errorMessage('Please input all fields correctly.');
      return;
    }
    try{
     const res = await this.userService.postRequest('_api/messageBoard/saveToCloud',this.uploadForm.value).toPromise();
     this.userService.handleSuccess(res['message']);
     this.search();
    }catch(err){
     this.userService.handleError(err);
    }
    this.loading = false;
  }
  //table
  setTableList() {
    const key = this.formGroup.value['title'];
    const pData = JSON.parse(JSON.stringify(this.item));
    const filtered = pData.filter(x=>!key||String(x.title).indexOf(key)!=-1)
    this.tableList = new MatTableDataSource(filtered)
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


