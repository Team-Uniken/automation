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
  // Do any additional setup after loading the view.
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

-(void)addProccessingScreenWithText:(NSString*)text{
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


-(void)hideProcessingScreen{
  [self.processingScreen removeFromSuperview];
  [self.processingScreen.activityIndicator stopAnimating];
  self.processingScreen.hidden = YES;
  
}
- (IBAction)navigationHeaderBackButtonClick:(id)sender {
  
  [self.navigationController popViewControllerAnimated:YES];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)dismissKeyboard
{
  [aTextField resignFirstResponder];
}

#pragma mark - textField delegate methods
- (void)textFieldDidBeginEditing:(UITextField *)textField{
  
  [self.view scrollToView:textField];
  aTextField = textField;
}

-(void) textFieldDidEndEditing:(UITextField *)textField{
  
  [self.view scrollToY:0];
  [textField resignFirstResponder];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField{
  
  [self.view scrollToY:0];
  [textField resignFirstResponder];
  return YES;
}



#pragma mark AlertView Show

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



@end
