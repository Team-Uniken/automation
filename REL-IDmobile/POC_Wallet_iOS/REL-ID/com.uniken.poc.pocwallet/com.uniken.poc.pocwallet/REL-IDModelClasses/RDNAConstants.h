//
//  RDNAConstants.h
//  API_SDK_SAMPLE_V1
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RDNAConstants : NSObject

/** RDNAClient parameters Constants ***/
extern NSString *const kRdnaCipherSpecs;
extern NSString *const kRdnaCipherSalt;
extern NSString *const kRdnaAgentID;
extern NSString *const kRdnaHost;
extern uint16_t const kRdnaPort;
extern NSString *const kRdnaProxyHost;


/** constants of response object keys ***/
extern NSString *const kUserNameKey;
extern NSString *const kPasswordKey;
extern NSString *const kDeviceBindingKey;
extern NSString *const kDeviceNameKey;

/** constants challenges names ***/
extern NSString *const kCheckUser;
extern NSString *const kActivateUser;
extern NSString *const kSecretQuestionAndAnswer;
extern NSString *const kPassword;
extern NSString *const kDeviceBinding;
extern NSString *const kDashboard;
extern NSString *const kOTP;
extern NSString *const kSecretQuestionAndAnswer;
extern NSString *const kSecondarySecretQuestionAndAnswer;
extern NSString *const kDeviceName;

/** constants dashboard url ***/
extern NSString *const kDashBoardUrl;


extern NSString *const kNotificationSessionTimeout;

extern NSString *const kMsgInternalError;

extern NSString *const kNotificationAllChallengeSuccess;
extern NSString *const kNotificationProcessingScreen;

@end
