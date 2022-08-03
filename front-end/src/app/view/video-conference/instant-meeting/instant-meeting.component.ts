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
  selector: 'app-instant-meeting',
  templateUrl: './instant-meeting.component.html',
  styleUrls: ['./instant-meeting.component.scss']
})
export class InstantMeetingComponent implements OnInit {
  loading;
  is_lock = false;
  formGroup: FormGroup;
  hours = [0,1,2,3,4,5,6,7,8,9,10];
  mins = [5,10,15,20,25,30,35,40,45,50,55,60];
  addressBook=[];
  selected_text = '';
  selectedUsers = [];
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
  async getContact(){
    try{
     const res = await this.userService.postRequest('_api/user/getContact').toPromise();
     this.addressBook = res['result'];
    }catch(err){

    }
  }
  formSet(item=null) {
    if(!item){
      this.selectedUsers=[];
      this.formGroup = this._formBuilder.group({
        meetingId:[],
        title:['',Validators.required],
        hour:[0,Validators.required],
        min:[5],
        auto_recording:[true],
        auto_extension:[true],
        meetingType:[0],
      });
    }else{
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
    }
  }
  async create(){
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
    try{
     const res = await this.userService.postRequest('_api/instantmeeting/createInstantMeetig',data).toPromise();
     this.userService.handleSuccess(res['message']);
     this.userService.gotoURL('/video-conference/incoming')
    }catch(err){
     this.userService.handleError(err);
    }
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


