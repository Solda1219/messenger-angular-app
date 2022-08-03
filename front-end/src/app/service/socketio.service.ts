import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket:any;
  readonly url:string = "/socket";
  constructor() { 
    this.socket = io(this.url);
  }
  webSocketConnect(){
    return this.socket;
  }
  listen(event:any){
    return new Observable((subscriber)=>{
      this.socket.on(event,(data)=>{
        subscriber.next(data);
      })
    })
  }
  emit(event:any,data:any){
    this.socket.emit(event,data);
  }
}
