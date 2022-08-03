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
 
@Component({
  selector: 'app-recording-content',
  templateUrl: './recording-content.component.html',
  styleUrls: ['./recording-content.component.scss']
})
export class RecordingContentComponent implements OnInit {
  loading;
  item = [];
  tbHeader = ['MeetingId', 'Title', 'Ended', 'FileName','FileSize'];
  tbCol = ['meetingId','title','ended_at','fileName','fileSize'];
  displayedColumns: string[] = ['meetingId','title','ended_at','fileName','fileSize'];
  specialCol = ['permission']
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  selected_items = [];
  formGroup: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort ) sort: MatSort;
  @Output() selectedMeeting = new EventEmitter();
  @Output() selectedItems = new EventEmitter();
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) {
  }
  async ngOnInit() {
    this.setTableList();
    await this.search()
  }
  async search() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/meeting/getHistoryRecord').toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  selectMeeting(item){
    this.selectedMeeting.emit(item);
  }
  //table
  setTableList() {
    this.selection.clear();
    let data = JSON.parse(JSON.stringify(this.item));
    this.tableList = new MatTableDataSource(data)
    setTimeout(()=>{
      this.tableList.paginator = this.paginator;
      this.tableList.sort = this.sort;
    },300);
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
