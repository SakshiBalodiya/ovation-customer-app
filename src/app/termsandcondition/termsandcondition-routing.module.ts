import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsandconditionPage } from './termsandcondition.page';

const routes: Routes = [
  {
    path: '',
    component: TermsandconditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsandconditionPageRoutingModule {}
