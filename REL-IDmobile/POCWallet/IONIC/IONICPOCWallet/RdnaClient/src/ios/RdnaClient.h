//
//  RdnaClient.h
//  CordovaRefApp
//
//  Created by Swapnil on 11/15/16.
//
//

#import <Cordova/CDV.h>
@interface RdnaClient : CDVPlugin

- (void)initialize:(CDVInvokedUrlCommand*)command;
-(void)setCredentials:(CDVInvokedUrlCommand*)command;
-(void)updateDeviceDetails:(CDVInvokedUrlCommand*)command;

-(void)getRegisteredDeviceDetails:(CDVInvokedUrlCommand*)command;

-(void)getPostLoginChallenges:(CDVInvokedUrlCommand*)command;
- (void)setApplicationName:(CDVInvokedUrlCommand*)command;
- (void)setApplicationVersion:(CDVInvokedUrlCommand*)command;
- (void)setApplicationFingerprint:(CDVInvokedUrlCommand*)command;
- (void)setDeviceToken:(CDVInvokedUrlCommand*)command;
-(void)updateNotifications:(CDVInvokedUrlCommand*)command;
-(void)getNotifications:(CDVInvokedUrlCommand*)command;
-(void)getAllChallenges:(CDVInvokedUrlCommand*)command;
-(void)checkChallenges:(CDVInvokedUrlCommand*)command;
-(void)updateChallenges:(CDVInvokedUrlCommand*)command;
-(void)logOff:(CDVInvokedUrlCommand*)command;
-(void)terminate:(CDVInvokedUrlCommand*)command;
-(void)pauseRuntime:(CDVInvokedUrlCommand*)command;
-(void)resumeRuntime:(CDVInvokedUrlCommand*)command;
-(void)getDefaultCipherSalt:(CDVInvokedUrlCommand*)command;
-(void)getDefaultCipherSpec:(CDVInvokedUrlCommand*)command;
-(void)encryptDataPacket:(CDVInvokedUrlCommand*)command;
-(void)encryptHttpRequest:(CDVInvokedUrlCommand*)command;
-(void)decryptDataPacket:(CDVInvokedUrlCommand*)command;
-(void)decryptHttpResponse:(CDVInvokedUrlCommand*)command;
-(void)getConfig:(CDVInvokedUrlCommand*)command;
-(void)forgotPassword:(CDVInvokedUrlCommand*)command;
-(void)getSDKVersion:(CDVInvokedUrlCommand*)command;
-(void)getErrorInfo:(CDVInvokedUrlCommand*)command;
-(void)resetChallenge:(CDVInvokedUrlCommand*)command;
-(void)getServiceByServiceName:(CDVInvokedUrlCommand*)command;
-(void)getServiceByTargetCoordinate:(CDVInvokedUrlCommand*)command;
-(void)serviceAccessStart:(CDVInvokedUrlCommand*)command;
-(void)serviceAccessStop:(CDVInvokedUrlCommand*)command;
-(void)serviceAccessStartAll:(CDVInvokedUrlCommand*)command;
-(void)serviceAccessStopAll:(CDVInvokedUrlCommand*)command;
-(void)getAllServices:(CDVInvokedUrlCommand*)command;

@end
