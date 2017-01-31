//
//  ReactRdnaModule.m
//  ReactReferenceApp1
//
//  Created by Sudarshan on 3/29/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ReactRdnaModule.h"
#import <CoreLocation/CoreLocation.h>
#import <RCTLog.h>
#import "RCTBridge.h"
#import <RCTConvert.h>
#import "RCTEventDispatcher.h"
#import "AppDelegate.h"

RDNA *rdnaObject;
id<RDNACallbacks> rdnaClientCallbacks;
RDNAPrivacyStream *privacyStreamObject;
RCTBridge *_Nullable localbridgeDispatcher;
dispatch_semaphore_t semaphore;
RDNAIWACreds *rdnaIWACredsObj;
@interface ReactRdnaModule()<RDNAPrivacyStreamCallBacks,CLLocationManagerDelegate>{
 
  id <RDNAPrivacyStreamCallBacks> privacyStreamCallBack;
  CLLocationManager *locationManagerObject;
  BOOL isRDNAIntilized;
  NSMutableDictionary *jsonDictionary;
  int i;
  
  
}
@end

@implementation ReactRdnaModule

@synthesize  bridge = _bridge;


RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onInitializeCompleted",@"onPauseCompleted",@"onResumeCompleted",@"onConfigRecieved",@"onCheckChallengeResponseStatus",@"onGetAllChallengeStatus",@"onUpdateChallengeStatus",@"onForgotPasswordStatus",@"onLogOff",@"onGetpassword",@"onGetCredentials",@"onGetPostLoginChallenges",@"onGetRegistredDeviceDetails",@"onUpdateDeviceDetails",@"onUpdateDeviceStatus",@"onGetNotifications",@"onUpdateNotification"];
}

-(void)initParams{
  rdnaClientCallbacks = [[ReactRdnaModule alloc]init];
}

#pragma mark ReactExportMethods

