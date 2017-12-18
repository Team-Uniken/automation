//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CustomView : UIView

@end

@interface UICustomButton : UIButton

@end

@interface UIColor (Colour)

+ (UIColor *)colorWith8BitRed:(NSInteger)red green:(NSInteger)green blue:(NSInteger)blue alpha:(CGFloat)alpha;

+ (UIColor *)colorWithHex:(NSString *)hex alpha:(CGFloat)alpha;

+ (UIColor *)lighterColorForTheme:(UIColor *)themeColor;

+ (UIColor *)darkerColorForTheme:(UIColor *)themeColor;

@end

@interface UICustomTextfield : UITextField

@end
