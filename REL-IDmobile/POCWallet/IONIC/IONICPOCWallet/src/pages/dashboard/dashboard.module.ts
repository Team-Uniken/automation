import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DashboardPage } from './dashboard';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild()
  ],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule { }
