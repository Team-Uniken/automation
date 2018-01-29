//
//  RDNAConstants.m
//  API_SDK_SAMPLE_V1
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//

#import "RDNAConstants.h"

@implementation RDNAConstants

NSString *const kRdnaCipherSpecs = @"AES/256/CFB/PKCS7Padding";
NSString *const kRdnaCipherSalt = @"Rel-ID-Secure-IV";

// NSString *const kRdnaAgentID = @"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";

NSString *const kRdnaAgentID = @"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";
NSString *const kRdnaHost = @"10.0.5.23";
//NSString *const kRdnaHost = @"poc5-uniken.com";
uint16_t const kRdnaPort = 4443;

NSString *const kRdnaProxyHost = @"127.0.0.1";


NSString *const kUserNameKey = @"username";
NSString *const kPasswordKey = @"password";
NSString *const kDeviceBindingKey = @"devbind";
NSString *const kDeviceNameKey = @"devname";

NSString *const kCheckUser = @"checkuser";
NSString *const kActivateUser = @"actcode";
NSString *const kSecretQuestionAndAnswer = @"secqa";
NSString *const kSecondarySecretQuestionAndAnswer = @"secondarySecqa";

NSString *const kPassword = @"pass";
NSString *const kDeviceBinding = @"devbind";
NSString *const kDeviceName = @"devname";
NSString *const kDashboard = @"dashboard";

NSString *const kNotificationSessionTimeout = @"SessionTimeout";


NSString *const kMsgInternalError = @"Internal system error, please exit and log in again";
NSString *const kNotificationAllChallengeSuccess = @"success";
NSString *const kNotificationProcessingScreen = @"processing_screen";


@end