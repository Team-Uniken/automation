//
//  MainViewController.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "MainViewController.h"
#import "RequestUtility.h"
#import "RDNAConstants.h"
@interface MainViewController ()

@end

@implementation MainViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.txtLabel.text = kDummyText;
  self.navigationheader.titleLabel.text = @"POC Wallet";
  self.navigationheader.navigationLeftButton.hidden = YES;
  // Do any additional setup after loading the view.
  if([RequestUtility isNetworkAvailable]){
    AppDelegate *delegate = (AppDelegate*)[UIApplication sharedApplication].delegate;
    int error = [delegate.rdnaclient initializeRDNAWithCallbackDelegate:self] ;
    
    if(error > 0){
      [self showErrorWithMessage:[NSString stringWithFormat:@"REL-ID init failed : %d",error]];
    }else{
      [self addProccessingScreenWithText:@"REL-ID initializing..."];
    }
  }else{
    [SuperViewController showErrorWithMessage:[NSString stringWithFormat:@"%@, exit and log in again",kMsgNetworkError] withErrorCode:0 andCompletionHandler:^(BOOL result) {
      exit(0);
    }];
  }
}


- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}
- (IBAction)registerButtonClick:(id)sender {
}
- (IBAction)loginButtonClick:(id)sender {
}


#pragma -mark REL-ID callback

-(void)initialize:(int)errorCode{
  [self hideProcessingScreen];
  if(errorCode>0)
    [self showErrorWithMessage:[NSString stringWithFormat:@"REL-ID init failed : %d",errorCode]];
  else
    NSLog(@"Initiliaze success");
  
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
