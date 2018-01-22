//
//  AddAmountViewController.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SuperViewController.h"
#import "CustomView.h"
@interface AddAmountViewController : SuperViewController
@property (weak, nonatomic) IBOutlet UICustomTextfield *addAmountTxtfld;
@property (weak, nonatomic) IBOutlet UILabel *welcomeLbl;
@property (weak, nonatomic) IBOutlet UILabel *walletBalanceLbl;
@property (weak, nonatomic) IBOutlet UILabel *txtLabel;

@property (weak, nonatomic) NSString *user_id;
@property (weak, nonatomic) NSString *user_name;
@property (weak, nonatomic) NSString *balance;
@property (weak, nonatomic) NSString *wallet_id;

@end
