//
//  CustomView.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "CustomView.h"
#import "Constants.h"
@implementation CustomView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end

@implementation UICustomButton

- (void)awakeFromNib {
  [self setTitleColor:[UIColor colorWithHex:kColorWhite alpha:1] forState:UIControlStateNormal];
  self.backgroundColor = [UIColor colorWithHex:kColorButtonBackground alpha:1];
  self.titleLabel.font = [UIFont fontWithName:kFontTypeRegular size:kFontSizeLarge];
  self.layer.cornerRadius = 8.0;
}

@end

@implementation UICustomTextfield

- (void)awakeFromNib {
  [super awakeFromNib];
  self.delegate = self.delegate;
  [self setupAppearance];
}

- (void)setupAppearance {
  self.autocorrectionType = FALSE;
  self.autocorrectionType = UITextAutocorrectionTypeNo;// or use  UITextAutocorrectionTypeNo
  self.autocapitalizationType = UITextAutocapitalizationTypeNone;
  self.layer.cornerRadius=1.0f;
  self.layer.masksToBounds=YES;
  self.layer.borderColor = [[UIColor darkerColorForTheme:[UIColor colorWithHex:kColorTheme alpha:1]]CGColor];
  self.layer.borderWidth = 1.0f;
}

@end

@implementation UIColor (Colour)

+ (UIColor *)colorWith8BitRed:(NSInteger)red green:(NSInteger)green blue:(NSInteger)blue alpha:(CGFloat)alpha {
  return [UIColor colorWithRed:(red/255.0) green:(green/255.0) blue:(blue/255.0) alpha:alpha];
}

+ (UIColor *)colorWithHex:(NSString *)hex alpha:(CGFloat)alpha {
  
  assert(7 == [hex length]);
  assert('#' == [hex characterAtIndex:0]);
  
  NSString *redHex = [NSString stringWithFormat:@"0x%@", [hex substringWithRange:NSMakeRange(1, 2)]];
  NSString *greenHex = [NSString stringWithFormat:@"0x%@", [hex substringWithRange:NSMakeRange(3, 2)]];
  NSString *blueHex = [NSString stringWithFormat:@"0x%@", [hex substringWithRange:NSMakeRange(5, 2)]];
  
  unsigned redInt = 0;
  NSScanner *rScanner = [NSScanner scannerWithString:redHex];
  [rScanner scanHexInt:&redInt];
  
  unsigned greenInt = 0;
  NSScanner *gScanner = [NSScanner scannerWithString:greenHex];
  [gScanner scanHexInt:&greenInt];
  
  unsigned blueInt = 0;
  NSScanner *bScanner = [NSScanner scannerWithString:blueHex];
  [bScanner scanHexInt:&blueInt];
  
  return [UIColor colorWith8BitRed:redInt green:greenInt blue:blueInt alpha:alpha];
}

+ (UIColor *)lighterColorForTheme:(UIColor *)themeColor
{
  CGFloat red, green, blue, alpha;
  if ([themeColor getRed:&red green:&green blue:&blue alpha:&alpha]) {
    return [UIColor colorWithRed:MIN(red + 0.2, 1.0) green:MIN(green + 0.2, 1.0) blue:MIN(blue + 0.2, 1.0) alpha:alpha];
  }
  return nil;
}

+ (UIColor *)darkerColorForTheme:(UIColor *)themeColor
{
  CGFloat red, green, blue, alpha;
  if ([themeColor getRed:&red green:&green blue:&blue alpha:&alpha]) {
    return [UIColor colorWithRed:MAX(red - 0.2, 0.0) green:MAX(green - 0.2, 0.0) blue:MAX(blue - 0.2, 0.0) alpha:alpha];
  }
  return nil;
}


@end
