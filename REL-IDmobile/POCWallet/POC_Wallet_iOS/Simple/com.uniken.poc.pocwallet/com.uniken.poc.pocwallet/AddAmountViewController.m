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
#import "Constants.h"
#import "LoginViewController.h"
#import "MainViewController.h"


@interface AddAmountViewController ()<DoneCancelNumberPadToolbarDelegate>

@end

@implementation AddAmountViewController
@synthesize user_id,user_name,balance;

- (void)viewDidLoad {
    [super viewDidLoad];
  self.txtLabel.text = kDummyText;
  self.navigationheader.titleLabel.text = @"Add Amount";
  self.navigationheader.navigationLeftButton.hidden = NO;
  
  self.welcomeLbl.text = [NSString stringWithFormat:@"Welcome %@",user_name];
  self.walletBalanceLbl.text = [NSString stringWithFormat:@"Your Wallet balance is : %@",balance];
  DoneCancelNumberPadToolbar *numberPadDoneButton = [[DoneCancelNumberPadToolbar alloc] initWithTextField:self.addAmountTxtfld];
  numberPadDoneButton.delegate = self;
  self.addAmountTxtfld.inputAccessoryView = numberPadDoneButton;
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (IBAction)addAmountButtonClick:(id)sender {
  if([self doValidate])
  [self doAddAmount];
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
  [params setValue:[Utility  removeSpaceLeadingAndTrailingFromString:self.addAmountTxtfld.text] forKey:@"amount"];
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
  
  user_id = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"id"]];
  user_name = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"login_id"]];
  balance = [NSString stringWithFormat:@"%@",[ResponseDictionary valueForKey:@"balance"]];
  if (user_name.length>0) {
    self.welcomeLbl.text = [NSString stringWithFormat:@"Welcome %@",user_name];
    self.walletBalanceLbl.text = [NSString stringWithFormat:@"Your Wallet balance is : %@",balance];
    self.addAmountTxtfld.text = @"";
  }else{
    [self showErrorWithMessage:[ResponseDictionary valueForKey:@"message"]];
  }
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickDone:(UITextField *)textField {
 [textField resignFirstResponder] ;
}

-(void)doneCancelNumberPadToolbarDelegate:(DoneCancelNumberPadToolbar *)controller didClickCancel:(UITextField *)textField {
  [textField resignFirstResponder] ;
}

#pragma -mark Back Button Action
- (IBAction)navigationHeaderBackButtonClick:(id)sender {
  
  UIAlertController *alert = [UIAlertController alertControllerWithTitle:kAlertMessageTitle message:@"Are you sure you want logoff ?" preferredStyle:UIAlertControllerStyleAlert];
  
  UIAlertAction *ok = [UIAlertAction actionWithTitle:@"Yes" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action)
                       {
                         NSArray *arrVC= self.navigationController.viewControllers;
                         UINavigationController *navVC = (UINavigationController*)self.appDelegate.window.rootViewController;
                         LoginViewController *loginVC;
                         MainViewController *mainVC;
                         
                         for (UIViewController *vc in arrVC) {
                           if([vc isKindOfClass:[LoginViewController class]]){
                             loginVC = (LoginViewController*)vc;
                           }else if([vc isKindOfClass:[MainViewController class]]){
                             mainVC = (MainViewController*)vc;
                           }
                         }
                         if(loginVC){
                           [navVC popToViewController:loginVC animated:YES];
                         }else{
                           [navVC popToViewController:mainVC animated:NO];
                           LoginViewController *viewController = (LoginViewController*)[[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"LoginViewControllerID"];
                           [navVC pushViewController:viewController animated:NO];
                         }
         
                       
                       }];
  UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"No" style:UIAlertActionStyleCancel handler:nil];
  [alert addAction:cancel];
  [alert addAction:ok];
  [self presentViewController:alert animated:YES completion:nil];
  
  
 
  
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
