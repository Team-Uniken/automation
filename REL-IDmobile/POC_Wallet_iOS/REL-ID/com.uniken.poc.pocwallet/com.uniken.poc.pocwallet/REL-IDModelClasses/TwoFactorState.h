//
//  TwoFactorState.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/18/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RDNA.h"
@interface TwoFactorState : NSObject
+ (TwoFactorState *)sharedTwoFactorState;
@property (nonatomic,strong) RDNA *rdna;
@property (nonatomic,strong) NSString *actCode;
@property (nonatomic,strong) NSString *userName;
@property (nonatomic,strong) NSString *walletID;
@property (nonatomic,strong) NSString *balance;
@property (nonatomic,strong) NSString *userID;
@property (nonatomic,strong) NSString *cardPin;
@property (nonatomic,strong) NSArray *rdnaChallenges;
-(int)startTwoFactorFlowWithChallenge:(NSArray*)RdnaChallenges;
@end
