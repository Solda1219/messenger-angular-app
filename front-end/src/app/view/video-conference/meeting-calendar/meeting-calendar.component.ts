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

//calendar
import { NgxTuiCalendarComponent } from 'ngx-tui-calendar';
import { ClickDaynameEvent, BeforeCreateScheduleEvent } from '../../../module/ngx-tui-calendar/src/lib/Models/Events';
import { Schedule } from '../../../module/ngx-tui-calendar/src/lib/Models/Schedule';
import { ThemeService } from 'ng2-charts';
import { template } from './template';
@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {   
  interval;
  formGroup:FormGroup;
  @ViewChild('openEvent') openEvent:ElementRef;
  @ViewChild('closeEvent') closeEvent:ElementRef;
  modal_src;
  //calendar
  template = template;
	title = 'app';
	@ViewChild('calendar') calendar: NgxTuiCalendarComponent;
  param = {
    date:this.cf.getDateStringYYYYMMDD(new Date()),
    mode:'1',
  };
  schedules: Schedule[] = [];
  item = [];
	calendarViews = [
		{ value: '0', name: 'month' },
		{ value: '1', name: 'week' },
		{ value: '2', name: 'day' }
	];
  headerDate = new Date();
	defaultView = 'week';
  color = {
    0:{//history
      color: '#white',
      bgColor: '#585858',
      borderColor: '#585858',
      dragBgColor: '#585858',
    },
    1:{//inprogress
      color: '#white',
      bgColor: '#ff4081',
      borderColor: '#ff4081',
      dragBgColor: '#ff4081',
    },
    2:{//not started yet
      color: 'white',
      bgColor: '#198754',
      borderColor: '#198754',
      dragBgColor: '#198754',
    },
    3:{//not event
      color: 'white',
      bgColor: '#673ab7',
      borderColor: '#198754',
      dragBgColor: '#198754',
    },
  };
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formSet();
    this.startInterval();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.interval) clearInterval(this.interval);
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      $(".datepicker").flatpickr({
        enableTime: false,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
    },300)
    setTimeout(()=>{
      $(".dateHHMMSS").flatpickr({
        enableTime: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d h-m",
    });
    },300)
  }
  startInterval(){
    clearInterval(this.interval);
    this.search();
    this.interval = setInterval(()=>{
      this.search();
    },10000);
  }
  async search(){
    try{
      const res = await this.userService.postRequest('_api/meeting/getAllMeeting').toPromise();
      this.item =  res['result'];
      this.setCalendar();
    }catch(err){

    }
  }
  formSet(item=null) {
    // if(this.calendar) this.calendar.clear();
    if(!item){
      this.formGroup = this._formBuilder.group({
        id:[],
        title:['',Validators.required],
        start_time:['',[Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
        end_time:['',[Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
        description:[''],
        location:[''],
        alarm:[0],
        alarm_time:[5],
        alarm_duration:[5],
      });
    }else{    
      this.formGroup = this._formBuilder.group({
        id:[item.id],
        title:[item.title,Validators.required],
        start_time:[item.start_time,[Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
        end_time:[item.end_time,[Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
        description:[item.description],
        location:[item.location],
        alarm:[item.alarm],
        alarm_time:[item.alarm_time],
        alarm_duration:[item.alarm_duration],
      });
    }
    // console.log(this.formGroup.value)
  }
  async create(tag=true){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    if(new Date(this.formGroup.value.start_time).getTime()>new Date(this.formGroup.value.end_time).getTime()){
      this.userService.errorMessage('End time must be later than start time.');
      return;
    }
    try{
     const data = JSON.parse(JSON.stringify(this.formGroup.value));
     const res = await this.userService.postRequest('_api/event/create',data).toPromise();
     if(tag) this.userService.handleSuccess(res['message']);
     this.closeEvent.nativeElement.click();
     if(tag)    this.startInterval();
    }catch(err){
      this.userService.handleError(err)
    }
  }
  async edit(tag=true){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    if(new Date(this.formGroup.value.start_time).getTime()>new Date(this.formGroup.value.end_time).getTime()){
      this.userService.errorMessage('End time must be later than start time.');
      return;
    }
    try{
     const data = JSON.parse(JSON.stringify(this.formGroup.value));
     const res = await this.userService.postRequest('_api/event/edit',data).toPromise();
     if(tag) this.userService.handleSuccess(res['message']);
     this.closeEvent.nativeElement.click();
     this.startInterval();
    }catch(err){
      this.userService.handleError(err)
    }
  }
  async del(){
    try{
     const res = await this.userService.postRequest('_api/event/del',this.formGroup.value).toPromise();
     this.userService.handleSuccess(res['message']);
     this.closeEvent.nativeElement.click();
     this.startInterval();
    }catch(err){
      this.userService.handleError(err)
    }
  }
  //calendar part
  setCalendar(){
    const dataP = this.item;
    this.schedules = [];
    for(let i = 0; i < dataP.length;i++){
      const data = dataP[i];
      if(data.started_at) data.startC = new Date(data.started_at)
      else data.startC = new Date(data.start_time)

      if(data.ended) data.endC = new Date(data.ended_at)
      else if(data.started_at) data.endC = new Date(new Date(data.started_at).getTime()+data.duration*60000)
      else data.endC = new Date(data.end_time);
      if(data.event_type=='event'){
        data.startC = new Date(data.start_time);
        data.endC = new Date(data.end_time);
      }
      if(data.event_type=='meeting'){
        data.cTitle = data.meetingType==0?'Instant:'+data.title:'Schedule:'+data.title;
      }else{
        data.cTitle = data.title;
      }
      this.schedules.push(
        {
          id: String(i),
          calendarId: String(i),
          title: data.cTitle + ' ('+this.cf.getDateStringHHMM(data.startC)+'-'+this.cf.getDateStringHHMM(data.endC)+')',
          category: 'time',
          dueDateClass: '',
          start: (new Date(data.startC)),
          end: (new Date(data.endC)),
        }
      );
      //set calendar color
      this.setCalendarColor(i,data);
    }
    this.calendar.clear();
    this.calendar.createSchedules(this.schedules);
    this.calendar.render();
  }
  setCalendarColor(id,meeting){
    if(new Date(meeting.endC).getTime() < new Date().getTime())  this.calendar.setCalendarColor(String(id),this.color[0],false);
    else if(new Date(meeting.endC).getTime() > new Date().getTime() && new Date(meeting.startC).getTime() < new Date().getTime())  this.calendar.setCalendarColor(String(id),this.color[1],false);
    else if(new Date(meeting.startC).getTime() > new Date().getTime())  this.calendar.setCalendarColor(String(id),this.color[2],false);

    // if(meeting.event_type=='meeting'&& meeting.status==0)  this.calendar.setCalendarColor(String(id),this.color[2],false);
    // if(meeting.event_type=='meeting'&& meeting.status==1)  this.calendar.setCalendarColor(String(id),this.color[1],false);
    // if(meeting.event_type=='meeting'&& meeting.status==2)  this.calendar.setCalendarColor(String(id),this.color[0],false);
    // if(meeting.event_type=='event')  this.calendar.setCalendarColor(String(id),this.color[3],false);
  }
  getDateHeader(){
    const months = {
      1:'Jan',2:'Feb',3:'March',4:'Apr',5:'May',6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"
    };
    return months[new Date(this.headerDate).getMonth()+1]+' '+new Date(this.headerDate).getFullYear()
  }
	onTuiCalendarCreated($event) {
	}

  onBeforeCreateSchedule(event: BeforeCreateScheduleEvent) {
    this.formSet();
    this.openEvent.nativeElement.click();
    this.formGroup.patchValue({
      start_time:this.cf.getDateStringYYYYMMDDHHMMSS(event.start),
      end_time:this.cf.getDateStringYYYYMMDDHHMMSS(event.end),
      // alarm_time:this.cf.getDateStringYYYYMMDDHHMMSS(event.start),
    })
  }

  onDate(date) {
    // console.log('onDate', date);
  }

  onTime(dateTime) {
    // console.log('dateTime', dateTime);
  }

	onSchedule(schedule) {
		const ced = schedule.schedule;
    const cMeeting = this.item[ced.id];
    if(cMeeting.event_type=='meeting'){
      if(cMeeting.ended==1) this.userService.gotoURL(`video-conference/history/${new Date(cMeeting.ended_at).getTime()}/${cMeeting.meetingId}`);
      if(cMeeting.ended==0) this.userService.gotoURL(`video-conference/incoming/${cMeeting.meetingId}`);
    }
    else if(cMeeting.event_type=="event"){
      this.formSet(cMeeting);
      this.openEvent.nativeElement.click();
    }
  }

	onDateChange($event) {
		this.calendar.setDate(new Date($event.target.value));
    this.headerDate = new Date($event.target.value);
	}
  beforeUpdateSchedule(schedule) {
    const ced = schedule.schedule;
    const cMeeting = JSON.parse(JSON.stringify(this.item[ced.id]));
    if(cMeeting.event_type=="event"){
      cMeeting.start_time = this.cf.getDateStringYYYYMMDDHHMMSS(schedule.start);
      cMeeting.end_time = this.cf.getDateStringYYYYMMDDHHMMSS(schedule.end);
      this.calendar.updateSchedule(ced.id,ced.calendarId, {
        id:ced.id,
        calendarId:ced.calendarId,
        title: cMeeting.title,
        category: 'time',
        dueDateClass: '',
        start: (new Date(cMeeting.start_time)),
        end: (new Date(cMeeting.end_time))
      },false);
      this.calendar.render();
      this.formSet(cMeeting);
      this.edit(false);
    }
  }
	onCalendarToday() {
		this.calendar.today();
	}

	onCalendarNext() {
		this.calendar.next();
    if(this.param.mode=='0'){
       this.headerDate = new Date(new Date().setMonth(new Date(this.headerDate).getMonth()+1));
    }
    else if(this.param.mode=='2'){
      this.headerDate = new Date(new Date().setDate(new Date(this.headerDate).getDate()+1));
    }
    else if(this.param.mode=='1'){
      this.headerDate = new Date(new Date(this.headerDate.getFullYear(), this.headerDate.getMonth(), this.headerDate.getDate()+7));
    }
	}

	onCalendarPrev() {
		this.calendar.prev();
    if(this.param.mode=='0'){
      this.headerDate = new Date(new Date().setMonth(new Date(this.headerDate).getMonth()-1));
   }
   else if(this.param.mode=='2'){
     this.headerDate = new Date(new Date().setDate(new Date(this.headerDate).getDate()-1));
   }
   else if(this.param.mode=='1'){
     this.headerDate = new Date(new Date(this.headerDate.getFullYear(), this.headerDate.getMonth(), this.headerDate.getDate()-7));
   }
	}

	onChangeCalendarView($event) {
		this.calendar.changeView(this.calendarViews.find(view => view.value === $event.target.value).name);
	}

}
