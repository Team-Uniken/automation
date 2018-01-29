//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "ProcessingScreen.h"

@implementation ProcessingScreen

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setupView];
    
  }
  return self;
}

- (instancetype)init {
  
  self = [super init];
  
  if (self) {
    
    [self setupView];
  }
  return self;
}

- (void)awakeFromNib {
  
  [super awakeFromNib];
  [self setupView];
  
}

- (void)setupView {
  if ( UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone ){
    CGSize screenSize = [UIScreen mainScreen].bounds.size;
    [self setFrame:CGRectMake(0, 0, screenSize.width, screenSize.height)];
    self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.4];
  }else{
    CGSize screenSize = [UIScreen mainScreen].bounds.size;
     [self setFrame:CGRectMake(0, 0, screenSize.width, screenSize.height)];
    self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.4];
  }
}

- (CGSize)screenSize
{
  CGSize screenSize = [UIScreen mainScreen].bounds.size;
  if ((NSFoundationVersionNumber <= NSFoundationVersionNumber_iOS_7_1) && UIInterfaceOrientationIsLandscape([UIApplication sharedApplication].statusBarOrientation)) {
    return CGSizeMake(screenSize.height, screenSize.width);
  } else {
    return screenSize;
  }
}

@end
