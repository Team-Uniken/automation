import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

  account:{ login_id: string, amount: string,  } = {
    login_id: '9860818913',
    amount: '10',
    
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  
  doAddMoney() {
    // Attempt to login in through our User service
    this.user.addMoney(this.account).subscribe((resp:any) => {
      if(resp.error){
        let toast = this.toastCtrl.create({
          message: resp.error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        this.account.amount = resp.balance;
      }
    }, (err) => {
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
