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
@Component({
  selector: 'app-document-share',
  templateUrl: './document-share.component.html',
  styleUrls: ['./document-share.component.scss']
})
export class DocumentShareComponent implements OnInit {
  loading;
  item = [{id:1,Title:'sdfsd',Publisher:'1231',ShareTime:'sdfsdf',Size:'100mb'}];
  tbHeader = ['Title', 'Publisher', 'Share Time', 'Size'];
  tbCol = ['Title', 'Publisher', 'ShareTime', 'Size'];
  specialCol = [];
  displayedColumns: string[] = ['select','Title', 'Publisher', 'ShareTime', 'Size','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { 
  }
  async ngOnInit() {
    this.formSet();
    this.setTableList();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      $(".datepicker").flatpickr({
        enableTime: false,
        altFormat: "F j, Y",
        dateFormat: "m/d/Y",
    });
    },300)
  }
  async search() {
    console.log(this.formGroup.value);
    return
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/user/get').toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  formSet(item=null) {
      this.formGroup = this._formBuilder.group({
        from:[this.cf.getDateStringMMDDYYYY(new Date())],
        to:[this.cf.getDateStringMMDDYYYY(new Date())],
        filter:[1],//1-read,2-unread
        title:[''],
      });
  }
  //table
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
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


