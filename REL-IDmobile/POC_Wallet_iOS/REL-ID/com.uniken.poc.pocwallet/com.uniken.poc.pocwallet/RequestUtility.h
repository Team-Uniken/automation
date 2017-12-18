//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface RequestUtility : NSObject <NSURLSessionDelegate,NSURLSessionDataDelegate,NSURLSessionTaskDelegate>

typedef void(^myCompletion)(bool status, NSDictionary  *response);
extern NSString *const kBaseUrl;
extern NSString *const kAddAmount;
extern NSString *const kRegister;
extern NSString *const kUpdate;
extern NSString *const kLogin;

@property (nonatomic, copy, readwrite) myCompletion block;
@property (nonatomic, assign) BOOL isProxy;
+ (RequestUtility *)sharedRequestUtility;
-(void)doPostRequestfor:(NSString*)url withParameters:(NSDictionary*)params onComplete:(void (^)(bool status, NSDictionary  *response))completionBlock;

-(void)doPostRequestfromRelID:(NSString*)url withParameters:(NSDictionary*)params onComplete:(void (^)(bool status, NSDictionary  *response))completionBlock;
@end
