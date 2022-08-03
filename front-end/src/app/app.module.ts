import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//module
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from './module/language-translation.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { DemoMaterialModule } from './material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

// Import routing module
import { AppRoutingModule } from './app.routing';
// Import containers
import { HorizonLayoutComponent } from './containers/horizon-layout/horizon-layout.component'
import { DefaultLayoutComponent } from './containers/defalut-layout/default-layout.component';
import { P404Component } from './view/error/404.component';
import { P500Component } from './view/error/500.component';
// Import component
import { AppComponent } from './app.component';
import { LoginComponent } from './view/login/login.component';
import { ResetPasswordComponent } from './view/login/reset-password/reset-password.component';
import { DeptManageComponent } from './view/dept-manage/dept-manage.component';
import { UserComponent } from './view/user/user.component';
import { ProfileComponent } from './view/profile/profile.component';
import { ScheduleMettingComponent } from './view/video-conference/schedule-metting/schedule-metting.component';
import { SysteminfoComponent } from './view/system-manage/systeminfo/systeminfo.component';
import { ServerStatusComponent } from './view/system-manage/server-status/server-status.component';
import { MessengerStatusComponent } from './view/system-manage/messenger-status/messenger-status.component';
import { MeetingStatusComponent } from './view/system-manage/meeting-status/meeting-status.component';
import { DocumentShareComponent } from './view/knowledge-hub/document-share/document-share.component';
import { AddressBookComponent } from './view/address-book/address-book.component';
import { WebofficeSettingComponent } from './view/weboffice-setting/weboffice-setting.component';
import { AddressBookUserContentComponent } from './view/address-book/address-book-user-content/address-book-user-content.component';
import { ECardEditComponent } from './view/e-card-edit/e-card-edit.component';
import { ECardPreviewComponent } from './view/e-card-preview/e-card-preview.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RecordingManageComponent } from './view/cloud-storage/recording-manage/recording-manage.component';
import { CloudDiskComponent } from './view/cloud-storage/cloud-disk/cloud-disk.component';
import { AnonymousAccessComponent } from './view/anonymous-access/anonymous-access.component';
import { FooterComponent } from './containers/footer/footer.component';
import { DocPreviewComponent } from './view/doc-preview/doc-preview.component';
import { InstantMeetingComponent } from './view/video-conference/instant-meeting/instant-meeting.component';
import { IncomingMeetingComponent } from './view/video-conference/incoming-meeting/incoming-meeting.component';
import { HistoryMeetingComponent } from './view/video-conference/history-meeting/history-meeting.component';
import { RecordingContentComponent } from './view/video-conference/recording-content/recording-content.component';
import { DataTableModule } from './module/Datatable/DataTableModule';
import { MessageBoardComponent } from './view/multimedia/message-board/message-board.component';
import { CheckMessageComponent } from './view/multimedia/check-message/check-message.component';
import { SocketioService } from './service/socketio.service';
import { AlertViewComponent } from './containers/alert-view/alert-view.component';
import { MeetingCalendarComponent } from './view/video-conference/meeting-calendar/meeting-calendar.component';
import { NgxTuiCalendarModule } from 'ngx-tui-calendar';
import { TestComponent } from './view/test/test.component';
import { LearnRecordComponent } from './view/learn/view-detail/learn-record/learn-record.component';
import { MailComponent } from './view/mail/mail.component';
import { MailWriteComponent } from './view/mail/mail-write/mail-write.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    IconModule,
    IconSetModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot(),
    DemoMaterialModule,
    QRCodeModule,
    NgxDocViewerModule,
    DataTableModule,
    NgxTuiCalendarModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    P404Component,
    P500Component,
    HorizonLayoutComponent,
    DefaultLayoutComponent,
    LoginComponent,
    ResetPasswordComponent,
    DeptManageComponent,
    UserComponent,
    ProfileComponent,
    ScheduleMettingComponent,
    SysteminfoComponent,
    ServerStatusComponent,
    MessengerStatusComponent,
    MeetingStatusComponent,
    DocumentShareComponent,
    AddressBookComponent,
    WebofficeSettingComponent,
    AddressBookUserContentComponent,
    ECardEditComponent,
    ECardPreviewComponent,
    RecordingManageComponent,
    CloudDiskComponent,
    AnonymousAccessComponent,
    FooterComponent,
    DocPreviewComponent,
    InstantMeetingComponent,
    IncomingMeetingComponent,
    HistoryMeetingComponent,
    RecordingContentComponent,
    MessageBoardComponent,
    CheckMessageComponent,
    AlertViewComponent,
    MeetingCalendarComponent,
    TestComponent,
    LearnRecordComponent,
    MailComponent,
    MailWriteComponent,
  ],
  exports:[
    HorizonLayoutComponent,
    DefaultLayoutComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    SocketioService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
