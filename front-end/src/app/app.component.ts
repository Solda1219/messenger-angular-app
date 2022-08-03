import { Component, OnInit, AfterViewInit} from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { SocketioService } from './service/socketio.service';
import { UserService } from './service/user.service';
declare var $:any;
@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [IconSetService],
})
export class AppComponent implements OnInit, AfterViewInit{
  loading = false;
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private socket: SocketioService,
    private userService: UserService,
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $('#loadingDiv').hide();
  }
}
