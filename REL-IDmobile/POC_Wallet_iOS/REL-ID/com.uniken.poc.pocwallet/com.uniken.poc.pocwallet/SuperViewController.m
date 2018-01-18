//
//  SuperViewController.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "SuperViewController.h"
#import "UIView+FormScroll.h"
#import "Constants.h"
#import "RDNAConstants.h"
#import "UIView+Toast.h"
#import "AddAmountViewController.h"
#import "MainViewController.h"
#import "RegisterViewController.h"
#import "LoginViewController.h"

@interface SuperViewController ()<UITextFieldDelegate>{
  UITextField *aTextField;
}

@end

@implementation SuperViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
  [self setupViews];
  [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent
                                              animated:NO];
  UIView *view=[[UIView alloc] initWithFrame:CGRectMake(0, 0,[UIScreen mainScreen].bounds.size.width, 20)];
  view.backgroundColor=[UIColor colorWithRed:63.0/255.0 green:81.0/255.0 blue:181.0/255.0 alpha:1.0];
  [self.view addSubview:view];
  
  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissKeyboard)];
  
  [self.view addGestureRecognizer:tap];
  
  self.appDelegate= (AppDelegate*) [UIApplication sharedApplication].delegate;
  // Do any additional setup after loading the view.
}

-(void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(sessionTimeout:)
                                               name:kNotificationSessionTimeout                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(success:)
                                               name:kNotificationAllChallengeSuccess
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(actionProcessingScreen:)
                                               name:kNotificationProcessingScreen
                                             object:nil];
}

-(void)viewWillDisappear:(BOOL)animated {
  
  [super viewWillDisappear:animated];
  
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:kNotificationSessionTimeout
                                                object:nil];
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:kNotificationAllChallengeSuccess
                                                object:nil];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}


-(void)actionProcessingScreen:(NSNotification *)notification{
  dispatch_async(dispatch_get_main_queue(), ^{
    
    if([notification.object boolValue]==YES){
      [self addProccessingScreenWithText:@"Please wait..."];
    }else{
      [self hideProcessingScreen];
    }
  });
}

-(void)setupViews{
  
  NSArray *nibObjects = [[NSBundle mainBundle] loadNibNamed:@"NavigationHeader" owner:self options:nil];
  
  for (UIView *view in nibObjects) {
    
    if ([view isKindOfClass:[NavigationHeader class]]) {
      
      self.navigationheader = (NavigationHeader *)view;
      
      [self.view addSubview:self.navigationheader];
    }
  }
  
  NSArray *nibObjects1 = [[NSBundle mainBundle] loadNibNamed:@"ProcessingScreen" owner:self options:nil];
  
  for (UIView *view in nibObjects1) {
    
    if ([view isKindOfClass:[ProcessingScreen class]]) {
      
      self.processingScreen = (ProcessingScreen *)view;
      
      [self.view addSubview:self.processingScreen];
    }
  }
  [self hideProcessingScreen];
}

-(void)addProccessingScreenWithText:(NSString*)text {
  self.processingScreen.hidden = NO;
  self.processingScreen.activityIndicator.hidden = NO;
  [self.processingScreen.activityIndicator startAnimating];
  if (text) {
    [self.view addSubview:self.processingScreen];
    [self.processingScreen.processingStatus setText:text];
    [self.view bringSubviewToFront:self.processingScreen];
  }else{
    self.processingScreen.processingStatus.hidden = YES;
    self.processingScreen.activityIndicator.hidden = YES;
  }
  
}

-(void)hideProcessingScreen {
  [self.processingScreen removeFromSuperview];
  [self.processingScreen.activityIndicator stopAnimating];
  self.processingScreen.hidden = YES;
  
}

-(void)dismissKeyboard {
  [aTextField resignFirstResponder];
}

