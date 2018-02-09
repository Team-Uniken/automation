//
//  LoginViewController.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CustomView.h"
#import "SuperViewController.h"
@interface LoginViewController : SuperViewController
@property (weak, nonatomic) IBOutlet UICustomTextfield *loginIdTxtFld;
@property (weak, nonatomic) IBOutlet UICustomTextfield *MPinTxtFld;
@property (weak, nonatomic) IBOutlet UILabel *txtLabel;
@end
