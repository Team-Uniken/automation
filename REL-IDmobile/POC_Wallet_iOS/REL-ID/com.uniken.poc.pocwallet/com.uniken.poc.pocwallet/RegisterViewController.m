//
//  RegisterViewController.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "RegisterViewController.h"
#import "RequestUtility.h"
#import "AddAmountViewController.h"
#import "DoneCancelNumberPadToolbar.h"
@interface RegisterViewController ()<DoneCancelNumberPadToolbarDelegate>{
  NSString *user_id;
  NSString *user_name;
  NSString *balance;
  NSString *wallet_id;
}

@end

@implementation RegisterViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  self.txtLabel.text = kDummyText;
  self.navigationheader.titleLabel.text = @"Register";
  
  DoneCancelNumberPadToolbar *numberPadCardPinTxtFld = [[DoneCancelNumberPadToolbar alloc] initWithTextField:self.cardPinTxtFld];
  numberPadCardPinTxtFld.delegate = self;
  self.cardPinTxtFld.inputAccessoryView = numberPadCardPinTxtFld;
  
  DoneCancelNumberPadToolbar *numberPadmPinTxtFld = [[DoneCancelNumberPadToolbar alloc] initWithTextField: self.mPinTxtFld];
  numberPadmPinTxtFld.delegate = self;
  self.mPinTxtFld.inputAccessoryView = numberPadmPinTxtFld;
  
  DoneCancelNumberPadToolbar *numberPadConfirmMpinTxtFld = [[DoneCancelNumberPadToolbar alloc] initWithTextField:self.confirmMpinTxtFld];
  numberPadConfirmMpinTxtFld.delegate = self;
  self.confirmMpinTxtFld.inputAccessoryView = numberPadConfirmMpinTxtFld;
  
#ifdef DEBUG
  NSString *temp = @"9860818913";
  self.loginIDTxtFld.text = @"9860818913";
  self.cardNuberTxtFld.text = @"1111111111111119";
  self.cardPinTxtFld.text = @"1111";
  self.mPinTxtFld.text = @"1111";
  self.confirmMpinTxtFld.text = @"1111";
#endif

    // Do any additional setup after loading the view.
}
- (IBAction)registerButtonClick:(id)sender {
  if([self doValidate])
  [self doRegister];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


-(BOOL)doValidate{  
  if(self.loginIDTxtFld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter loginID"];
    return false;
  }

  if(self.cardNuberTxtFld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter card number"];
    return false;
  }
  
  if(self.cardPinTxtFld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter card pin"];
    return false;
  }
  
  if(self.mPinTxtFld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter MPIN"];
    return false;
  }
  
  if(self.confirmMpinTxtFld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter confirm MPIN"];
    return false;
  }
  
  if(![self.mPinTxtFld.text isEqualToString:self.confirmMpinTxtFld.text]){
    [self showErrorWithMessage:@"MPIN and confirm MPIN should be same"];
    return false;
  }
  
  return true;
}

-(void)doRegister{
  [self addProccessingScreenWithText:@"Please wait.."];
  RequestUtility *utility = [RequestUtility sharedRequestUtility];
  NSString *url = kRegister;
  NSMutableDictionary *params = [[NSMutableDictionary alloc]init];
  [params setValue:self.loginIDTxtFld.text forKey:@"login_id"];
  [params setValue:self.mPinTxtFld.text forKey:@"password"];
  [params setValue:self.cardNuberTxtFld.text forKey:@"card_no"];
  [params setValue:self.cardPinTxtFld.text forKey:@"card_pin"];

  [utility doPostRequestfor:url withParameters:params onComplete:^(bool status, NSDictionary *responseDictionary){
    if (status && [responseDictionary objectForKey:@"error"] == nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        [self parsedoRegisterResponse:responseDictionary];
      });
    }else{
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        [self showErrorWithMessage:[responseDictionary valueForKey:@"error"]];
      });
    }
  }];
}


-(void)parsedoRegisterResponse:(NSDictionary*)ResponseDictionary{
  
  user_id = [ResponseDictionary valueForKey:@"user_id"];
  user_name = [ResponseDictionary valueForKey:@"user_name"];
  balance = [ResponseDictionary valueForKey:@"balance"];
  wallet_id = [ResponseDictionary valueForKey:@"wallet_id"];
  
  
   TwoFactorState *objTwoFactorState= [TwoFactorState sharedTwoFactorState];
  
  objTwoFactorState.mPin = [NSString stringWithFormat:@"%@",self.mPinTxtFld.text];
  objTwoFactorState.userID = [NSString stringWithFormat:@"%@",self.loginIDTxtFld.text];
  objTwoFactorState.actCode = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"act_code"]];
  objTwoFactorState.walletID = wallet_id;
  objTwoFactorState.balance = balance;
  objTwoFactorState.userName = user_name;
  
  [objTwoFactorState startTwoFactorFlowWithChallenge:objTwoFactorState.rdnaChallenges];
  //[self performSegueWithIdentifier:@"registerToAddAmount" sender:nil];
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
  
  if ([segue.identifier isEqualToString:@"registerToAddAmount"]) {
    AddAmountViewController *vc = [segue destinationViewController];
    vc.user_id = user_id;
    vc.user_name = user_name;
    vc.balance = balance;
    vc.wallet_id = wallet_id;
    
  }
}


-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickDone:(UITextField *)textField
{
  [textField resignFirstResponder] ;
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickCancel:(UITextField *)textField
{
  [textField resignFirstResponder] ;
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
