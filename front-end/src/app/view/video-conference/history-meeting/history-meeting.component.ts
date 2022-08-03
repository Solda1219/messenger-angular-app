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
import { ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-history-meeting',
  templateUrl: './history-meeting.component.html',
  styleUrls: ['./history-meeting.component.scss']
})
export class HistoryMeetingComponent implements OnInit {
  loading;
  interval;
  keyvalue;
  key;
  meeting = [];
  itemList = [];
  invited = [];
  is_lock = false;
  formGroup: FormGroup;
  SformGroup: FormGroup;
  hours = [0,1,2,3,4,5,6,7,8,9,10];
  mins = [5,10,15,20,25,30,35,40,45,50,55,60];
  uploadForm: FormGroup;
  shareForm: FormGroup;
  addressBook=[];
  selected_text = '';
  selectedUsers = [];
  reason="";
  days = {
    sun:false,
    mon:true,
    tue:false,
    wed:false,
    thu:false,
    fri:false,
    sat:false,
  };
  param={
   from:this.cf.getDateStringYYYYMMDD(new Date()),
   to:this.cf.getDateStringYYYYMMDD(new Date()),
   type:0,
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
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { 
  }
  async ngOnInit() { 
    this.formSet();
    this.SformSet();
    this.getContact();
    this.paramset();
    // this.search();
    this.startInterval();
  }
  paramset(){
    const key = this.route.snapshot.params.id;
    const from =  Number(this.route.snapshot.params.from);
    if(this.cf.isDate(new Date(from))){
      this.param.from = this.cf.getDateStringYYYYMMDD(new Date(from))
      this.param.to = this.cf.getDateStringYYYYMMDD(new Date(from))
    }
    this.key = key;
    this.keyvalue = key;
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
    const data = JSON.parse(JSON.stringify(this.param));
    data.from = data.from+' 00:00:00';
    data.to = data.to+' 23:59:59'; 
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/meeting/getHistoryMeeting',data).toPromise();
      this.meeting = res['result'];
      const pData = JSON.parse(JSON.stringify(this.meeting));
      this.itemList = pData.filter(x=>!this.key||this.key==x.meetingId||String(x.title).indexOf(this.key)!=-1||String(x.email).indexOf(this.key)!=-1||String(x.meetingId).indexOf(this.key)!=-1)
    }catch(err){
      console.log(err);
     }
     this.loading = false;
  }
  startInterval(){
    clearInterval(this.interval);
    this.search();
    this.interval = setInterval(()=>{
      // this.search();
    },5*1000)
  }
  formSet(item=null) {
    if(item){
      this.modal_src = item;
      let users = [];
      for(let i = 0 ; i < item.users.length; i++) users.push(item.users[i].nativeName)
      this.selected_text = users.join(',')
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
  SformSet(item=null) {
    if(item){
      this.modal_src = item;
      if(item.repeat==1) this.setDays(item.recur);
      let users = [];
      for(let i = 0 ; i < item.users.length; i++) users.push(item.users[i].nativeName)
      this.selected_text = users.join(',')
      this.SformGroup = this._formBuilder.group({
        title: [item.title, Validators.required],
        password: [''],
        resume: [item.resume],
        startTime: [this.cf.getDateStringYYYYMMDD(new Date(item.start_time))],
        hour: [new Date(item.start_time).getHours(), Validators.required],
        min: [new Date(item.start_time).getMinutes(), Validators.required],
        duration: [item.duration],
        auto_recording: [item.auto_recording],//0,1
        auto_extension: [item.auto_extension],//0,1
        all_questioner: [item.all_questioner],//0,1 //form mode
        default_joint_browsing_page: [item.jointBrowsingURL],
        agenda:[item.agenda],
        meetingType:[item.meetingType],
        //for repeat
        repeat:[item.repeat],
        recure_mode:[item.repeat==0?0:item.recur.recure_mode],//0-day, //1-week, // 2- month
        day_mode:item.repeat==0?0:item.recur.day_mode,//0-every day, 1- select day
        day_dur:item.repeat==0?0:item.recur.day_dur,
        week_dur:item.repeat==0?0:item.recur.week_dur,
        month_method:item.repeat==0?0:item.recur.month_method,//0-special  day of month, 1-method two
        m_date:item.repeat==0?0:item.recur.m_date,
        m_month:item.repeat==0?0:item.recur.m_month,
        m_week:item.repeat==0?0:item.recur.m_week,//first - last 0 - 4
        m_day:item.repeat==0?0:item.recur.m_day,//sun-saturday
        m_week_month:item.repeat==0?0:item.recur.m_week_month,
        start_recur:[item.repeat==0?0:this.cf.getDateStringYYYYMMDD(new Date(item.recur.start_recur))],
        end_method:item.repeat==0?0:item.recur.end_method,//0-special time, 1-after rounds of meeting, 2-unlimited
        end_recur:[item.repeat==0?0:this.cf.getDateStringYYYYMMDD(new Date(item.recur.end_recur))],
        end_round:item.repeat==0?0:item.recur.end_round,
      });
    }else{
      this.selectedUsers=[];
      this.SformGroup = this._formBuilder.group({
        title: ['', Validators.required],
        password: [''],
        resume: [0],
        startTime: [this.cf.getDateStringYYYYMMDD(new Date())],
        hour: [0, Validators.required],
        min: [0, Validators.required],
        duration: [15],
        auto_recording: [1],//0,1
        auto_extension: [1],//0,1
        all_questioner: [0],//0,1 //form mode
        default_joint_browsing_page: [''],
        agenda:[''],
        meetingType:[1],
        //for repeat
        repeat:[0],
        recure_mode:0,//0-day, //1-week, // 2- month
        day_mode:0,//0-every day, 1- select day
        day_dur:[2],
        week_dur:2,
        month_method:0,//0-special  day of month, 1-method two
        m_date:1,
        m_month:1,
        m_week:0,//first - last 0 - 4
        m_day:0,//sun-saturday
        m_week_month:1,
        start_recur:[this.cf.getDateStringYYYYMMDD(new Date())],
        end_method:0,//0-special time, 1-after rounds of meeting, 2-unlimited
        end_recur:[this.cf.getDateStringYYYYMMDD(new Date())],
        end_round:10,
      });
    }
  }
  setDays(item){
    if(!item.week_dates) return;
    this.days = {
      sun:false,
      mon:false,
      tue:false,
      wed:false,
      thu:false,
      fri:false,
      sat:false,
    };
    const keys = Object.keys(this.days);
    const datess = String(item.week_dates).split(',');
    for(let i = 0; i < keys.length; i++){
      if(datess.indexOf(String(i))!=-1) this.days[keys[i]] = true;
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
     const res = await this.userService.postRequest('_api/meeting/del',this.modal_src).toPromise();
     this.userService.handleSuccess(res['message']);
     this.startInterval();
    }catch(err){
     this.userService.handleError(err);
    }
  }
  async playback(item){
    try{
     const res = await this.userService.postRequest('_api/meeting/getplayback',item).toPromise();
     window.open(res['result'], "_blank");
    }catch(err){
     this.userService.handleError(err);
    }
  }
  async resume(item){
    try{
     const res = await this.userService.postRequest('_api/meeting/restart',item).toPromise();
     this.userService.gotoURL('video-conference/incoming')
    }catch(err){
     this.userService.handleError(err);
    }
  }
  async createAgain(item){
     const nowDate = String(new Date().getTime());
     localStorage.setItem(nowDate,JSON.stringify(item));
     if(item.meetingType==0) this.userService.gotoURL('video-conference/instantMeetingWithData/'+nowDate);
     if(item.meetingType==1) this.userService.gotoURL('video-conference/sheduleMeetingWithData/'+nowDate);
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