RCT_EXPORT_METHOD (initialize:(NSString *)agentInfo
                   GatewayHost:(NSString *)authGatewayHNIP
                   GatewayPort:(NSString*)authGatewayPORT
                   
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   ProxySettings:(NSString *)proxySettings
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  
  int errorID = 0;
  RDNA *rdna;
  localbridgeDispatcher = _bridge;
  [self initParams];
  errorID = [RDNA initialize:&rdna AgentInfo:agentInfo Callbacks:self GatewayHost:authGatewayHNIP GatewayPort:[authGatewayPORT intValue] CipherSpec:cipherSpec  CipherSalt:cipherSalt ProxySettings:nil AppContext:self];
  rdnaObject = rdna;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getServiceByServiceName:(NSString *)serviceName
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getServiceByServiceName:serviceName ServiceInfo:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getServiceByTargetCoordinate:(NSString *)targetHNIP
                   TargetPort:(int)targetPORT
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getServiceByTargetCoordinate:targetHNIP TargetPort:targetPORT ServicesInfo:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getAllServices:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getAllServices:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (serviceAccessStart:(NSString *)service
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStart:service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (serviceAccessStop:(NSString *)service
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStop:service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (serviceAccessStartAll:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStartAll];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (serviceAccessStopAll:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStopAll];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (pauseRuntime:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *state = nil;
  errorID = [rdnaObject pauseRuntime:&state];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":state};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
}

RCT_EXPORT_METHOD (resumeRuntime:(NSString *)state
                   ProxySettings:(NSString *)proxySettings
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  RDNA *rdna;
  rdnaClientCallbacks = [[ReactRdnaModule alloc]init];
  errorID = [RDNA resumeRuntime:&rdna SavedState:state Callbacks:self ProxySettings:proxySettings AppContext:self];
  rdnaObject = rdna;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getSDKVersion:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *sdkVersion = [RDNA getSDKVersion];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":sdkVersion};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
}

RCT_EXPORT_METHOD (getErrorInfo:(int)errorCode
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  RDNAErrorID error = [RDNA getErrorInfo:errorCode];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:error]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getDefaultCipherSpec:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *cipherSpecs;
  errorID = [rdnaObject getDefaultCipherSpec:&cipherSpecs];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":cipherSpecs};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getDefaultCipherSalt:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *cipherSalt;
  errorID = [rdnaObject getDefaultCipherSalt:&cipherSalt];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":cipherSalt};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (encryptDataPacket:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   From:(NSString *)plainText
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *cipherText;
  errorID = [rdnaObject encryptDataPacket:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt From:plainText Into:&cipherText];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":cipherText};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (decryptDataPacket:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   From:(NSString *)cipherText
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *plainText;
  errorID = [rdnaObject decryptDataPacket:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt From:cipherText Into:&plainText];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":plainText};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (encryptHttpRequest:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   From:(NSString *)request
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *transformedRequest;
  errorID = [rdnaObject encryptHttpRequest:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt From:request Into:&transformedRequest];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":transformedRequest};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (decryptHttpResponse:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   From:(NSString *)transformedResponse
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *response;
  errorID = [rdnaObject decryptHttpResponse:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt From:transformedResponse Into:&response];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":response};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (terminate:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject terminate];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getSessionID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *sessionId;
  errorID = [rdnaObject getSessionID:&sessionId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":sessionId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getAgentID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *agentId;
  errorID = [rdnaObject getAgentID:&agentId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":agentId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getDeviceID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *deviceId;
  errorID = [rdnaObject getDeviceID:&deviceId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":deviceId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
}

RCT_EXPORT_METHOD (getConfig:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getConfig:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getAllChallenges:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getAllChallenges:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (resetChallenge:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject resetChallenge];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (checkChallenges:(NSString *)challengeRequestString
                   forUserID:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:userID forKey:@"userName"];
  errorID = [rdnaObject checkChallengeResponse:challengeRequestString forUserID:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
}

RCT_EXPORT_METHOD (updateChallenges:(NSString *)challengeRequestString
                   forUserID:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject updateChallenges:challengeRequestString forUserID:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (logOff:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject logOff:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (forgotPassword:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject forgotPassword:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (setDNSServers:(NSArray *)DNSServers
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject setDNSServers:DNSServers];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (createPrivacyStreamFor:(RDNAStreamType)streamType
                   PrivacyScope:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   BlockReadyThreshold:(int)blockReadyThreshold
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  privacyStreamCallBack = [[ReactRdnaModule alloc]init];
  RDNAPrivacyStream *privacyStream;
  errorID = [rdnaObject createPrivacyStreamFor:streamType PrivacyScope:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt BlockReadyThreshold:blockReadyThreshold RDNAPrivacyStreamCallBacks:privacyStreamCallBack BlockReadyContext:self RDNAPrivacyStream:&privacyStream];
  privacyStreamObject = privacyStream;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getPostLoginChallenges:(NSString *)userID
                   withUseCaseName:(NSString *)useCaseName
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject getPostLoginChallenges:userID withUseCaseName:useCaseName];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
}

RCT_EXPORT_METHOD (getRegisteredDeviceDetails:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject getRegisteredDeviceDetails:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (updateDeviceDetails:(NSString *)userID
                   withDevices:(NSString *)devices
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject updateDeviceDetails:userID withDevices:devices];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (getNotifications:(NSString *)recordCount
                   withStartIndex:(NSString *)startIndex
                   withEnterpriseID:(NSString *)enterpriseID
                   withStartDate:(NSString *)startDate
                   withEndDate:(NSString *)endDate
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getNotifications:[recordCount intValue] withStartIndex:[startIndex intValue] withEnterpriseID:enterpriseID withStartDate:startDate withEndDate:endDate];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD (updateNotification:(NSString *)notificationID
                   withResponse:(NSString *)response
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject updateNotification:notificationID withResponse:response];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
}

RCT_EXPORT_METHOD(setCredentials:(NSString *)userName password:(NSString*)password action:(BOOL)action reactCallBack:(RCTResponseSenderBlock)callback){
  
  rdnaIWACredsObj.userName = userName;
  rdnaIWACredsObj.password = password;
  rdnaIWACredsObj.authStatus = action==YES?RDNA_IWA_AUTH_SUCCESS:RDNA_IWA_AUTH_CANCELLED;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:0]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  callback(@[responseArray]);
  
  dispatch_semaphore_signal(semaphore);
  
  
}


#pragma mark Wrapper callback methods


- (NSString *)getApplicationFingerprint {
  
  return @"test";
}

- (NSString *)getApplicationVersion{
  
  return @"appversion";
}

- (NSString *)getApplicationName{
  
  return @"appName";
}

- (int)onInitializeCompleted:(NSString *)status {
  NSLog(@"init success");
  i =0;
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onInitializeCompleted"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onInitializeCompleted" body:@{@"response":status}];
  return 0;
}

- (int)onPauseRuntime:(NSString *)status {
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onPauseCompleted"
//                                                            body:@{@"response":status}];
   [self sendEventWithName:@"onPauseCompleted" body:@{@"response":status}];
  return 0;
}

- (int)onResumeRuntime:(NSString *)status {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onResumeCompleted"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onResumeCompleted" body:@{@"response":status}];
  return 0;
}

- (int)onTerminate:(NSString *)status {
  
  rdnaObject = nil;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onTerminateCompleted"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onTerminateCompleted" body:@{@"response":status}];
  return 0;
}

- (int)ShowLocationDailogue {
  //user can show location alert if location not available.
  return 0;
}

-(CLLocationManager*)getLocationManager{
  if (locationManagerObject!=nil) {
    return locationManagerObject;
  }else{
    [self initializeLocationManager];
    return locationManagerObject;
  }
}

- (int)onConfigRecieved:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onConfigRecieved"
//                                                            body:@{@"response":status}];
   [self sendEventWithName:@"onConfigRecieved" body:@{@"response":status}];
  return 0;
}

- (int)onCheckChallengeResponseStatus:(NSString *) status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onCheckChallengeResponseStatus"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onCheckChallengeResponseStatus" body:@{@"response":status}];
  return 0;
}

- (int)onGetAllChallengeStatus:(NSString *) status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetAllChallengeStatus"
//                                                            body:@{@"response":status}];
 [self sendEventWithName:@"onGetAllChallengeStatus" body:@{@"response":status}];
  return 0;
}


