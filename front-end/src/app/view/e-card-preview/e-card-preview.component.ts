import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { UserService } from '../../service/user.service';
//import for table widget and modals
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from '../../service/socketio.service';
@Component({
  selector: 'app-e-card-preview',
  templateUrl: './e-card-preview.component.html',
  styleUrls: ['./e-card-preview.component.scss']
})
export class ECardPreviewComponent implements OnInit {
  loading;
  currentLanguage = "english";
  key;
  data;
  formGroup:FormGroup;
  @ViewChild('cancelCall') cancelCall:ElementRef;
  @ViewChild('callTriger') callTriger:ElementRef;
  modal_src;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private socket:SocketioService,
  ) { 
  }
  //LanguageChagePart
  changeLang() {
      localStorage.setItem('language', this.currentLanguage)
  }
  async ngOnInit() {
    this.formSet();
    this.paramset();
    this.getCard();
    this.connectSocket();
  }

  paramset(){
    this.key = this.route.snapshot.params.key;
  }
  //for formset
  formSet() {
    this.formGroup = this._formBuilder.group({
      title:['',Validators.required],
      content:[''],
      receiver:[this.data?this.data.user_id:'']
    });
  }
  async getCard() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/e-card/getUserCard',{memberId:this.key},false).toPromise()
      this.data= res['result'];
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
    //for sockect
    connectSocket(){
      this.socket.emit('set-user-data',{memberID:new Date().getTime(),email:'OutSideUser'})
      this.socket.listen('resultOffice').subscribe(
        res=>{
          if(this.cancelCall.nativeElement) this.cancelCall.nativeElement.click();
          if(res['status']!==0){
            this.userService.errorMessage(res['message']);
          }
          else{
            window.open(res['url'], "_blank");
          }
        },
        err=>{
          console.log(err)
        }
      );
    }
    enteroffice(){
      this.socket.emit('enterOffice',{memberId:this.data.user_id,email:this.data.email,nativeName:this.data.nativeName});
      this.callTriger.nativeElement.click();
    }
    canceloffice(){
      this.socket.emit('cancelOfficeByRequester',{memberId:this.data.user_id,email:this.data.email,nativeName:this.data.nativeName});
      this.cancelCall.nativeElement.click();
    }
    async leaveMessage(){
      if(this.formGroup.invalid){
        this.userService.errorMessage("Please input subject.");
        return;
      }
      try{
        const res = await this.userService.postRequest('_api/messageBoard/leavemessageForOutSide',this.formGroup.value,false).toPromise();
        window.open(res['result'], "_blank");
      }catch(err){
        this.userService.handleError(err)
      }
    }
  onImgError(event){
    event.target.src = 'assets/theme/img/avatar_22.jpg';
   //Do other stuff with the event.target
   }
}


