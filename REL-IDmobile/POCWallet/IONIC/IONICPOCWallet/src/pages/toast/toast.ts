import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicPage, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from 'ionic-angular';
let loading;

@Component({
  templateUrl: 'toast.html'
})


export class Toast {
  constructor(public toastCtrl: ToastController, public loadingController: LoadingController,public alertCtrl:AlertController) {
    loading = this.loadingController.create({ content: "Please wait..." });
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  showLoader() {
    loading.present();
  }

  hideLoader() {
    loading.dismissAll();
  }

  showPrompt(inputsArr:any,buttonsArr:any) {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: inputsArr,
      buttons: buttonsArr,
    });
    alert.present();
  }
}