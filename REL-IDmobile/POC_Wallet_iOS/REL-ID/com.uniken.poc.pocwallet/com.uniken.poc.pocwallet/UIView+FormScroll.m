//
//  CustomView.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "UIView+FormScroll.h"


@implementation UIView (FormScroll)


-(void)scrollToY:(float)y{
  
  [UIView beginAnimations:@"registerScroll" context:NULL];
  [UIView setAnimationCurve:UIViewAnimationCurveEaseInOut];
  [UIView setAnimationDuration:0.4];
  self.transform = CGAffineTransformMakeTranslation(0, y);
  [UIView commitAnimations];
  
}

-(void)scrollToView:(UIView *)view{
  
  float y = [self CheckHeight:view];
  [self scrollToY:-y];
}

-(CGFloat)CheckHeight:(UIView*)textField{
  
  CGFloat returnType = 0;
  //CGFloat deviceCenter;
  CGSize screenSize = [UIScreen mainScreen].bounds.size;
  if ( UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone ){
  //  deviceCenter = screenSize.height/2;
  }else{
   // deviceCenter = screenSize.width/2;
  }
  UIView *view = textField.superview;
  CGFloat textfieldPosition = textField.frame.origin.y+textField.frame.size.height;
  if (view.frame.size.height!=screenSize.height) {
    
    textfieldPosition = view.frame.origin.y+textField.frame.origin.y;
    
  }
  if (textfieldPosition > screenSize.height-256) {
    
    returnType =  textfieldPosition-(screenSize.height-216)+65;
    
  }else{
    
    returnType = 0;
    
  }
  return returnType;
}

-(void)scrollElement:(UIView *)view toPoint:(float)y{
  
  CGRect theFrame = view.frame;
  float orig_y = theFrame.origin.y;
  float diff = y - orig_y;
  if (diff < 0) {
    [self scrollToY:diff];
  }
  else {
    [self scrollToY:0];
  }
}


@end
