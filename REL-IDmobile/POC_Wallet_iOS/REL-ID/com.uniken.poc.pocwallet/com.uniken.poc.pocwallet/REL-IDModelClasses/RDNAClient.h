//
//  RDNAClient.h
//  API_SDK_SAMPLE_V1
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//

/**
 * @brief This Class contians the implementation of RDNA.
 */

#import <Foundation/Foundation.h>
#import "RDNA.h"


@protocol RDNAClientCallbacks

@required
- (void)terminate:(int)errorCode;
-(void)initialize:(int)errorCode;
-(void)openHttpResponse:(RDNAHTTPStatus*)response;
@end


@interface RDNAClient : NSObject <RDNACallbacks>

@property (assign) int proxyPort;
/**
 * @brief This method initilizes the RDNA with the provided host, port, cipher specs, cipher salt, proxy settings, DNS server list, SSL certificate details,SDK log level, app context.
 * It also returns an RDNA object which needs to be used futher when we want to invoke any api of the rdna client.
 */
- (int)initializeRDNAWithCallbackDelegate:(id<RDNAClientCallbacks>)callback;


/**
 * @brief This method is used to pause the rdna client execution.
 * In return it provides an context object which should be saved in the client and used when user wants to resume the
 * rdna client execution.
 * The resume API should be used in cases when user moves the app from foreground to background.
 */
- (int)pauseRDNA;


/**
 * @brief This method is used to resume the rdna client execution.
 * The savd context that is obtained in the pause API should be passed in the resume API
 */
- (int)resumeRDNA;


/**
 * @brief This method is used to terminate the rdna client execution.
 */
- (int)terminateRDNAWithCallbackDelegate:(id<RDNAClientCallbacks>)_terminateCallback;


/**
 * @brief This method is invoked when application is moved into background.
 */
- (void)EnterForeground;


/**
 * @brief This method is invoked when application is moved into background.
 */
- (void)EnterBackground;

/**
 * @brief This method checks for any pending challenges and then invokes the CheckChallenges api of the RDNA for the
 * given userID. Challenges response is obtained in the callBack i.e onChallengeRecieved function.
 */
- (void)RDNAClientCheckChallenges:(NSArray *)challengeArray forUserID:(NSString *)userID;

/**
 * @brief This method is used for get current session id on server
 */
-(NSString*)RDNAGetSessionID;


-(int)RDNAClientOpenHttpConnection:(RDNAHTTPRequest*)req withCallback:(id<RDNAClientCallbacks>)callback;




@end
