import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicPage, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/providers';
import { DashboardPage } from '../dashboard/dashboard';
import { Toast } from '../toast/toast';
import { elementDef } from '@angular/core/src/view/element';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import * as Constants from '../twofatorstate/constants';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  account: { login_id: string, password: string, acess_code: string } = {
     //login_id: 'swap7',
     //password: '1111'
    login_id: '',
    password: '',
    acess_code: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public events: Events, public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    //this.events.subscribe('login:success', this.callLoginApi);
    this.callLoginApi = this.callLoginApi.bind(this);
  }

  callLoginApi() {
    if(Constants.IS_MRI == 1){
      this.navCtrl.push(DashboardPage,{login_id:this.account.login_id , amount:0});
      return;
    }else {
      //DummyWalletAPI2 is not working 
      this.navCtrl.push(DashboardPage,{login_id:this.account.login_id , amount:0});
      return;
    }
    
    //uncomment this line for dummywallet api purpose
    /* this.toast.showLoader();
    this.user.login(this.account).subscribe((resp: any) => {
      this.toast.hideLoader();
      if (resp.error) {
        this.toast.showToast(resp.error);
      } else {
        this.navCtrl.push(DashboardPage,{login_id: resp.login_id, amount:resp.balance});
      }
    }, (err) => {
      this.toast.hideLoader();
      this.toast.showToast(this.loginErrorString);
    }); */
      }

  // Attempt to login in through our User service
  doLogin() {

    if(!this.validate())
    return;
    
    this.toast.showLoader();
    let state:TwoFactorState;
    state = new TwoFactorState(this.navCtrl,this.toast,this.events);
    state.callback = this;
    alert(this.account.acess_code.trim());
    if(this.account.acess_code.trim() === "")
    state.doLogin(this.account.login_id.trim(), this.account.password.trim());
    else 
    state.doActivationLogin(this.account.login_id.trim(), this.account.password.trim(), this.account.acess_code.trim());
  }


  validate(){
    if(this.account.login_id.trim().length===0){
     this.toast.showToast("Please enter loginID");
      return false;
    }
    if(this.account.password.trim().length===0){
      this.toast.showToast("Please enter RPIN");
      return false;
    }
    return true;
  }
}
