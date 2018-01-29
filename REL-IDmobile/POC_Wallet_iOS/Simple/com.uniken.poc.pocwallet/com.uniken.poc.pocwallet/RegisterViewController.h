//
//  RegisterViewController.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CustomView.h"
#import "SuperViewController.h"
@interface RegisterViewController : SuperViewController
@property (weak, nonatomic) IBOutlet UICustomTextfield *loginIDTxtFld;
@property (weak, nonatomic) IBOutlet UICustomTextfield *cardNuberTxtFld;
@property (weak, nonatomic) IBOutlet UICustomTextfield *cardPinTxtFld;
@property (weak, nonatomic) IBOutlet UICustomTextfield *mPinTxtFld;
@property (weak, nonatomic) IBOutlet UICustomTextfield *confirmMpinTxtFld;
@property (weak, nonatomic) IBOutlet UILabel *txtLabel;
@end
