//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (FormScroll)

- (void)scrollToY:(float)y;
- (void)scrollToView:(UIView *)view;
- (void)scrollElement:(UIView *)view toPoint:(float)y;

@end
