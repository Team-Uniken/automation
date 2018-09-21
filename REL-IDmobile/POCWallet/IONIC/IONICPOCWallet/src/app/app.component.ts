import { Component } from '@angular/core';
import { AlertController, Nav, Platform ,ViewController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';
import { NotificationPage } from '../pages/notification/notification';
import { TwoFactorState } from '../pages/twofatorstate/twofatorstate';
declare var com:any
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 nav: Nav;
  rootPage:any = HomePage;
  //rootPage:any = NotificationPage;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public push: Push,public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.initPushNotification();
    });
  }

  updateSuccess(data) {
    // this.toast.hideLoader();
    console.log("notifications devvice Success");
  }

  updateFailure(data) {
    //alert('device token ->  notifications failed');
    console.log("notifications device failed");
  }
  
  initPushNotification() {
    if (!this.platform.is('cordova')) {
      //alert("gthhhh");
      console.log('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    // const options: PushOptions = {
    //   android: {
    //     senderID: 'YOUR_SENDER_ID'
    //   },
    //   ios: {
    //     alert: 'true',
    //     badge: false,
    //     sound: 'true'
    //   },
    //   windows: {}
    // };

    const push = this.push.init({
      android: {
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      },
      windows: {}
    });
    
    //const pushObject: PushObject = this.push.init(options);

    // pushObject.on('registration').subscribe((data: any) => {
    //   console.log('device token -> ' + data.registrationId);
    //   var tokenid:string;
    //   tokenid = data.registrationId;
    //   if(tokenid)
    //   com.uniken.rdnaplugin.RdnaClient.setDeviceToken(this.updateSuccess,this.updateFailure,[tokenid]);
    //   //TODO - send device token to server
    // });

    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {}
   };
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('registration').subscribe((registration: any) => {
   com.uniken.rdnaplugin.RdnaClient.setDeviceToken(this.updateSuccess,this.updateFailure,[registration.registrationId]);
   });

   pushObject.on('notification').subscribe((notification: any) => {alert('APNS11 '+notification);
  });
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
   
   

    // pushObject.on('notification').subscribe((data: any) => {
    //   console.log('message -> ' + data.message);
    //   alert('APNS '+data.message);
    //   //if user using app and push notification comes
    //   /*if (data.additionalData.foreground) {
    //     // if application open, show popup
    //     let confirmAlert = this.alertCtrl.create({
    //       title: 'New Notification',
    //       message: data.message,
    //       buttons: [{
    //         text: 'Ignore',
    //         role: 'cancel'
    //       }, {
    //         text: 'View',
    //         handler: () => {
    //           //TODO: Your logic here
    //           //this.nav.push(DetailsPage, { message: data.message });
    //         }
    //       }]
    //     });
    //     confirmAlert.present();
    //   } else {
    //     //if user NOT using app and push notification comes
    //     //TODO: Your logic on click of push notification directly
    //     //this.nav.push(DetailsPage, { message: data.message });
    //     console.log('Push notification clicked');
    //   }*/
    //   if(TwoFactorState.isLoginToDashboard == true){

    //     var vc:ViewController ;
    //      vc = this.nav.getByIndex((this.nav.length()) -1);
    //         alert("dashboard");
    //      //if(typeof vc === 'NotificationPage')

    //   }else{
     
    //     let confirmAlert = this.alertCtrl.create({
    //       title: 'New Notification',
    //       message: data.message,
    //       buttons: [{
    //         text: 'Ignore',
    //         role: 'cancel'
    //       }, {
    //         text: 'View',
    //         handler: () => {
    //           //TODO: Your logic here
    //           //this.nav.push(DetailsPage, { message: data.message });
    //         }
    //       }]
    //     });
    //   }
    

    // });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
}
}

