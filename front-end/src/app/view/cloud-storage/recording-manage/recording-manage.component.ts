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
  selector: 'app-recording-manage',
  templateUrl: './recording-manage.component.html',
  styleUrls: ['./recording-manage.component.scss']
})
export class RecordingManageComponent implements OnInit {
  loading;
  item = [];
  tbHeader = ['Title', 'Host', 'Meeting Time','Meeting Type','Duration','Size','CloudCopied','PlaybackCount'];
  tbCol = ['title', 'email', 'started_at','typeName','duration','fileSize','cloudCopy','is_read'];
  specialCol = [];
  displayedColumns: string[] = ['select','title', 'email', 'started_at','typeName','duration','fileSize','cloudCopy','is_read','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  uploadForm: FormGroup;
  uploadForm11: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileinput') public fileinput:ElementRef;
  modal_src;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  async ngOnInit() {
    this.formSet();
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
      const res = await this.userService.postRequest('_api/recording/get',data).toPromise()
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
        filter:[-1],//-1-all,1-read, 0-unread
        type:[-1],//-1-all,0-instant, 2-schedule
        title:[''],
      });
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
  uploadFormSet1() {
    this.uploadForm = this._formBuilder.group({
      title: ['',Validators.required],
      file_path:['',Validators.required],
      recordingFile:[''],
      file:[],
    });
    if(this.fileinput) this.fileinput.nativeElement.value="";
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
      data['recordingFile'] = '_public/jnj/'+nn;
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
      const res = await this.userService.postRequest('_api/cloudstorage/create',formData).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
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
  //get participant
  getParticipant(item){
    let text = '';
    const arr = [];
    for(let i =0; i < item.length; i ++){
      arr.push(item[i]['$']['name'])
    }
    return arr.join(',')
  }
  //read
  async read(item,status){
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/recording/read',{data:item,status:status}).toPromise();
      this.search();
     }catch(err){
      this.userService.handleError(err);
     }
     this.loading = false;
  }
  //playback cloud
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
    if(this.uploadForm.invalid){
      this.userService.errorMessage('Please input all fields correctly.');
      return;
    }
    this.loading = true;
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
    const filtered = pData.filter(x=>!key||String(x.title).indexOf(key)!=-1);
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


