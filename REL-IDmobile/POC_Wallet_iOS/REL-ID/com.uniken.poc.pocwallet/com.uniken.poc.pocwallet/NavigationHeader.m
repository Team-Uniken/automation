//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "NavigationHeader.h"

@implementation NavigationHeader

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
  float width;
    width = [self screenSize].width;
    CGRect footerFrame = self.frame;
    footerFrame.origin.x = 0;
    footerFrame.origin.y = 20;
    footerFrame.size.width = width;
    footerFrame.size.height = 40;
    self.frame = footerFrame;
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

- (void)setTitle:(NSString *)title {
  
  if ([title length] > 0) {
    
    self.titleLabel.text = title;
  }
  
  
}
@end
