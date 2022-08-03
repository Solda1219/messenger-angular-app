import { Component, OnInit } from '@angular/core';
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
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  curRoute:string='';
  sidebarMinimized = false;
  nav = navItems;
  user;
  currentLanguage = "english";
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: Router,
    public cf:CommonFunctionService,
    private socket: SocketioService,
  ){
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
  ngOnInit(){
    this.curRoute=this.route.routerState.snapshot.url;
    this.user = this.userService.getToken()['userInfo'];
    this.setNavItemByRole();
  }
  connectSocket(){
    const userInfo = this.userService.getUserInfo();
    this.socket.emit('set-user-data',userInfo)
  }
  ngOnDestroy(){
    localStorage.removeItem('language');
  }
  //set nav item
  setNavItemByRole(){
    const user_role = this.user.role;
    for(let i=0; i < this.nav.length; i++){
      const {role,children} = this.nav[i];
      if(role==-1) continue
      else{
        if(role<user_role) {
          this.nav.splice(i,1);
          continue;
        }
        if(children) {
          for(let c=0; c < this.nav[i].children.length; c++){
            const role_c = this.nav[i].children[c].role;
            if(role_c<user_role) {
              this.nav[i].children.splice(c,1);
              continue;
            }
          }
        }
      }
    }
  }
  //LanguageChagePart
  changeLang(language: string) {
    this.currentLanguage=language;
    localStorage.setItem('language',language)
  }

  //userdropdown part
  logOut(){
    this.userService.logOut()
  }
}
