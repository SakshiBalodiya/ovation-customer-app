import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomalertPage } from './customalert.page';

const routes: Routes = [
  {
    path: '',
    component: CustomalertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomalertPageRoutingModule {}
