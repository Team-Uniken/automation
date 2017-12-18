//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface RequestUtility : NSObject <NSURLSessionDelegate,NSURLSessionDataDelegate,NSURLSessionTaskDelegate>

extern NSString *const kBaseUrl;
extern NSString *const kAddAmount;
extern NSString *const kRegister;
extern NSString *const kUpdate;
extern NSString *const kLogin;
extern NSString *const kDummyText;

+ (RequestUtility *)sharedRequestUtility;
-(void)doPostRequestfor:(NSString*)url withParameters:(NSDictionary*)params onComplete:(void (^)(bool status, NSDictionary  *response))completionBlock;
@end
