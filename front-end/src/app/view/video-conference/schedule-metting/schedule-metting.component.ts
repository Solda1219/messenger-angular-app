import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-schedule-metting',
  templateUrl: './schedule-metting.component.html',
  styleUrls: ['./schedule-metting.component.scss']
})
export class ScheduleMettingComponent implements OnInit {
  loading;
  item = [];
  hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  min = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  duration = [5, 10, 15, 30, 45, 60, 90, 120, 150, 180, 210, 300, 600, 900];
  reserve_connection = [];
  recording = [];
  moveTo = -1;
  addressBook = [];
  selected_text = '';
  selectedUsers = [];
  //for repeat
  days = {
    sun:false,
    mon:true,
    tue:false,
    wed:false,
    thu:false,
    fri:false,
    sat:false,
  };
  dropdownSettingsOfUser: IDropdownSettings = {
    singleSelection: false,
    idField: 'memberId',
    textField: 'nativeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  formGroup: FormGroup;
  recordingInfo;
  @ViewChild('fileinput') public fileinput: ElementRef;
  @ViewChild('closeRecording') public closeRecording: ElementRef;
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
  }
  paramset(){
    const key = this.route.snapshot.params.key;
    if(key){
      const data = JSON.parse(localStorage.getItem(key));
      this.formSet(data);
    }
  }
  ngAfterViewInit(): void {
      this.setDateDiv();
  }
  setDateDiv(){
    setTimeout(() => {
      $(".datepicker").flatpickr({
        enableTime: false,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
      });
    }, 300)
  }
  async getContact() {
    try {
      const res = await this.userService.postRequest('_api/user/getContact').toPromise();
      this.addressBook = res['result'];
    } catch (err) {

    }
  }
  formSet(item=null) {
    if(!item){
      this.formGroup = this._formBuilder.group({
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
    }else{
      if(item.repeat==1) this.setDays(item.recur);
      let users = [];
      for(let i = 0 ; i < item.users.length; i++){
        this.selectedUsers.push({
          memberId:item.users[i].memberId,
          nativeName:item.users[i].nativeName
        });
        users.push(item.users[i].nativeName);
      }
      this.selected_text = users.join(',')
      this.formGroup = this._formBuilder.group({
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
  setFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
      }
    }
  }
  openFileInput() {
    this.fileinput.nativeElement.click();
  }
  async create() {
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    if(this.formGroup.value.resume==1&&!this.recordingInfo){
      this.userService.errorMessage('Please select recording to resume.');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    //set start time and duration
    const duration = Number(data.hour)*60+Number(data.min);
    data.start_time = this.cf.getDateStringYYYYMMDDHHMMSS(new Date(data.startTime+' 00:00:00').getTime()+duration*60*1000);
    data.end_time = this.cf.getDateStringYYYYMMDDHHMMSS(new Date(data.start_time).getTime()+data.duration*1000*60);
    data.users = this.getUsersBySelect();
    if(new Date(data.start_time).getTime()<new Date().getTime()){
      this.userService.errorMessage('Start time must be later than current time.');
      return
    }
    //set resume meeting
    if(this.formGroup.value.resume==1){
      data.previousOwner=this.recordingInfo.coordinatorId;
      data.previousMeetingId=this.recordingInfo.meetingId;
      data.previousFile = String(this.recordingInfo.fileName).replace('.jnr','');
    }
    if(data.repeat==1){
       //process repeat
      if(data.day_dur<1) this.formGroup.patchValue({day_dur:1});
      if(data.week_dur<1) this.formGroup.patchValue({week_dur:1});
      if(data.m_date<1) this.formGroup.patchValue({m_date:1});
      if(data.m_month<1) this.formGroup.patchValue({m_month:1});
      if(data.m_week_month<1) this.formGroup.patchValue({m_week_month:1});

      delete data.hour;
      delete data.min;
      const {recure_mode,day_mode,day_dur,week_dur,month_method,m_date,m_month,m_week,m_day,m_week_month,start_recur,end_method,end_recur,end_round} = data;
      // console.log([recure_mode,day_mode,day_dur,week_dur,month_method,m_date,m_month,m_week,m_day,m_week_month,start_recur,end_method,end_recur,end_round]);
      //process
      data.start_recur = data.start_recur+' 00:00:00';
      data.end_recur = data.end_recur+' 23:59:59';
      //set dates selected
      const day_key = ["sun","mon","tue","wed","thu","fri","sat"];
      const sel_day = [];
      for(let i = 0; i < day_key.length; i ++) if(this.days[day_key[i]]==true) sel_day.push(i);
      data.week_dates = sel_day.join(',');
      const start_day = this.calculateRepeat(data).start;
      if(recure_mode==1&&Object.values(this.days).indexOf(true)==-1){
        this.userService.errorMessage('Please select days for week recure.');
        return
      }
      if(new Date(start_recur).getTime()>new Date(end_recur).getTime()&&end_method==0){
        this.userService.errorMessage('Start by can\'t be bigger than end by.');
        return
      }
      if(new Date(start_recur).getTime()<new Date(new Date().setHours(0,0,0,0)).getTime()){
        this.userService.errorMessage('Start by must be later than current time.');
        return
      }

    }
    try{
     const res = await this.userService.postRequest('_api/instantmeeting/createInstantMeetig',data).toPromise();
     this.userService.handleSuccess(res['message']);
     this.userService.gotoURL('/video-conference/incoming');
    }catch(err){
     this.userService.handleError(err);
    }
  }
  calculateRepeat(data){
    let today = new Date(new Date().setHours(0,0,0,0));
    const {recure_mode,day_mode,day_dur,week_dur,month_method,m_date,m_month,m_week,m_day,m_week_month,start_recur,end_method,end_recur,end_round,week_dates} = data;
    // console.log([recure_mode,day_mode,day_dur,week_dur,month_method,m_date,m_month,m_week,m_day,m_week_month,start_recur,end_method,end_recur,end_round,week_dates])
    if(recure_mode==0){
      const start_day = this.cf.getDateStringYYYYMMDD(today);
      return {start:start_day};
    }
    else if(recure_mode==1){
      const daysSel = String(week_dates).split(',');
      for(let i = 0; i < daysSel.length; i ++){
        const startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) + Number(daysSel[i])-1;
        const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
        if(new Date(start_day).getTime()>=today.getTime()){
          return {start:start_day};
        }
      }
      const startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) + Number(daysSel[0])-1+7;
      const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
      return {start:start_day};
    }
    else if(recure_mode==2){
      if(month_method==0){
        const start_day = new Date(today.getFullYear(), today.getMonth(), m_date);
        if(new Date(start_day).getTime()>=today.getTime()){
          return {start:this.cf.getDateStringYYYYMMDD(start_day)};
        }else{
          return {start:this.cf.getDateStringYYYYMMDD(new Date(start_day).setMonth(today.getMonth()+1))};
        }
      }
      else if(month_method==1){
        const startWeek = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastWeek = new Date(today.getFullYear(), today.getMonth()+1, 0);
        const startofweek = m_week!=4?startWeek.getDate() - startWeek.getDay() + (startWeek.getDay() === 0 ? -6 : 1) + (0 + m_day -1) + m_week * 7:lastWeek.getDate() - lastWeek.getDay() + (lastWeek.getDay() === 0 ? -6 : 1) + (0+m_day -1);
        const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
        if(new Date(start_day).getTime()>=today.getTime()){
          return {start:this.cf.getDateStringYYYYMMDD(start_day)};
        }else{
          const startWeeknext = new Date(today.getFullYear(), today.getMonth()+1, 1);
          const lastWeeknext = new Date(today.getFullYear(), today.getMonth()+2, 0);
          const startofweeknext = m_week!=4?startWeeknext.getDate() - startWeeknext.getDay() + (startWeeknext.getDay() === 0 ? -6 : 1) + (0 + m_day -1) + m_week * 7:lastWeeknext.getDate() - lastWeeknext.getDay() + (lastWeeknext.getDay() === 0 ? -6 : 1) + (0+m_day -1);
          const start_daynext = this.cf.getDateStringYYYYMMDD(new Date(new Date().setMonth(new Date().getMonth()+1)).setDate(startofweeknext));
          return {start:this.cf.getDateStringYYYYMMDD(start_daynext)};
        }
      }
    }
  }
  continueMeeting(item){
    this.closeRecording.nativeElement.click();
    this.recordingInfo = item;
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
  getFormat(text){
    if (text < 10) return '0' + text
    else return text;
  }
  //for multi selecet
  onItemSelect(event) {
    const selected_list = [];
    this.selectedUsers.forEach(x => {
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  onItemDeselect(event) {
    const selected_list = [];
    this.selectedUsers.forEach(x => {
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  onSelectAll(event: any) {
    const selected_list = [];
    event.forEach(x => {
      selected_list.push(x.nativeName);
    });
    this.selected_text = selected_list.join(',');
  }
  onImgError(event) {
    event.target.src = 'assets/theme/img/avtars.png';
    //Do other stuff with the event.target
  }
}


