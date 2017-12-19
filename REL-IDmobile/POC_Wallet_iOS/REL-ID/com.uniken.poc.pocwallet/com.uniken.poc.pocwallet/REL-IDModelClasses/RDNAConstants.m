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
 NSString *const kRdnaAgentID = @"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";
//NSString *const kRdnaHost = @"34.207.14.201";
NSString *const kRdnaHost = @"poc5-uniken.com";
NSString *const kRdnaProxyHost = @"127.0.0.1";
uint16_t const kRdnaPort = 4443;

NSString *const kUserNameKey = @"username";
NSString *const kPasswordKey = @"password";
NSString *const kDeviceBindingKey = @"devbind";
NSString *const kDeviceNameKey = @"devname";

NSString *const kCheckUser = @"checkuser";
NSString *const kActivateUser = @"actcode";
NSString *const kOTP = @"otp";
NSString *const kSecretQuestionAndAnswer = @"secqa";
NSString *const kSecondarySecretQuestionAndAnswer = @"secondarySecqa";

NSString *const kPassword = @"pass";
NSString *const kDeviceBinding = @"devbind";
NSString *const kDeviceName = @"devname";
NSString *const kDashboard = @"dashboard";

//NSString *const kDashBoardUrl = @"http://10.0.14.229:8080/cp/cp.html";
NSString *const kDashBoardUrl = @"http://apisdkdemo.uniken.com/CP/ios.html";

NSString *const kNotificationSessionTimeout = @"SessionTimeout";


NSString *const kMsgInternalError = @"Internal system error, please exit and log in again";
NSString *const kNotificationAllChallengeSuccess = @"success";
NSString *const kNotificationProcessingScreen = @"processing_screen";


@end
