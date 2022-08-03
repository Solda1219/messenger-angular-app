import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { navItems } from './_nav';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { SocketioService } from '../../service/socketio.service';
@Component({
  selector: 'app-horizon-layout',
  templateUrl: './horizon-layout.component.html',
  styleUrls: ['./horizon-layout.component.css']
})
export class HorizonLayoutComponent implements OnInit {
  info = {
    upcoming:0,
    invited:[],
    history:0,
  };
  _opened = false;
  curRoute: string = '';
  sidebarMinimized = false;
  nav = navItems;
  user;
  currentLanguage = "english";
  timer;
  tmOb = {
    year: 0,
    month: 0,
    day: 0,
    h: 0,
    m: 0,
  };
  interval;
  localStorageIDIndex='';
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: Router,
    public cf: CommonFunctionService,
    private socket: SocketioService,
  ) {
    this.route.events.subscribe((event: Event) => {
      this.curRoute = event['url']
      switch (true) {
        case event instanceof NavigationStart: {
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  ngOnInit() {
    this.connectSocket();
    this.curRoute = this.route.routerState.snapshot.url;
    this.user = this.userService.getToken()['userInfo'];
    this.localStorageIDIndex = 'www_aiflybird_com_111222333444_'+this.user.memberId;
    this.setNavItemByRole();
    this.startTimer();
    this.startInterval();
  }
  connectSocket(){
    const userInfo = this.userService.getUserInfo();
    this.socket.emit('set-user-data',userInfo)
  }
  ngOnDestroy() {
    localStorage.removeItem('language');
    if (this.timer) clearInterval(this.timer);
    if(this.interval) clearInterval(this.interval);
  }
  userInfo(){
    return this.userService.getUserInfo();
  }
  clickedMenuIcon(item){
    if(item.children){
      item.collapse = true;
      this._opened = true;
    } else {
      if (item.name == "Mail") {
        window.open("mailto:webdesign@example.com")
      }
      else {
        this.gotoURL(item.url)
      }
    } 
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/profile.png';
   //Do other stuff with the event.target
  }
  //timer
  startTimer() {
    const format = (val)=>{
      if(val<10) return '0'+val;
      else return val
    }
    const today = new Date();
    this.tmOb = {
      year: today.getFullYear(),
      month: format(today.getMonth() + 1),
      day: format(today.getDate()),
      h: format(today.getHours()),
      m: format(today.getMinutes()),
    }
    setInterval(() => {
      const today = new Date();
      this.tmOb = {
        year: today.getFullYear(),
        month: format(today.getMonth() + 1),
        day: format(today.getDate()),
        h: format(today.getHours()),
        m: format(today.getMinutes()),
      }
    }, 1000);
  }
  //set nav item
  setNavItemByRole() {
    const user_role = this.user.role;
    for (let i = 0; i < this.nav.length; i++) {
      const { role, children } = this.nav[i];
      if (role == -1) continue
      else {
        if (role < user_role) {
          this.nav.splice(i, 1);
          continue;
        }
        if (children) {
          for (let c = 0; c < this.nav[i].children.length; c++) {
            const role_c = this.nav[i].children[c].role;
            if (role_c < user_role) {
              this.nav[i].children.splice(c, 1);
              continue;
            }
          }
        }
      }
    }
  }
  //LanguageChagePart
  changeLang(language: string) {
    this.currentLanguage = language;
    localStorage.setItem('language', language)
  }
  //userdropdown part
  logOut() {
    this.userService.logOut()
  }
  switchuser() {
    this.userService.logOut()
  }
  gotoURL(url){
    this.userService.gotoURL(url);
    this._opened = false;
  }
  //get info
  startInterval(){
    clearInterval(this.interval);
    this.getInfo();
    this.interval = setInterval(()=>{
      this.getInfo();
    },5*1000)
  }
  async getInfo() {
    try{
      const res = await this.userService.postRequest('_api/info/get').toPromise();
      const data = res['result'];
      const prevdata = localStorage.getItem(this.localStorageIDIndex);
      const pre = prevdata?JSON.parse(prevdata):false;
      this.analyseChange(pre,data);
      localStorage.setItem(this.localStorageIDIndex,JSON.stringify(data));
      this.info = data;
     }catch(err){
      console.log(err);
     }
  }
  analyseChange(preval:any,newval:any){
      //upcoming meeting analyse
      const upcoming_new = newval.invited;
      const upcoming_pre = preval?preval.invited:false;
      let alerted = false;
      for(let i = 0 ; i < upcoming_new.length; i++){
        if(upcoming_new[i].ended==1) continue;
        if(upcoming_pre==false||this.is_new(upcoming_pre,'meetingId',upcoming_new[i]['meetingId'])){
          if(alerted==false){
            this.turnSound();
            alerted=true;
          }
          this.userService.handleSuccess(`You are invited ${upcoming_new[i]['email']}'s ${upcoming_new[i]['meetingId']} meeting`)
        }
      }
  }
  turnSound(){
    this.audioPlayerRef.nativeElement.play();
  }
  is_new(arr,index,key){
    try{
      for(let i = 0 ;  i < arr.length; i++){
        if(arr[i][index]==key) return false;
      }
      return true;
    }catch(err){
      return true;
    }
  }
}
