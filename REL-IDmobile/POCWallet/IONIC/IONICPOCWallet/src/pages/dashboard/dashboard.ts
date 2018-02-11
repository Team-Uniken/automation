import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,NavParams } from 'ionic-angular';
import { Toast } from '../toast/toast';
import { User } from '../../providers/providers';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

  account:{ login_id: string, amount:string,  text1:string,text2:string,} = {
    login_id: '9860818913',
    amount: '10',
    text1: '',
    text2:'',
    
  };

  // Our translated text strings
  private signupErrorString: string;


  amount:any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,public navParams: NavParams,public toast: Toast) {

      this.account.login_id = navParams.get('login_id'); 
      this.amount = navParams.get('amount');
      this.account.text1 = 'Welcome '+this.account.login_id;
      this.account.text2 = 'Your wallet balance is '+this.amount;
      //alert(this.account.login_id+" "+this.amount );
      //this.account.amount = this.amount;
     
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  
  doAddMoney() {
    // Attempt to login in through our User service
    if(this.account.amount.length === 0){
      this.toast.showToast("Please enter amount");
      return;
    }

    this.toast.showLoader()
    this.user.addMoney(this.account).subscribe((resp:any) => {
      this.toast.hideLoader();
      
      if(resp.error){
        let toast = this.toastCtrl.create({
          message: resp.error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        alert(JSON.stringify(resp));
        this.account.amount = '';
        this.account.text2 = 'Your wallet balance is '+resp.balance;
      }
    }, (err) => {
      // Unable to sign up
      this.toast.hideLoader();
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