#pragma -mark Back Button Action
- (IBAction)navigationHeaderBackButtonClick:(id)sender {
  [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - Success Callback
-(void)success:(NSNotification *)notification {
  
  AddAmountViewController *viewController = (AddAmountViewController*)[[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"AddAmountViewControllerID"];
  
  TwoFactorState *objTwoFactorState= [TwoFactorState sharedTwoFactorState];
  viewController.user_id = objTwoFactorState.userID;
  viewController.user_name = objTwoFactorState.userName;
  viewController.balance = objTwoFactorState.balance;
  [self.navigationController pushViewController:viewController animated:YES];
  
}
# pragma mark - Session timeout notication handled

-(void)sessionTimeout:(NSNotification *)notification{
  
  if(self.navigationController) {
    [self.navigationController.view makeToast:notification.object
                                     duration:3.0
                                     position:CSToastPositionCenter];
    
    [self.navigationController popToRootViewControllerAnimated:NO];
    UINavigationController *navVC = (UINavigationController*)self.appDelegate.window.rootViewController;
    [navVC.topViewController viewDidLoad];
    
    
  }
}

#pragma mark - textField delegate methods
- (void)textFieldDidBeginEditing:(UITextField *)textField {
  
  [self.view scrollToView:textField];
  aTextField = textField;
}

-(void) textFieldDidEndEditing:(UITextField *)textField {
  
  [self.view scrollToY:0];
  [textField resignFirstResponder];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
  
  [self.view scrollToY:0];
  [textField resignFirstResponder];
  return YES;
}



#pragma mark AlertView Show
+ (void)showErrorWithMessage:(NSString *)msg withErrorCode:(int)errorCode andCompletionHandler:(void (^)(BOOL result))completionHandler{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    UIAlertController *alertController = [UIAlertController
                                          alertControllerWithTitle:kAlertMessageTitle
                                          message:errorCode == 0 ?  msg : [NSString stringWithFormat:@"%@ \n Error code: %d",kMsgInternalError, errorCode]
                                          preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okAction = [UIAlertAction
                               actionWithTitle:NSLocalizedString(kBnameOK, @"OK action")
                               style:UIAlertActionStyleDefault
                               handler:^(UIAlertAction *action)
                               {
                                 completionHandler(YES);
                               }];
    
    [alertController addAction:okAction];
    AppDelegate *appDel= (AppDelegate*) [UIApplication sharedApplication].delegate;
    [appDel.window.rootViewController presentViewController:alertController animated:YES completion:nil];
    
  });
  
}

- (void)showErrorWithMessage:(NSString *)msg{
  UIAlertController *alertController = [UIAlertController
                                        alertControllerWithTitle:kAlertMessageTitle
                                        message:msg
                                        preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *okAction = [UIAlertAction
                             actionWithTitle:NSLocalizedString(kBnameOK, @"OK action")
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction *action)
                             {
                               
                             }];
  
  [alertController addAction:okAction];
  AppDelegate *appDel= (AppDelegate*) [UIApplication sharedApplication].delegate;
  [appDel.window.rootViewController presentViewController:alertController animated:YES completion:nil];
}


#pragma -mark Respose code and Error code handle methods
+(void)handleErrorCode:(RDNAErrorID)erroCode{
  AppDelegate *appDel= (AppDelegate*) [UIApplication sharedApplication].delegate;
  UINavigationController *navVC = (UINavigationController*)appDel.window.rootViewController;
  NSArray *arrVC = navVC.viewControllers;
  
  if(erroCode == RDNA_ERR_INVALID_USER_MR_STATE){
    for (UIViewController *vc in arrVC) {
      if([vc isKindOfClass:[LoginViewController class]]){
        [navVC popToViewController:vc animated:NO];
        RegisterViewController *viewController = (RegisterViewController*)[[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"RegisterViewControllerID"];
        [navVC pushViewController:viewController animated:YES];
        break;
      }
    }
  }else{
    for (UIViewController *vc in arrVC) {
      if([vc isKindOfClass:[LoginViewController class]]){
        [navVC popToViewController:vc animated:NO];
        break;
      }
    }
  }
  
  
  
}
+(void)handleStatus:(RDNAResponseStatusCode)erroCode{
  AppDelegate *appDel= (AppDelegate*) [UIApplication sharedApplication].delegate;
  UINavigationController *navVC = (UINavigationController*)appDel.window.rootViewController;
  NSArray *arrVC = navVC.viewControllers;
  
  
  if(erroCode == RDNA_RESP_STATUS_USER_SUSPENDED || erroCode == RDNA_RESP_STATUS_NO_USER_ID || erroCode ==RDNA_RESP_STATUS_USER_DEVICE_NOT_REGISTERED){
    for (UIViewController *vc in arrVC) {
      if([vc isKindOfClass:[LoginViewController class]]){
        [navVC popToViewController:vc animated:NO];
        RegisterViewController *viewController = (RegisterViewController*)[[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"RegisterViewControllerID"];
        [navVC pushViewController:viewController animated:YES];
        break;
      }
    }
  }else{
    for (UIViewController *vc in arrVC) {
      if([vc isKindOfClass:[LoginViewController class]]){
        [navVC popToViewController:vc animated:NO];
        break;
      }
    }
  }
}




@end
