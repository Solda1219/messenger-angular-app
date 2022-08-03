import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { SocketioService } from '../../service/socketio.service';
import { ListItem } from '../../module/ng-multiselect-dropdown/src/multiselect.model';
@Component({ 
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss']
})
export class AlertViewComponent implements OnInit {
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  interval;
  //office call
  officeUser;
  officeShow = false;
  officeURL;
  //event alarm
  eventalarms = [];
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public cf: CommonFunctionService,
    private socket: SocketioService,
  ) { }

  ngOnInit(): void {
    this.connectSocket();
    this.startInterval();
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
  }
  startInterval(){
    this.interval = setInterval(()=>{
      this.getAlarmOfEvent();
    },10000);
  }
  connectSocket(){
    this.socket.listen('reqOffice').subscribe(
      res=>{
        this.officeUser = res;
        this.officeShow = true;
        this.turnSound();
      },
      err=>{
        this.officeShow = false;
        console.log(err)
      }
    );
    this.socket.listen('cancelOffice').subscribe(
      res=>{
        this.officeShow = false;
        this.turnSound();
      },
      err=>{
        this.officeShow = false;
      }
    );
    this.socket.listen('resultAccept').subscribe(
      res=>{
        if(res['status']!==0){
          this.userService.errorMessage(res['message']);
        }
        else{
          this.officeURL = res['url'];
          this.userService.handleSuccess('Accepted. loading....');
          window.open(res['url'], "_blank");
        }
        this.officeShow = false;
      },
      err=>{
        console.log(err)
        this.officeShow = false;
      }
    );
  }
  turnSound(){
    this.audioPlayerRef.nativeElement.play();
  }
  //get office call
  acceptoffice(){
    this.officeShow = false;
    this.socket.emit('acceptOffice',this.officeUser);
  }
  canceloffice(){
    this.officeShow = false;
    this.socket.emit('cancelOfficeByHost',this.officeUser);
  }
  //get event alarm
  async getAlarmOfEvent(){
    try{
       const res = await this.userService.postRequest('_api/event/alarm').toPromise();
       await this.userService.postRequest('_api/event/alarmRead',res['result']).toPromise();
       if(res['result'].length>0) this.turnSound();
       for(let i = 0 ; i < res['result'].length; i++){
        this.eventalarms.push(res['result'][i]);
        setTimeout(()=>{
          const key = this.getIndex(this.eventalarms,res['result'][i]['id']);
          if(key!==false) this.eventalarms.splice(key,1)
        },res['result'][i]['alarm_duration']>2?res['result'][i]['alarm_duration']*1000:2000);
       }
    }catch(err){

    }
  }
  getIndex(arr,key){
    for(let i = 0; i < arr.length; i++){
      if(arr[i].id == key) return i;
    }
    return false;
  }
  cancelEventAlarm(i){
    this.eventalarms.splice(i,1);
  }
}
