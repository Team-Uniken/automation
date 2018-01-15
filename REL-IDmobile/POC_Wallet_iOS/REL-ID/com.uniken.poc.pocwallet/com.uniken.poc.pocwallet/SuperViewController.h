//
//  SuperViewController.h
//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "NavigationHeader.h"
#import "ProcessingScreen.h"
#import "AppDelegate.h"
#import "TwoFactorState.h"

@interface SuperViewController : UIViewController
@property (nonatomic, strong) NavigationHeader *navigationheader;
@property (nonatomic, strong) ProcessingScreen *processingScreen;
-(void)addProccessingScreenWithText:(NSString*)text;
-(void)hideProcessingScreen;
+ (void)showErrorWithMessage:(NSString *)msg withErrorCode:(int)errorCode andCompletionHandler:(void (^)(BOOL result))completionHandler;
- (void)showErrorWithMessage:(NSString *)msg;
-(void)success:(NSNotification *)notification;

+(void)handleErrorCode:(RDNAErrorID)erroCode;
+(void)handleStatus:(RDNAResponseStatusCode)erroCode;

@end