- (int)onUpdateChallengeStatus:(NSString *) status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateChallengeStatus"
//                                                            body:@{@"response":status}];
   [self sendEventWithName:@"onUpdateChallengeStatus" body:@{@"response":status}];
  return 0;
}

- (int)onForgotPasswordStatus:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onForgotPasswordStatus"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onForgotPasswordStatus" body:@{@"response":status}];
  return 0;
}

- (int)onLogOff: (NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onLogOff"
//                                                            body:@{@"response":status}];
    [self sendEventWithName:@"onLogOff" body:@{@"response":status}];
  return 0;
}

- (RDNAIWACreds *)getCredentials:(NSString *)domainUrl{
  rdnaIWACredsObj  = [[RDNAIWACreds alloc] init];
  if (i==0) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *name = [defaults valueForKey:@"userName"];
//    [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"getpasswordSubscriptions"
//                                                              body:@{@"response":name}];
    [self sendEventWithName:@"onGetpassword" body:@{@"response":name}];
    i++;
  }else{

//    [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetCredentials"
//                                                              body:@{@"response":domainUrl}];
    [self sendEventWithName:@"onGetCredentials" body:@{@"response":domainUrl}];
  }
  semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
   return rdnaIWACredsObj;
  

}





- (int)onGetPostLoginChallenges:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetPostLoginChallenges"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onGetPostLoginChallenges" body:@{@"response":status}];
  return 0;
}

- (int)onGetRegistredDeviceDetails:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetRegistredDeviceDetails"
//                                                            body:@{@"response":status}];
    [self sendEventWithName:@"onGetRegistredDeviceDetails" body:@{@"response":status}];
  return 0;
}

- (int)onUpdateDeviceDetails:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateDeviceDetails"
//                                                            body:@{@"response":status}];
   [self sendEventWithName:@"onUpdateDeviceDetails" body:@{@"response":status}];
  return 0;
}

- (int)onUpdateDeviceStatus:(NSString *)status{
  
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateDeviceStatus"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onUpdateDeviceStatus" body:@{@"response":status}];
  return 0;
}

- (int)onBlockReadyFor:(RDNAPrivacyStream*)rdnaPrivacyStream
     BlockReadyContext:(id)pvBlockReadyCtx
    PrivacyBlockBuffer:(NSData *)pvBlockBuf
          andBlockSize:(int)nBlockSize{
  
  return 0;
}

- (int)onGetNotifications:(NSString *)status{
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetNotifications"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onGetNotifications" body:@{@"response":status}];
  return 0;
}


- (int)onUpdateNotification:(NSString *)status{
//  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateNotification"
//                                                            body:@{@"response":status}];
  [self sendEventWithName:@"onUpdateNotification" body:@{@"response":status}];
  return 0;
}

- (NSString*)getDeviceToken{
  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  NSMutableString *tokenString = [[NSMutableString alloc] init];
  int length = (int)[appDelegate.apnsDeviceToken length];
  char const *bytes = [appDelegate.apnsDeviceToken bytes];
  for (int j = 0; j < length; j++) {
    [tokenString appendString:[NSString stringWithFormat:@"%02.2hhx", bytes[j]]];
  }
  return tokenString;
}

