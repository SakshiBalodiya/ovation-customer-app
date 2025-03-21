import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SortByPage } from './sort-by.page';

const routes: Routes = [
  {
    path: '',
    component: SortByPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortByPageRoutingModule {}
