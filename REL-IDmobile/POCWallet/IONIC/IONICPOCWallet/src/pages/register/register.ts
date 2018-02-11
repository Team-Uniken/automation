import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,Events } from 'ionic-angular';

import { User } from '../../providers/providers';
import { DashboardPage } from '../dashboard/dashboard';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import { Toast } from '../toast/toast';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { login_id: string, card_no: string, card_pin: string, password: string, password_cofirm: string } = {
    // login_id: 'swap7',
    // card_no: '111111',
    // card_pin:"1111",
    // password: '1111',
    // password_cofirm:'1111'

    login_id: '',
    card_no: '',
    card_pin:"",
    password: '',
    password_cofirm:''
  };

  response:any;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService,
    public events:Events) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {

    if(!this.validate())
    return;

    this.toast.showLoader();
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp:any) => {
      this.toast.hideLoader();
      if(resp.error){
       
        this.toast.showToast(resp.error);
      }else{
         this.response = resp;
        let state:TwoFactorState;
        state = new TwoFactorState(this.navCtrl,this.toast,this.events);
        state.callback = this;
        state.startActivation(this.response.act_code,this.account.login_id,this.account.password);
      }
    }, (err) => {
      this.toast.showToast(this.signupErrorString);
      this.toast.hideLoader();
      // Unable to sign up
    });
    }

    public doDashboard(){
      this.navCtrl.push(DashboardPage,{
        login_id: this.response.login_id, amount:this.response.balance
    });
    }
    validate(){
      if(this.account.login_id.trim().length===0){
       this.toast.showToast("Please enter loginID");
        return false;
      }
      if(this.account.card_no.trim().length===0){
        this.toast.showToast("Please enter card number");
         return false;
       }
       if(this.account.card_pin.trim().length===0){
        this.toast.showToast("Please enter card pin");
         return false;
       }
      if(this.account.password.trim().length===0){
        this.toast.showToast("Please enter RPIN");
        return false;
      }
      if(this.account.password_cofirm.trim().length===0){
        this.toast.showToast("Please enter confirm RPIN");
        return false;
      }

      if(this.account.password_cofirm.trim()=== this.account.password.trim()){
      }else{
        this.toast.showToast("RPIN and Confirm RPIN should be same");
        return false;
      }

      return true;
    }
}