#pragma mark Location Manager Implementation

-(void)initializeLocationManager{
  
  if ([CLLocationManager locationServicesEnabled] == NO) {
    NSLog(@"locationServicesEnabled false");
  } else {
    CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
    if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
      NSLog(@"authorizationStatus failed");
    } else {
      if (locationManagerObject == nil)
      {
        locationManagerObject = [[CLLocationManager alloc] init];
        [locationManagerObject requestWhenInUseAuthorization];
        [locationManagerObject requestAlwaysAuthorization];
        locationManagerObject.desiredAccuracy = kCLLocationAccuracyBest;
        locationManagerObject.delegate = self;
      }
      [locationManagerObject startUpdatingLocation];
    }
  }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
  NSLog(@"didFailWithError: %@", error);
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
  CLLocation *currentLocation = newLocation;
  if (currentLocation != nil) {
    NSString *longitude = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.longitude];
    NSString *latitude = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.latitude];
    NSString *altitude = [NSString stringWithFormat:@"%.8f", currentLocation.altitude];
    NSLog(@"lat = %@\n long = %@\n and altitude = %@",latitude,longitude,altitude);
  }
}

#pragma mark Constants to Export

- (NSDictionary *)constantsToExport
{
  
  return @{@"RdnaCipherSpecs":@"AES/256/CFB/PKCS7Padding",
           @"RdnaCipherSalt":@"Rel-ID-Secure-IV",
           //           @"agentInfo":@"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",
           //           @"GatewayHost":@"apisdkdev.uniken.com",
           //           @"GatewayPort":@"443",
           //           @"agentInfo":@"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",
           //           @"GatewayHost":@"10.0.9.87",
           //           @"GatewayPort":@"443",
           @"agentInfo":@"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",
           @"GatewayHost":@"apisdkdev.uniken.com",
           @"GatewayPort":@"4443",
           @"PRIVACY_SCOPE_SESSION" : @(RDNA_PRIVACY_SCOPE_SESSION),
           @"PRIVACY_SCOPE_DEVICE" : @(RDNA_PRIVACY_SCOPE_DEVICE),
           @"PRIVACY_SCOPE_USER" : @(RDNA_PRIVACY_SCOPE_USER),
           @"PRIVACY_SCOPE_AGENT":@(RDNA_PRIVACY_SCOPE_AGENT),
           @"PORT_TYPE_PROXY":@(RDNA_PORT_TYPE_PROXY),
           @"PORT_TYPE_PORTF":@(RDNA_PORT_TYPE_PORTF),
           @"STREAM_TYPE_ENCRYPT":@(RDNA_STREAM_TYPE_ENCRYPT),
           @"STREAM_TYPE_ENCRYPT":@(RDNA_STREAM_TYPE_ENCRYPT),
           @"AppVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"],
           };
  
}

@end

#pragma mark Class Extension to export enums to Javascript

@implementation RCTConvert (RDNAPrivacyScope)

RCT_ENUM_CONVERTER(RDNAPrivacyScope,
                   (@{@"PRIVACY_SCOPE_SESSION":@(RDNA_PRIVACY_SCOPE_SESSION),
                      @"PRIVACY_SCOPE_DEVICE":@(RDNA_PRIVACY_SCOPE_DEVICE),
                      @"PRIVACY_SCOPE_USER":@(RDNA_PRIVACY_SCOPE_USER),
                      @"PRIVACY_SCOPE_AGENT":@(RDNA_PRIVACY_SCOPE_AGENT)}),
                   RDNA_PRIVACY_SCOPE_SESSION,
                   integerValue);

RCT_ENUM_CONVERTER(RDNAPortType,
                   (@{@"PORT_TYPE_PROXY":@(RDNA_PORT_TYPE_PROXY),
                      @"PORT_TYPE_PORTF":@(RDNA_PORT_TYPE_PORTF)}),
                   RDNA_PORT_TYPE_PROXY,
                   integerValue);

RCT_ENUM_CONVERTER(RDNAStreamType,
                   (@{@"STREAM_TYPE_ENCRYPT":@(RDNA_STREAM_TYPE_ENCRYPT),
                      @"STREAM_TYPE_ENCRYPT":@(RDNA_STREAM_TYPE_ENCRYPT)}),
                   RDNA_STREAM_TYPE_ENCRYPT,
                   integerValue);
@end
