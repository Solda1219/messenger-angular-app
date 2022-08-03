import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
//import for table widget and modals
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import * as FileSaver from 'file-saver';  
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-incoming-meeting',
  templateUrl: './incoming-meeting.component.html',
  styleUrls: ['./incoming-meeting.component.scss']
})
export class IncomingMeetingComponent implements OnInit {
  loading;
  interval;
  keyvalue;
  key;
  meeting = [];
  itemList = [];
  invited = [];
  is_lock = false;
  formGroup: FormGroup;
  hours = [0,1,2,3,4,5,6,7,8,9,10];
  mins = [5,10,15,20,25,30,35,40,45,50,55,60];
  uploadForm: FormGroup;
  shareForm: FormGroup;
  addressBook=[];
  selected_text = '';
  selectedUsers = [];
  reason="";
  shareURL="";
  shareInfo={
    name:''
  };
  dropdownSettingsOfUser:IDropdownSettings = {
    singleSelection: false,
    idField: 'memberId',
    textField: 'nativeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  @ViewChild('fileinput') public fileinput:ElementRef;
  modal_src;
  @ViewChild('shareDiv') public shareDiv:ElementRef;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  @ViewChild('warningModalA') warningModal: ElementRef;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { 
  }
  async ngOnInit() {
    this.formSet();
    this.getContact();
    this.paramset();
    this.startInterval();
  }
  paramset(){
    const key = this.route.snapshot.params.id;
    this.key = key;
    this.keyvalue = key;
  }
  async getContact(){
    try{
     const res = await this.userService.postRequest('_api/user/getContact').toPromise();
     this.addressBook = res['result'];
    }catch(err){

    }
  }
  turnSound(){
    this.audioPlayerRef.nativeElement.play();
  }
  ngOnDestroy() {
    if(this.interval) clearInterval(this.interval);
  }
  async search() {
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/instantmeeting/getInstantMeeting').toPromise();
      this.meeting = res['result'];
      const pData = JSON.parse(JSON.stringify(this.meeting));
      this.itemList = pData.filter(x=>!this.key||this.key==x.meetingId||String(x.title).indexOf(this.key)!=-1||String(x.email).indexOf(this.key)!=-1||String(x.meetingId).indexOf(this.key)!=-1)
      const invitedData = this.meeting.filter(x=>x.is_host===false);
      if(invitedData.length>this.invited.length){
        this.itemList = pData;
        // this.turnSound();
      }
      this.invited = invitedData;
     }catch(err){
      console.log(err);
     }
     this.loading = false;
  }
  startInterval(){
    clearInterval(this.interval);
    this.search();
    this.interval = setInterval(()=>{
      this.search();
    },5*1000)
  }
  async getShare(item){
    if(!this.shareInfo.name){
      this.userService.errorMessage('Please input username you will share');
      return
    }
    try{
     const res = await this.userService.postRequest('_api/meeting/getShare',{data:item,user:this.shareInfo}).toPromise();
     this.shareURL = res['result'];
    }catch(err){
     this.userService.handleError(err);
    }
  }
  formSet(item=null) {
    if(item){
      this.modal_src = item;
      this.formGroup = this._formBuilder.group({
        meetingId:[item.meetingId],
        title:[item.title,Validators.required],
        hour:[Math.floor(item.duration/60)],
        min:[item.duration%60],
        auto_recording:[item.auto_recording==1?true:false],
        auto_extension:[item.auto_extension==1?true:false],
        meetingType:[item.meetingType],
        default_joint_browsing_page: [item.default_joint_browsing_page],
        agenda:[item.agenda],
      });
    }else{
      this.selectedUsers=[];
      this.formGroup = this._formBuilder.group({
        meetingId:[],
        title:['',Validators.required],
        hour:[0],
        min:[0],
        auto_recording:[true],
        auto_extension:[true],
        meetingType:[0],
        default_joint_browsing_page: [''],
        agenda:[''],
      });
    }
  }
  async edit(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    const duration = Number(data.hour)*60+Number(data.min);
    data.start_time = this.cf.getDateStringYYYYMMDDHHMMSS(new Date());
    data.end_time = this.cf.getDateStringYYYYMMDDHHMMSS(new Date().getTime()+duration*1000*60);
    data.users = this.getUsersBySelect();
    data.duration = duration;
    data.auto_extension = data.auto_extension?1:0;
    data.auto_recording = data.auto_recording?1:0;
    delete data.hour;
    delete data.min;
    let url = "_api/instantmeeting/createInstantMeetig";
    if(this.modal_src.status==1){
      url = "_api/instantmeeting/editInstantParticipant";
    }
    try{
     const res = await this.userService.postRequest(url,data).toPromise();
     this.userService.handleSuccess(res['message']);
     this.startInterval();
    }catch(err){
     this.userService.handleError(err);
    }
  }
  async start(item){
    this.modal_src = item;
    if(new Date().getTime()<new Date(item.start_time).getTime()){
      this.warningModal.nativeElement.click();
      return;
    }
    this.gotoBlank(item);
  }
  async gotoBlank(item){
    window.open(item.meetingURL, "_blank");
    try{
      const res = await this.userService.postRequest('_api/instantmeeting/startInstantMeeting',item).toPromise();
      // this.userService.handleSuccess(res['message']);
      this.startInterval();
     }catch(err){
      this.userService.handleError(err);
     }
  }
  async cancel(){
    try{
      const res = await this.userService.postRequest('_api/instantmeeting/cancelInstantMeeting',{meetingId:this.modal_src.meetingId,reason:this.reason}).toPromise();
      // this.userService.handleSuccess(res['message']);
      this.startInterval();
     }catch(err){
      this.userService.handleError(err);
     }
  }
  async del(){
    try{
     const res = await this.userService.postRequest('_api/instantmeeting/cancelParticipant',{data:[this.modal_src]}).toPromise();
     this.userService.handleSuccess(res['message']);
     this.startInterval();
    }catch(err){
     this.userService.handleError(err);
    }
  }
  copyALL(item){
    let data = '';
    data = data + this.cf.translate("Subject") + ':' + item.email + "'"+'s Meeting'+'\n';
    data = data + this.cf.translate("Start Time") + ':' + this.displayTime(item.start_time) +'\n';
    data = data + this.cf.translate("Organizer") + ':' + item.email +'\n';
    data = data + this.cf.translate("Meeting ID") + ':' + item.meetingId +'\n';
    data = data + this.cf.translate("URL") + ':' + item.meetingURL +'\n';
    this.copyToClipboard(data);
  }
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
  downloadPicture(){
    htmlToImage.toBlob(this.shareDiv.nativeElement)
    // htmlToImage.toBlob(document.getElementById('shareDiv'))
    .then(function (blob) {
      FileSaver.saveAs(blob, ''+new Date().getTime()+'.png');  
    }).catch(err=>{
      console.log(err)
    });
  }
  displayTime(time){
    const result = new Date(time).toString();
    return result;
  }
  displayTimeOnly(time){
    const result = new Date(time).toLocaleTimeString();
    return result;
  }
  displaydate(time){
    if(this.cf.getDateStringYYYYMMDD(new Date())==this.cf.getDateStringYYYYMMDD(new Date(time))) return "Today";
    else return this.cf.getDateStringYYYYMMDD(new Date(time))
  }
  getUsersBySelect(){
    const item = [];
    for(let i = 0; i < this.addressBook.length; i++){
      for(let k = 0; k < this.selectedUsers.length; k++){
        if(this.addressBook[i].memberId==this.selectedUsers[k].memberId) item.push(this.addressBook[i])
      }
    }
    return item;
  }
  //for multi selecet
  onItemSelect(event){
    const selected_list = [];
    this.selectedUsers.forEach(x=>{
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  onItemDeselect(event){
    const selected_list = [];
    this.selectedUsers.forEach(x=>{
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  onSelectAll(event:any){
    const selected_list = [];
    event.forEach(x=>{
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  //common
  closeModal(id){
    $(`#${id}`).modal('hide');
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/avtars.png';
   //Do other stuff with the event.target
   }
}