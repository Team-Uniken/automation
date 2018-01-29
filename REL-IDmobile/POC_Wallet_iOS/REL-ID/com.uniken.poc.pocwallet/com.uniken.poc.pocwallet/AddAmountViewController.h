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
@property (strong, nonatomic) NSString *user_id;
@property (strong, nonatomic) NSString *user_name;
@property (strong, nonatomic) NSString *balance;


@end
