import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  constructor(public navCtrl: NavController) {

  }
  
  openFilters() {
    console.log('crap')
}

}
