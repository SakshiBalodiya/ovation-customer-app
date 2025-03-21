import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BestdealPage } from './bestdeal.page';

const routes: Routes = [
  {
    path: '',
    component: BestdealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BestdealPageRoutingModule {}
