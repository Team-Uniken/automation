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
    login_id: 'swap7',
    card_no: '111111',
    card_pin:"1111",
    password: '1111',
    password_cofirm:'1111'
  };

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

   // this.toast.showLoader();
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp:any) => {
      if(resp.error){
       /// this.toast.hideLoader();
        this.toast.showToast(resp.error);
      }else{
        let response = resp;
        new TwoFactorState(this.navCtrl,this.toast,this.events).startActivation(response.act_code,this.account.login_id,this.account.password);
      }
    }, (err) => {
      this.toast.showToast(this.signupErrorString);
   //   this.toast.hideLoader();

      // Unable to sign up
    });
    }
}
