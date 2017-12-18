//
//  AddAmountViewController.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "AddAmountViewController.h"
#import "RequestUtility.h"
#import "DoneCancelNumberPadToolbar.h"
@interface AddAmountViewController ()<DoneCancelNumberPadToolbarDelegate>

@end

@implementation AddAmountViewController
@synthesize user_id,user_name,balance,wallet_id;

- (void)viewDidLoad {
    [super viewDidLoad];
  self.txtLabel.text = kDummyText;
  self.navigationheader.titleLabel.text = @"Add Amount";
  self.navigationheader.navigationLeftButton.hidden = YES;
  
  self.welcomeLbl.text = [NSString stringWithFormat:@"Welcome %@",user_name];
  self.walletBalanceLbl.text = [NSString stringWithFormat:@"Your Wallet balance is : %@",balance];
  DoneCancelNumberPadToolbar *numberPadDoneButton = [[DoneCancelNumberPadToolbar alloc] initWithTextField:self.addAmountTxtfld];
  numberPadDoneButton.delegate = self;
  self.addAmountTxtfld.inputAccessoryView = numberPadDoneButton;
    // Do any additional setup after loading the view.
}
- (IBAction)addAmountButtonClick:(id)sender {
  if([self doValidate])
  [self doAddAmount];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(BOOL)doValidate{
  
  if(self.addAmountTxtfld.text.length <= 0){
    [self showErrorWithMessage:@"Please enter amount"];
    return false;
  }

  return true;
}


-(void)doAddAmount{
  [self addProccessingScreenWithText:@"Please wait.."];
  RequestUtility *utility = [RequestUtility sharedRequestUtility];
  NSString *url = kUpdate;
  NSMutableDictionary *params = [[NSMutableDictionary alloc]init];
  [params setValue:user_name forKey:@"login_id"];
  [params setValue:self.addAmountTxtfld.text forKey:@"amount"];
  [utility doPostRequestfor:url withParameters:params onComplete:^(bool status, NSDictionary *responseDictionary){
    if (status && [responseDictionary objectForKey:@"error"] == nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        NSLog(@"response:%@",responseDictionary);
        [self parsedoAddAmountResponse:responseDictionary];
      });
    }else{
      dispatch_async(dispatch_get_main_queue(), ^{
        [self hideProcessingScreen];
        [self showErrorWithMessage:[responseDictionary valueForKey:@"error"] ];
      });
    }
  }];
}


-(void)parsedoAddAmountResponse:(NSDictionary*)ResponseDictionary{
  
  user_id = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"user_id"]];
  user_name = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"user_name"]];
  balance = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"balance"]];
  wallet_id = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"wallet_id"]];
  if (user_name.length>0) {
    self.welcomeLbl.text = [NSString stringWithFormat:@"Welcome %@",user_name];
    self.walletBalanceLbl.text = [NSString stringWithFormat:@"Your Wallet balance is : %@",balance];
    self.addAmountTxtfld.text = @"";
    
  }else{
    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"" message:[ResponseDictionary valueForKey:@"message"] delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
    [alert show];
  }
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickDone:(UITextField *)textField
{
  NSLog(@"%@", textField.text);
  [textField resignFirstResponder] ;
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickCancel:(UITextField *)textField
{
  NSLog(@"Canceled: %@", [textField description]);
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
