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
declare var $:any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  loading;
  dept = [];
  groups = [];
  param = {
    dept:'all',
    key:''
  };
  item = [];
  root_item = [];
  moveTo;
  send_msg = {
    from:'',
    to:'',
    content:'',
  };
  is_lock = true;
  is_show = false;
  tbHeader = ['UserType','Group','Name', 'Phone', 'Email','Company','Dept','Role'];
  tbCol = ['usertype','group_name','nativeName','phone','email','company','dept_name','role_name'];
  displayedColumns: string[] = ['select','No','usertype','group_name','nativeName','phone','email','company','dept_name','role_name','Action'];
  specialCol = ['usertype','is_del'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  formSetting = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @ViewChild('preview_avatar') public avatar_tag:ElementRef;
  @ViewChild('fileinput') public fileinput:ElementRef;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) {
  }
  async ngOnInit() {
    this.formSet();
    this.deptget();
    this.setTableList();
    await this.search()
  }
  async deptget(message=true){
    try{
       const res = await this.userService.postRequest('_api/dept/get').toPromise();
       this.dept = res['result'].filter(x=>x.dept_level!=0);
       this.makeTree(res['result'])
    }catch(err){
      this.userService.handleError(err);
    }
  }
  getdept(dept_id){
    for(let i = 0; i < this.dept.length; i++)
      if(this.dept[i].id == dept_id) return this.dept[i].dept_name
    return '';
  }
  setDept(dept_id){
    this.formGroup.patchValue({
      dept_id:dept_id
    })
  }
  async search() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/get').toPromise()
      this.item = res['result'];
      this.makeGroup(this.item);
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  formSet(item=null) {
    this.is_lock = false;
    this.is_show = false;
    if(item==null){
      this.formGroup = this._formBuilder.group({
        id:[''],
        group_name:[''],
        nativeName: ['',Validators.required],
        email: ['',[Validators.email]],
        phone: ['',[Validators.required]],
        company: [''],
        dept_name: [''],
        role_name: [''],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        id:[item.id],
        group_name:[item.group_name],
        nativeName: [item.nativeName,Validators.required],
        email: [item.email,[Validators.email]],
        phone: [item.phone,[Validators.required]],
        company: [item.company],
        dept_name: [item.company],
        role_name: [item.role_name],
      });
    }
  }
  async create(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    const data = this.formGroup.value;
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/createOut',data).toPromise()
      this.userService.handleSuccess(res['message']);
      this.is_lock = true;
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async edit(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly');
      return;
    }
    const data = this.formGroup.value;
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/edit',data).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/del',this.selected_items).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async regroup(){
    if(!this.moveTo) {
      this.userService.errorMessage('Please input dept to move.');
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/addressBook/regroup',{data:this.selected_items,moveTo:this.moveTo}).toPromise()
      this.userService.handleSuccess(res['message']);
      this.closeModal('regroupingModal')
      await this.search()

    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async resetPassword(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/user/resetPasswordUser',item).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async sendmessage(){
    if(!this.send_msg.content) {
      this.userService.errorMessage('Please input message to send.');
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/user/sendmessage',this.send_msg).toPromise()
      this.userService.handleSuccess(res['message']);
      this.closeModal('sendModal');
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  showDeleteModal(item){
    if(item.length==0){
      this.userService.errorMessage('Please select items to delete')
      return
    }
    this.selected_items = item;
    $('#deleteModal').modal('show')
  }
  closeModal(id){
    $(`#${id}`).modal('hide');
  }
  showRegroupModal(item){
    this.moveTo = undefined;
    if(item.length==0){
      this.userService.errorMessage('Please select items to regroup')
      return
    }
    this.selected_items = item;
    $('#regroupingModal').modal('show')
  }
  showSendModal(item){
    if(!item.email){
      this.userService.errorMessage('This user has no email.');
      return;
    }
    this.send_msg = {
      from:'',
      to:item.email,
      content:'',
    };
    $('#sendModal').modal('show')
  }
  makeGroup(item){
    const result = [];
    for(let i = 0; i < item.length; i++){
       const {group_name} = item[i];
       if(group_name&&result.indexOf(group_name)===-1) result.push(group_name)
    }
    this.groups = result;
  }
  makeTree(item){
    const previos = JSON.parse(JSON.stringify(this.root_item));
    const getChildren = (arr,c)=>{
      const result = [];
      for(let i = 0; i < arr.length; i++){
        if(c.id == arr[i].super_dept) result.push(arr[i])
      }
      return result
    }
    const data = JSON.parse(JSON.stringify(item));
    this.root_item = [];
    for(let i = 0 ; i < data.length; i++){
      const {dept_level} = data[i];
      if(dept_level==0){
        data[i].children = JSON.parse(JSON.stringify(getChildren(data,data[i])));
        for(let k = 0 ; k < data[i].children.length; k++){
          const {dept_level} = data[i].children[k];
          if(dept_level==1){
            data[i].children[k].children= JSON.parse(JSON.stringify(getChildren(data,data[i].children[k])));
          }
        }
        this.root_item.push(data[i]);
      }
    }
    if(this.root_item.length>0) this.root_item[0].is_collapse = true;
  }
  setFile(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
        this.avatar_tag.nativeElement.src = reader.result
        this.formGroup.patchValue(
          {
            avatar_file:event.target.files[0]
          }
        );
      }
    }
  }
  openFileInput(){
    this.fileinput.nativeElement.click();
  }
  //table
  setTableList() {
    this.selection.clear();
    let data = [];
    if(this.param.dept!='all') data = this.item.filter(x=>x.dept_id==this.param.dept)
    else data = this.item
    if(this.param.key) data = data.filter(x=>x.address_name==this.param.key||x.nativeName==this.param.key||x.phone==this.param.key||x.email==this.param.key||x.dept_name==this.param.key)
    this.tableList = new MatTableDataSource(data)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  //mat-table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableList.filter = filterValue.trim().toLowerCase();

    if (this.tableList.paginator) {
      this.tableList.paginator.firstPage();
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  onSelectionChange(){
    const selected = this.tableList.data.filter(t=>this.selection.isSelected(t))
    this.selectedItems.emit(selected)
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableList.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  onImgError(event){
    event.target.src = 'assets/theme/img/avtars.png';
   //Do other stuff with the event.target
   }
}


