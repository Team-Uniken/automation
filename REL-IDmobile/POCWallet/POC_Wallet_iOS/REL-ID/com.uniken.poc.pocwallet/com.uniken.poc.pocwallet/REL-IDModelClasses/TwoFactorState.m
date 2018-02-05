//
//  TwoFactorState.m
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/18/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import "TwoFactorState.h"
#import "RequestUtility.h"
#import "RDNAConstants.h"
#import "AppDelegate.h"



@interface TwoFactorState(){
  
}

@end

@implementation TwoFactorState

@synthesize mPin,userName,actCode,rdnaChallenges;

+ (TwoFactorState *)sharedTwoFactorState {
  __strong static TwoFactorState *sharedTwoFactorState = nil;
  static dispatch_once_t onceToken1;
  dispatch_once(&onceToken1, ^{
    sharedTwoFactorState = [[self alloc] init];
  });
  return sharedTwoFactorState;
}


-(int)startTwoFactorFlowWithChallenge:(NSArray*)RdnaChallenges{
  
  for (int i =0; i<RdnaChallenges.count; i++) {
    RDNAChallenge *challenge = [RdnaChallenges objectAtIndex:i];
    
    if ([challenge.name isEqualToString:kCheckUser]) {
      [self setResponseForChallenge:challenge andKey:@"" andValue:userName];
    }
    else if ([challenge.name isEqualToString:kActivateUser]) {
      [self setResponseForChallenge:challenge andKey:@"" andValue:self.actCode];
    }
    else if ([challenge.name isEqualToString:kSecretQuestionAndAnswer]) {
      [self setResponseForChallenge:challenge andKey:@"sampleQuestion" andValue:@"sampleAnswer"];
    }
    else if ([challenge.name isEqualToString:kPassword]) {
      [self setResponseForChallenge:challenge andKey:@"" andValue:self.mPin];
    }
    else if ([challenge.name isEqualToString:kDeviceBinding]) {
      [self setResponseForChallenge:challenge andKey:@"" andValue:@"true"];
    }
    else if ([challenge.name isEqualToString:kDeviceName]) {
      [self setResponseForChallenge:challenge andKey:@"" andValue:[[UIDevice currentDevice] name]];
    }else{
      NSLog(@"%@",[NSString stringWithFormat:@"not intrested in TBA challenge : %@",challenge.name]);
    }
  }
  
  if([RequestUtility isNetworkAvailable]){
  AppDelegate *appDel = (AppDelegate*) [UIApplication sharedApplication].delegate;
  [appDel.rdnaclient RDNAClientCheckChallenges:RdnaChallenges forUserID:userName];
  }else{
    [[NSNotificationCenter defaultCenter] postNotificationName:kNotificationNetworkError
                                                        object:nil];
  }
  return 0;
}


-(int)setResponseForChallenge:(RDNAChallenge*)Challenge andKey:(NSString*)Key andValue:(NSString*)value{
  if (Key.length>0) {
    Challenge.responseValue = value;
    Challenge.responseKey = Key;
  }else{
    Challenge.responseValue = value;
  }
  return 0;
}



@end
