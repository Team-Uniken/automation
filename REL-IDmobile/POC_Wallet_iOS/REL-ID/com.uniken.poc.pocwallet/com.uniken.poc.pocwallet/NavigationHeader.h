//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface NavigationHeader : UIView
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIButton *navigationLeftButton;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *navigationButtonWidthConstraint;

@property (weak, nonatomic) IBOutlet UIButton *rightEditBtn;
@end
