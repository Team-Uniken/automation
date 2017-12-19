//
//  LoginViewController.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "LoginViewController.h"
#import "RequestUtility.h"
#import "AddAmountViewController.h"
#import "DoneCancelNumberPadToolbar.h"

@interface LoginViewController ()<DoneCancelNumberPadToolbarDelegate>{
  NSString *user_id;
  NSString *user_name;
  NSString *balance;
  NSString *wallet_id;
}

@end

@implementation LoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  self.txtLabel.text = kDummyText;
  self.navigationheader.titleLabel.text = @"POC Wallet";
    // Do any additional setup after loading the view.
  
  DoneCancelNumberPadToolbar *toolbar = [[DoneCancelNumberPadToolbar alloc] initWithTextField:_MPinTxtFld];
  toolbar.delegate = self;
  _MPinTxtFld.inputAccessoryView = toolbar;
  
#ifdef DEBUG
  self.loginIdTxtFld.text = @"9860818913";
  self.MPinTxtFld.text =@"1111" ;
#endif

}


#pragma -mark NumberPad keyboard button delegates
-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickDone:(UITextField *)textField{
  [textField resignFirstResponder] ;
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickCancel:(UITextField *)textField{
   [textField resignFirstResponder] ;
}

-(void)viewDidAppear:(BOOL)animated{
  [super viewDidAppear:animated];
}
- (IBAction)loginBtnClick:(id)sender {
  
  if([self doValidate])
  [self doLogin];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(BOOL)doValidate{
  
  if(self.loginIdTxtFld.text.length <= 0){
     [self showErrorWithMessage:@"Please enter loginID" ];
    return false;
  }
  if(self.MPinTxtFld.text.length <= 0){
     [self showErrorWithMessage:@"Please enter MPIN" ];
    return false;
  } 
  return true;
}

-(void)doLogin{
  [self addProccessingScreenWithText:@"Please wait.."];
  RequestUtility *utility = [RequestUtility sharedRequestUtility];
  NSString *url = kLogin;
  NSMutableDictionary *params = [[NSMutableDictionary alloc]init];
  [params setValue:self.loginIdTxtFld.text forKey:@"login_id"];
  [params setValue:self.MPinTxtFld.text forKey:@"password"];
  [utility doPostRequestfor:url withParameters:params onComplete:^(bool status, NSDictionary *responseDictionary){
    if (status && [responseDictionary objectForKey:@"error"] == nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        [self parsedoAddAmountResponse:responseDictionary];
      });
    }else{
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        [self showErrorWithMessage:[responseDictionary valueForKey:@"error"]];
      });
    }
  }];
}


-(void)parsedoAddAmountResponse:(NSDictionary*)ResponseDictionary{
  
  user_id = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"user_id"]];
  user_name = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"user_name"]];
  balance = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"balance"]];
  wallet_id = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"wallet_id"]];
  
  
  TwoFactorState *objTwoFactorState= [TwoFactorState sharedTwoFactorState];
  objTwoFactorState.userID = [NSString stringWithFormat:@"%@",self.loginIdTxtFld.text];
  objTwoFactorState.walletID = wallet_id;
  objTwoFactorState.balance = balance;
  objTwoFactorState.userName = user_name;
  objTwoFactorState.cardPin = self.MPinTxtFld.text;
  [objTwoFactorState startTwoFactorFlowWithChallenge:objTwoFactorState.rdnaChallenges];
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
  
  if ([segue.identifier isEqualToString:@"loginToAddAmount"]) {
    AddAmountViewController *vc = [segue destinationViewController];
    vc.user_id = user_id;
    vc.user_name = user_name;
    vc.balance = balance;
    vc.wallet_id = wallet_id;
    
  }
}


@end
