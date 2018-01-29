//
//  Utility.m
//  com.uniken.poc.pocwallet
//
//  Created by Swapnil on 12/15/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "Utility.h"

@implementation Utility
+(NSString*)removeSpaceLeadingAndTrailingFromString:(NSString*)str{
  return [str stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
}

@end
