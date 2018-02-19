import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Toast } from '../toast/toast';
import { TwoFactorState } from '../twofatorstate/twofatorstate';

declare var com: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public toast : Toast) {

    document.addEventListener('onInitializeCompleted',  (e: any)=> {
      //console.log(e);
      
      alert('onInitializeCompleted');
      let res = JSON.parse(e.response);
      //console.log("error code--->" + responseJson.errCode);

      if (res.errCode == 0) {
        //this.toast.showToast("Initialization Done");

        //  var statusCode = res.pArgs.response.StatusCode;
        //   if (statusCode == 100) {
          let challengeJson;
        if (res.pArgs.response.ResponseData) {
          challengeJson = res.pArgs.response.ResponseData;
          TwoFactorState.initialChallengesJson = challengeJson;
        }

        
      }
      else
        this.toast.showToast("Initialization Failed");

      //alert(JSON.stringify(e));
    });
   
    setTimeout(() => {
      this.initRelID();
     }, 2000);
   
  }


  login() {
    this.navCtrl.push(LoginPage);
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }


  initRelID() {
   // this.toast.showLoader();
   com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["SfCYweYCR5KVf30IzbTW6jEfTP6mLiVP1hzMce/8PFQ/UJaMkVxkUumCND0Zf5ZfZ5Lcmww6Tc3n0dPpS2ogj1xeSOWI6pMHFGUJKXEZ106nYt3TpghZmvspqZAG1KeicLoMI1r9aJDpS8I+jFwinlCkionTwLWUgKSLA61Ex6eWUgdtv6wIN/S15SjzMN2qEcGV1ioK8IQzLwtBsvoW3elhzesuU9z5AltSdvI0l98hC/1N2dJ4IhGp4Ba4aGOIyFq9vLdNr62VvxmCnGibB/FyYQ/RP9jHTHuxH77HT3QL6Sp0/LIKVbdYwLzR3IELShkribM83cbzAyouAZXUKAiRzTQXb+8EgfuvUvyLq+WtLvaNcK/AF4GK2CRlCPOuVSLh0nB1JvehA8zIls6bZbLM8jN9Mn++SjevOGcCLUAhCxH4yBk7EvGldCNQNKkiNHOOBnhJuDt1SOwp9ZW+V+j4UcmvEw+Mj6AuXt3Tg+N0RjtXf7V+Xy+5p8q26pMES5+AAaK99FXtUfX+ywVtrE4mCpqkvVE46tDIkc0DUcxhlaOHpQL8toMJfIgHbQamQ/Yc0/ODbI70mNDx6r/tgKxf3JdobAvavxVyb4ZdASlBV8LTCuShZQulFFeaDSvmH5+HHCQ95rco6wwKo9CN2bYF0d0zZ/a0sqeZzh/7BPMw5TrAz2OyhZAi2Z66eF/k4lS7EA7y1mUMUuF4Xq02dJQv4HJUF0lvG9hmrcENASkVWy/ebn7kd3iBfdcdP65YEJRzRhMX3zVWOhRgFRSHnmByUwn3LMJrn7DV319uG8vp6mbqtVgLJmSC3Lb0XU4AdTwPUT9xvC4aK9Hff2qR4iRDwFHxgPgEaB309h7n7ZEn75BGM423Z/i9SG6zpxg9nYEYWhDO9psAK13cFri5tqDLcmcBBKKGSroGz0fqn+iPMnxA1unBbWf5Takq2QIZgbqT8U5L9VwEOgCAdMgPQNAhsU4v47vpJeROHW+LYdM8kSWEsa/Yfl9ektn6W93l0Xkd5Lw7oai4ijc71qY55ei7hPJTjhednqCjn8pVSFp00D97W2WCiJpsJoLblgYYDNfmKL7eUPni31GQF3wD6OAKMY1qLgIqvyidwgyDtHsqQt7a8onYIAoOqIGb+kHR5sQaeu1e43MmcYqRKfx+Bh/faoBf1isvwNY2qYSrjIC7ztwqpTWxOQCjTlOJlhqQg8MguNyJAivadjqjxGJBuWPLdM6AUqreDYcU8Wl7McKCuuFfn1C3YL54196GxIdbYLQXg4SXpM+V86UCxpeQA5NQF8It/8W3gFJHQts1F8/coRe4YHCEqS/OohRdzUiJ9zOJNzJPqiSeHO7WKCuKAdrn1yWqtngys0OoI38a/AJAMUYRb2tF58PfbgzMXCLI/NbuU1GutamLGAjHpqBOvzYSN3jXi1tNx5qqN5ArOMioMbKtYbS+gYJiiT1GZqzJgLXPhVzhW6xB5anRwiJ9cuYXqx8d1T/GGnfFKnx8G7FTnKjTOu93LBi3nQR/Bm/l/Ymbuk6zT3uOYUsMN6kpq20FaKk+Zbd/l61Ni0V4LKgemSwhe0RDa03aF/AEpFmjXx/k6lzE/dd9hySjzjX6yZXRrhHXN078uWjID9AC1yj7h0YTgljWyFsbrrN1/rrnhTsncbCcZ4cCSEPRV637X/fCqPyyUxYc9p2sycXHeKHzOIBvjNbZ+0QufbZ3GuwyjXliWcYI8cof3cDjVyHWel2xojI/JhWKypX+7l58L154bUt/A2oeO8GyITnD1TRTAfLEqCS2kmcAEg+fXpAB7OPn6KY3+oGXv4TMsOkh2yu8cRm5N31Z95QO4DNr1g+KxvsJg9RWPiRVfKGMFuZwRjBwjwo1KEkdAvcgGQitACHCaygZq+gCQPtBgqpNnXG6vVRaDrQ8bFa0FyDB+ZqhPBcbRvxJTgpSJzHOV4mFhbl+c4n6uTjduQIcwjDKMDV7O5grESm5cvrspNsZTCrkZxeezcXDzxCHAryOEJH8mWuAeC1B+3Yo4ZWb90UbYRDaVXZQ7wbbs/UlAa7ZMv0uxUH84Z5X6Nst+ho4t+7OCPgfe238MXFyQz72BDskKUntGMM1cP62T6Xhne6iKS1XgkRdlHeE9g+48i5/Gk02up+N8kw8I7wJ1rhteR7YzXvM3ePCKn2pOCtT323CeTGhsK/T5dCWUD1vCle3H7/zPBxiB0ifwfR5tB8J257Lz/MzSOdbiLnjHxOw3Vow4jLCyyb0PzOilBgpuTihqBwODKMExIfMiK52i/Bp+K829A+VcMnMTYIWLLFM/8N0wnrwONB6ZjIg4ii35PgL5yW/G996zOqbpK6BbBVpKM144OyFvoHovP+/u0kCDAjPCskzxIM4QK6d5U6KJxeH0N7tcUhfOSWS35cA5/Wbx/iX7Jxe5OfcjxaJ1azdot6l8MwgTXplH4xF7DC5Lnh+hlPsflNMXD3FQma+UNi0PD3aeCS9Oc6lyqSM766fUGtBRakLjc9tcriXrmFkuiy3iJ3uiPbE5kNCuMtF3rWgfeIzo3w3q1Isg1LSbg5aBPBCT2kAhVg1sGiqjfr8a8lbTgOrrfpTY7qbh6KkG4ENYb+qg6v1ZEpUZcv+bM7FqatVJ9VSH9dfaRod5pqbBPTFva05Qf5Y/NIQyhor52R9wN3IJd9y5AMLo0yHU9kSVmvHli7uVn7JM3WrBefitmShVvhYqkkZiBYCAiocSEBMOwj8BMGamlruiWZBdK89MR+nvC4bJg==", "10.0.6.17", "443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
  }


  initSuccess(data) {
   // this.toast.hideLoader();
    console.log("RdnaClient.js: initSuccess");
  }

  initFailure(data) {
    //this.toast.hideLoader();
    this.toast.hideLoader();
    console.log("RdnaClient.js: initFailure");
  }

}
