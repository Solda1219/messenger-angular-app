import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgMultiSelectDropDownModule } from '../../module/ng-multiselect-dropdown/src';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DemoMaterialModule } from '../../material.module';

import { GroupOrganizeComponent } from './group-organize/group-organize.component';
import { GroupRoutingModule } from './group-routing.module';
import { GroupContentComponent } from './group-content/group-content.component';
import { UserContentComponent } from './user-content/user-content.component';



@NgModule({
  declarations: [GroupOrganizeComponent, GroupContentComponent, UserContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    GroupRoutingModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    DemoMaterialModule,
    TabsModule,
    ProgressbarModule,
  ]
})
export class GroupModule { }
