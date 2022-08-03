import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupOrganizeComponent } from './group-organize/group-organize.component';

const routes: Routes = [
  { path:'',redirectTo:'organize'},
  { path: 'organize',component: GroupOrganizeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule {
}
