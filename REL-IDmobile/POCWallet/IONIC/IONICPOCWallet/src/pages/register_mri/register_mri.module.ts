import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { RegisterPageMRI } from './register_mri';

@NgModule({
  declarations: [
    RegisterPageMRI,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPageMRI),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterPageMRI
  ]
})
export class RegisterPageMRIModule { }
