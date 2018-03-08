//
//  ReactRdnaModule.m
//  ReactReferenceApp1
//
//  Created by Sudarshan on 3/29/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ReactRdnaModule.h"
#import <CoreLocation/CoreLocation.h>
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import "AppDelegate.h"
#import <AVFoundation/AVFoundation.h>
//#import "ActiveShieldSDK.h"
#import <ReactNativeConfig/ReactNativeConfig.h>

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
  NSMutableDictionary *dictHttpCallbacks;
  int i;
  //  ActiveShield *_shield;
  AppDelegate *delegate;
}
@end

@implementation ReactRdnaModule

@synthesize  bridge = _bridge;


RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onInitializeCompleted",@"onPauseCompleted",@"onResumeCompleted",@"onConfigReceived",@"onCheckChallengeResponseStatus",@"onGetAllChallengeStatus",@"onUpdateChallengeStatus",@"onForgotPasswordStatus",@"onLogOff",@"onGetpassword",@"onGetCredentials",@"onGetPostLoginChallenges",@"onGetRegistredDeviceDetails",@"onUpdateDeviceDetails",@"onUpdateDeviceStatus",@"onGetNotifications",@"onUpdateNotification",@"onGetNotificationsHistory",@"onTerminateCompleted",@"onSessionTimeout"];
}

-(void)initParams{
  // RDNAErrorID errorID= [RDNA getErrorInfo:272629808];
  rdnaClientCallbacks = [[ReactRdnaModule alloc]init];
  dictHttpCallbacks = [[NSMutableDictionary alloc]init];
}

#pragma mark ReactExportMethods

RCT_EXPORT_METHOD (initialize:(NSString *)agentInfo
                   GatewayHost:(NSString *)authGatewayHNIP
                   GatewayPort:(NSString*)authGatewayPORT
                   
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   ProxySettings:(NSString *)proxySettings
                   RDNASSLCertificate:(NSString *) sslCertificate
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  NSString *path = [[NSBundle mainBundle] pathForResource:@"clientcert" ofType:@"p12"];
  NSData *certData = [NSData dataWithContentsOfFile:path];
  NSString *certString3 = [certData base64EncodedStringWithOptions:2];
  NSString *certPassword = @"";
  RDNASSLCertificate *rdnaSSLlCertificate = nil;
  
  __block int errorID = 0;
  localbridgeDispatcher = _bridge;
  delegate = (AppDelegate*)[UIApplication sharedApplication].delegate;
  if(sslCertificate!=nil){
    
    NSError *error;
    NSDictionary *dictSSLDetails = [NSJSONSerialization JSONObjectWithData:[sslCertificate dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];
    if(!error){
      rdnaSSLlCertificate = [[RDNASSLCertificate alloc]init];
      rdnaSSLlCertificate.p12Certificate = [dictSSLDetails valueForKey:@"data"];
      rdnaSSLlCertificate.password = [dictSSLDetails valueForKey:@"password"];
      
    }
  }
  
  [self initParams];
  
  if([[ReactNativeConfig envFor:@"BETTERMOBI"] isEqualToString:@"true"]){
    
    __block bool retval = YES;
    __block NSMutableSet *threatSet = [[NSMutableSet alloc]init];
    
    //  _shield = [ActiveShield sharedInstance];
    //  [_shield performSecurityCheckWithOptions:ASSecurityCheckOptionsMake(YES, YES, YES) andCompletion:^(NSArray<ASSecurityThreat *> * _Nonnull discoveredThreats, NSArray<NSError *> * _Nonnull errors) {
    //
    //    for (ASSecurityThreat *_threat in discoveredThreats)
    //    {
    //      switch (_threat.genus)
    //      {
    //        case ASSecurityThreatCategorySystem:
    //          if (_threat.species == ASSysSecurityThreatIntegrityCompromised)
    //          {
    //            //ok, this device is jailbroken (or in any other way compromised) :(
    //            NSString *threatString =@"The device's integrity is compromised";
    //            [threatSet addObject:threatString];
    //             retval = NO;
    //          }
    //          break;
    //        case ASSecurityThreatCategoryNetwork:
    //          //we have a network threat, ie. mitm attack, ARP spoofing, SSL strip etc..
    //          if (_threat.implicatedNetworks.count)
    //          {
    //            BMNetworkId *_network = _threat.implicatedNetworks[0];
    //            NSString *threatString =[NSString stringWithFormat:@" Network Threat is detected on %@\n", _network.friendlyId];
    //            [threatSet addObject:threatString];
    //            retval = NO;
    //          }
    //          break;
    //        case ASSecurityThreatCategoryApp:
    //          if (_threat.implicatedApps.count)
    //          {
    //            NSString *_badAppBundleID = _threat.implicatedApps[0];
    //            if (_threat.species == ASAppSecurityThreatRepackagedApp)
    //            {
    //              NSString *threatString =[NSString stringWithFormat:@"The app with the bundle ID %@ is repackaged!\n", _badAppBundleID];
    //              [threatSet addObject:threatString];
    //              retval = NO;
    //            }
    //            else if (_threat.species == ASAppSecurityThreatUnknownSourceApp)
    //            {
    //              if (![_threat.implicatedApps[0] hasPrefix:@"com.uniken"]) {
    //                NSString *threatString =@"Your device contains app from unknown resources";
    //                [threatSet addObject:threatString];
    //                retval = NO;
    //              }
    //            }
    //            else if(_threat.species == ASAppSecurityThreatMaliciousApp)
    //            {
    //              NSString *threatString =[NSString stringWithFormat:@"The app with the bundle ID %@ could be malicious!\n", _badAppBundleID];
    //              [threatSet addObject:threatString];
    //              retval = NO;
    //            }
    //            else if(_threat.species == ASAppSecurityThreatEnterpriseBlacklistedApp){
    //              if (![_threat.implicatedApps[0] hasPrefix:@"com.uniken"]) {
    //                NSString *threatString =@"Your device contains app from unknown resources";
    //                [threatSet addObject:threatString];
    //                retval = NO;
    //              }
    //            }
    //            else{
    //              retval = YES;
    //            }
    //          }
    //          break;
    //
    //        default:
    //          break;
    //      }
    //    }
    //    if(retval){
    //      RDNA *rdna;
    //      errorID = [RDNA initialize:&rdna AgentInfo:agentInfo Callbacks:self GatewayHost:authGatewayHNIP GatewayPort:[authGatewayPORT intValue] CipherSpec:cipherSpec  CipherSalt:cipherSalt ProxySettings:nil RDNASSLCertificate:rdnaSSLlCertificate DNSServerList:nil AppContext:self];
    //      rdnaObject = rdna;
    //      NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
    //      NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    //      callback(@[responseArray]);
    //      if (errorID ==0) {
    //        [self startBetterMobiMonitoring];
    //      }
    //    }else{
    //      NSMutableString *errorString = [[NSMutableString alloc]init];
    //      NSArray *threat = [threatSet allObjects];
    //      for (int j =0; j<threat.count; j++) {
    //        [errorString appendString:[NSString stringWithFormat:@"\n %@",[threat objectAtIndex:j]]];
    //      }
    //      dispatch_async(dispatch_get_main_queue(), ^{
    //        [delegate onDeviceThreat:errorString];
    //      });
    //    }
    //  }];
  }else{
    
    RDNA *rdna;
    //    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    //    dispatch_async(queue, ^{
    errorID = [RDNA initialize:&rdna AgentInfo:agentInfo Callbacks:self GatewayHost:authGatewayHNIP GatewayPort:[authGatewayPORT intValue] CipherSpec:cipherSpec  CipherSalt:cipherSalt ProxySettings:nil RDNASSLCertificate:rdnaSSLlCertificate DNSServerList:nil RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
    
    rdnaObject = rdna;
    NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
    NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      callback(@[responseArray]);
    });
    
    //      });
    
  }
}

RCT_EXPORT_METHOD (getServiceByServiceName:(NSString *)serviceName
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getServiceByServiceName:serviceName ServiceInfo:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getServiceByTargetCoordinate:(NSString *)targetHNIP
                   TargetPort:(int)targetPORT
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getServiceByTargetCoordinate:targetHNIP TargetPort:targetPORT ServicesInfo:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getAllServices:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *service;
  errorID = [rdnaObject getAllServices:&service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":service};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (serviceAccessStart:(NSString *)service
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStart:service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (serviceAccessStop:(NSString *)service
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStop:service];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (serviceAccessStartAll:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStartAll];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (serviceAccessStopAll:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject serviceAccessStopAll];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (pauseRuntime:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *state = nil;
  errorID = [rdnaObject pauseRuntime:&state];
//  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":state};
   NSDictionary *dictionary;
  if((state==nil)&&(state.length==0)){
    state = @"";
    dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":state};
  }else{
    dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":state};
  }
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
}

RCT_EXPORT_METHOD (resumeRuntime:(NSString *)state
                   ProxySettings:(NSString *)proxySettings
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  RDNA *rdna;
  rdnaClientCallbacks = [[ReactRdnaModule alloc]init];
  errorID = [RDNA resumeRuntime:&rdna SavedState:state Callbacks:self ProxySettings:proxySettings RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
  rdnaObject = rdna;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getSDKVersion:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *sdkVersion = [RDNA getSDKVersion];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":sdkVersion};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
}

RCT_EXPORT_METHOD (getErrorInfo:(int)errorCode
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  RDNAErrorID error = [RDNA getErrorInfo:errorCode];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:error]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getDefaultCipherSpec:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *cipherSpecs;
  errorID = [rdnaObject getDefaultCipherSpec:&cipherSpecs];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":cipherSpecs};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getDefaultCipherSalt:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *cipherSalt;
  errorID = [rdnaObject getDefaultCipherSalt:&cipherSalt];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":cipherSalt};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (decryptDataPacket:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
                   From:(NSString *)cipherText
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSString *plainText;
  errorID = [rdnaObject decryptDataPacket:privacyScope CipherSpec:cipherSpec CipherSalt:cipherSalt From:cipherText Into:&plainText];
  NSDictionary *dictionary;
  if((plainText==nil)&&(plainText.length==0)){
    plainText = @"";
    dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":plainText};
  }else{
    dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":plainText};
  }
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (terminate:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject terminate];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

+(void)terminateRDNA{
  int errorID = 0;
  errorID = [rdnaObject terminate];
}

RCT_EXPORT_METHOD (getSessionID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *sessionId;
  errorID = [rdnaObject getSessionID:&sessionId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":sessionId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getAgentID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *agentId;
  errorID = [rdnaObject getAgentID:&agentId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":agentId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getDeviceID:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  NSMutableString *deviceId;
  errorID = [rdnaObject getDeviceID:&deviceId];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":deviceId};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
}

RCT_EXPORT_METHOD (getConfig:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getConfig:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (testConfig:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getConfig:userID];
  [rdnaObject terminate];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getAllChallenges:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject getAllChallenges:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (resetChallenge:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject resetChallenge];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
}

RCT_EXPORT_METHOD (updateChallenges:(NSString *)challengeRequestString
                   forUserID:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject updateChallenges:challengeRequestString forUserID:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (logOff:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject logOff:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (forgotPassword:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  errorID = [rdnaObject forgotPassword:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (setDNSServers:(NSArray *)DNSServers
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  //errorID = [RDNA setDNSServers:DNSServers];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (getPostLoginChallenges:(NSString *)userID
                   withUseCaseName:(NSString *)useCaseName
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject getPostLoginChallenges:userID withUseCaseName:useCaseName];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
}

RCT_EXPORT_METHOD (getRegisteredDeviceDetails:(NSString *)userID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject getRegisteredDeviceDetails:userID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (updateDeviceDetails:(NSString *)userID
                   withDevices:(NSString *)devices
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject updateDeviceDetails:userID withDevices:devices];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
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
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}


RCT_EXPORT_METHOD (getNotificationHistory:(int)recordCount
                   withEnterpriseID:(NSString *)enterpriseID
                   withStartIndex:(int)startIndex
                   withStartDate:(NSString *)startDate
                   withEndDate:(NSString *)endDate
                   withNotificationStatus:(NSString *)notificationStatus
                   withActionPerformed:(NSString *)actionPerformed
                   withKeyordSearch:(NSString *)keywordSearch
                   withDeviceID:(NSString *)deviceID
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  int errorID = 0;
  
  errorID = [rdnaObject getNotificationHistory:recordCount withStartIndex:startIndex withEnterpriseID:enterpriseID withStartDate:startDate withEndDate:endDate withNotificationStatus:notificationStatus withActionPerformed:actionPerformed withKeywordSearch:keywordSearch withDeviceID:deviceID];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD (updateNotification:(NSString *)notificationID
                   withResponse:(NSString *)response
                   reactCallBack:(RCTResponseSenderBlock)callback){
  int errorID = 0;
  errorID = [rdnaObject updateNotification:notificationID withResponse:response];
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
}

RCT_EXPORT_METHOD(setCredentials:(NSString *)userName password:(NSString*)password action:(BOOL)action reactCallBack:(RCTResponseSenderBlock)callback){
  
  rdnaIWACredsObj.userName = userName;
  rdnaIWACredsObj.password = password;
  rdnaIWACredsObj.authStatus = action==YES?RDNA_IWA_AUTH_SUCCESS:RDNA_IWA_AUTH_CANCELLED;
  NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:0]};
  NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[responseArray]);
  });
  
  dispatch_semaphore_signal(semaphore);
  
  
}


RCT_EXPORT_METHOD (openHttpConnection:(RDNAHttpMethods)method
                   withUrl:(NSString *)url
                   withHeaders:(NSString *)headers
                   withBody:(NSString *)body
                   reactCallBack:(RCTResponseSenderBlock)callback){
  
  //rdnaHttpJSCallbacks = callback;
  
  int errorID = 0;
  RDNAHTTPRequest *request = [[RDNAHTTPRequest alloc]init];
  
  
  if(headers){
    NSError *err;
    NSData *data = [headers dataUsingEncoding:NSUTF8StringEncoding];
    id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&err];
    
    if(!err)
      request.headers = json;
  }
  
  request.method = method;
  request.url = url;
  
  if (body.length > 0) {
    request.body = [body dataUsingEncoding:NSUTF8StringEncoding];
  }
  
  int requestID;
  errorID = [rdnaObject openHttpConnection:request Callbacks:(id<RDNAHTTPCallbacks>)self httpRequestID:&requestID];
  
  
  if(errorID != RDNA_ERR_NONE){
    NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":@""};
    NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    callback(@[responseArray]);
  }else{
    [dictHttpCallbacks setObject:callback forKey:[NSString stringWithFormat:@"%d",requestID]];
  }
  
}


RCT_EXPORT_METHOD (exitApp){
  exit(0);
}

-(NSDictionary*)createJsonHttpResponse:(RDNAHTTPStatus*) status{
  
  NSMutableDictionary *dictStatusJson = [[NSMutableDictionary alloc] init];
  
  //[dictStatusJson setValue:[NSNumber numberWithInt:status.errorCode] forKey:@"errorCode"];
  [dictStatusJson setValue:[NSNumber numberWithInt:status.requestID] forKey:@"requestID"];
  
  NSMutableDictionary *dictRequestJson = [[NSMutableDictionary alloc] init];
  
  [dictRequestJson setValue:[NSNumber numberWithInt:status.request.method] forKey:@"method"];
  [dictRequestJson setValue:status.request.url forKey:@"url"];
  
  
  [dictRequestJson setValue:status.request.headers forKey:@"headers"];
  [dictRequestJson setValue:[[NSString alloc] initWithData:status.request.body encoding:NSUTF8StringEncoding]forKey:@"body"];
  
  [dictStatusJson setValue:dictRequestJson forKey:@"httpRequest"];
  
  
  
  NSMutableDictionary *dictResponseJson = [[NSMutableDictionary alloc] init];
  
  [dictResponseJson setValue:status.response.version forKey:@"version"];
  [dictResponseJson setValue:[NSNumber numberWithInt:status.response.statusCode] forKey:@"statusCode"];
  [dictResponseJson setValue:status.response.statusMessage forKey:@"statusMessage"];
  
  
  [dictResponseJson setValue:status.response.headers forKey:@"headers"];
  [dictResponseJson setValue:[[NSString alloc] initWithData:status.response.body encoding:NSUTF8StringEncoding]forKey:@"body"];
  
  [dictStatusJson setValue:dictResponseJson forKey:@"httpResponse"];
  
  return dictStatusJson;
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
  dispatch_async(dispatch_get_main_queue(), ^(){
    [self sendEventWithName:@"onInitializeCompleted" body:@{@"response":status}];
  });
  return 0;
}

- (int)onPauseRuntime:(NSString *)status {
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onPauseCompleted"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onPauseCompleted" body:@{@"response":status}];
  });
  return 0;
}

- (int)onResumeRuntime:(NSString *)status {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onResumeCompleted"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onResumeCompleted" body:@{@"response":status}];
  });
  
  return 0;
}

- (int)onTerminate:(NSString *)status {
  
  rdnaObject = nil;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onTerminateCompleted"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onTerminateCompleted" body:@{@"response":status}];
  });
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
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onConfigReceived" body:@{@"response":status}];
  });
  return 0;
}

- (int)onCheckChallengeResponseStatus:(NSString *) status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onCheckChallengeResponseStatus"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onCheckChallengeResponseStatus" body:@{@"response":status}];
  });
  return 0;
}

- (int)onGetAllChallengeStatus:(NSString *) status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetAllChallengeStatus"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onGetAllChallengeStatus" body:@{@"response":status}];
  });
  return 0;
}


- (int)onUpdateChallengeStatus:(NSString *) status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateChallengeStatus"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onUpdateChallengeStatus" body:@{@"response":status}];
  });
  return 0;
}

- (int)onForgotPasswordStatus:(NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onForgotPasswordStatus"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onForgotPasswordStatus" body:@{@"response":status}];
  });
  return 0;
}

- (int)onLogOff: (NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onLogOff"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onLogOff" body:@{@"response":status}];
  });
  return 0;
}

- (RDNAIWACreds *)getCredentials:(NSString *)domainUrl{
  rdnaIWACredsObj  = [[RDNAIWACreds alloc] init];
  if (i==0) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *name = [defaults valueForKey:@"userName"];
    
    if(name==nil){
      name =@"";
    }
    
    //    [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"getpasswordSubscriptions"
    //                                                              body:@{@"response":name}];
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:@"onGetpassword" body:@{@"response":name}];
    });
    i++;
  }else{
    
    //    [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetCredentials"
    //                                                              body:@{@"response":domainUrl}];
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:@"onGetCredentials" body:@{@"response":domainUrl}];
    });
  }
  semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  return rdnaIWACredsObj;
  
  
}





- (int)onGetPostLoginChallenges:(NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetPostLoginChallenges"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onGetPostLoginChallenges" body:@{@"response":status}];
  });
  return 0;
}

- (int)onGetRegistredDeviceDetails:(NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onGetRegistredDeviceDetails"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onGetRegistredDeviceDetails" body:@{@"response":status}];
  });
  return 0;
}

- (int)onUpdateDeviceDetails:(NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateDeviceDetails"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onUpdateDeviceDetails" body:@{@"response":status}];
  });
  return 0;
}

- (int)onUpdateDeviceStatus:(NSString *)status{
  
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateDeviceStatus"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onUpdateDeviceStatus" body:@{@"response":status}];
  });
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
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onGetNotifications" body:@{@"response":status}];
  });
  return 0;
}


- (int)onUpdateNotification:(NSString *)status{
  //  [localbridgeDispatcher.eventDispatcher sendDeviceEventWithName:@"onUpdateNotification"
  //                                                            body:@{@"response":status}];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onUpdateNotification" body:@{@"response":status}];
  });
  return 0;
}

-(int)onGetNotificationsHistory:(NSString*)status{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onGetNotificationsHistory" body:@{@"response":status}];
  });
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

-(int)onSessionTimeout:(NSString*)status{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self sendEventWithName:@"onSessionTimeout" body:@{@"response":status}];
  });
  return 0;
}

-(int)onSecurityThreat:(NSString*)status{
  dispatch_async(dispatch_get_main_queue(), ^(){
    AppDelegate *appdelegate = (AppDelegate*)[UIApplication sharedApplication].delegate;
    [appdelegate onDeviceThreat:status];
  });
  
  return 0;
}

#pragma mark http response callback methods

-(int)onHttpResponse:(RDNAHTTPStatus*) status{
  
  //[self sendEventWithName:@"onHttpResponse" body:@{@"response":[self createJsonHttpResponse:status]}];
  RCTResponseSenderBlock rdnaHttpJSCallbacks = [dictHttpCallbacks valueForKey:[NSString stringWithFormat:@"%d",status.requestID]];
  if(rdnaHttpJSCallbacks){
    NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:status.errorCode],@"response":[self createJsonHttpResponse:status]};
    NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    rdnaHttpJSCallbacks(@[responseArray]);
    [dictHttpCallbacks removeObjectForKey:[NSString stringWithFormat:@"%d",status.requestID]];
  }
  return 0;
}

-(int)onSdkLogPrintRequest:(RDNALoggingLevel)level andlogData:(NSString*)logData{
  NSLog(@"\n\n %@",logData);
  return 0;
}

#pragma mark Location Manager Implementation

-(void)initializeLocationManager{
  
  dispatch_async(dispatch_get_main_queue(), ^{
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
         // [locationManagerObject requestAlwaysAuthorization];
          locationManagerObject.desiredAccuracy = kCLLocationAccuracyBest;
          locationManagerObject.delegate = self;
        }
        [locationManagerObject startUpdatingLocation];
      }
    }
  });
  
  
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
    //NSLog(@"lat = %@\n long = %@\n and altitude = %@",latitude,longitude,altitude);
  }
}

#pragma mark Utils method
- (NSString*)encodeStringTo64:(NSString*)fromString
{
  NSData *plainData = [fromString dataUsingEncoding:NSUTF8StringEncoding];
  NSString *base64String;
  if ([plainData respondsToSelector:@selector(base64EncodedStringWithOptions:)]) {
    base64String = [plainData base64EncodedStringWithOptions:kNilOptions];  // iOS 7+
  }
  return base64String;
}

#pragma mark Constants to Export

- (NSDictionary *)constantsToExport
{
  
  return @{@"RdnaCipherSpecs":@"AES/256/CFB/PKCS7Padding",
           @"RdnaCipherSalt":[[NSBundle mainBundle] bundleIdentifier],
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
           @"RDNA_HTTP_POST":@(RDNA_HTTP_POST),
           @"RDNA_HTTP_GET":@(RDNA_HTTP_GET),
           
           };
  
}

#pragma mark BetterMobileSDk

-(void)startBetterMobiMonitoring{
  
  //  ReactRdnaModule __weak *self__ = self;
  //  static dispatch_once_t onceToken;
  //  dispatch_once(&onceToken, ^{
  //    [_shield addObserverWithCallback:^(NSArray<ASSecurityThreat *> * _Nonnull discoveredThreats, NSArray<NSError *> * _Nonnull errors)
  //     {
  //       [self__ _handleDiscoveredThreats:discoveredThreats andErrors:errors];
  //     }];
  //  });
  //    [_shield startMonitoringWithOptions:ASSecurityCheckOptionsMake(YES, YES, YES)];
}

//- (void) _handleDiscoveredThreats:(NSArray<ASSecurityThreat *> *) discoveredThreats andErrors:(NSArray *)errors
//{
//  __block bool retval = YES;
//  __block NSMutableSet *threatSet = [[NSMutableSet alloc]init];
//  for (ASSecurityThreat *_threat in discoveredThreats)
//  {
//    switch (_threat.genus)
//    {
//      case ASSecurityThreatCategorySystem:
//        if (_threat.species == ASSysSecurityThreatIntegrityCompromised)
//        {
//          //ok, this device is jailbroken (or in any other way compromised) :(
//          NSString *threatString =@"The device's integrity is compromised";
//          [threatSet addObject:threatString];
//          retval = NO;
//        }
//        break;
//      case ASSecurityThreatCategoryNetwork:
//        //we have a network threat, ie. mitm attack, ARP spoofing, SSL strip etc..
//        if (_threat.implicatedNetworks.count)
//        {
//          BMNetworkId *_network = _threat.implicatedNetworks[0];
//          NSString *threatString =[NSString stringWithFormat:@" Network Threat is detected on %@\n", _network.friendlyId];
//          [threatSet addObject:threatString];
//          retval = NO;
//        }
//        break;
//      case ASSecurityThreatCategoryApp:
//        if (_threat.implicatedApps.count)
//        {
//          NSString *_badAppBundleID = _threat.implicatedApps[0];
//          if (_threat.species == ASAppSecurityThreatRepackagedApp)
//          {
//            NSString *threatString =[NSString stringWithFormat:@"The app with the bundle ID %@ is repackaged!\n", _badAppBundleID];
//            [threatSet addObject:threatString];
//            retval = NO;
//          }
//          else if (_threat.species == ASAppSecurityThreatUnknownSourceApp)
//          {
//            if (![_threat.implicatedApps[0] hasPrefix:@"com.uniken"]) {
//              NSString *threatString =@"Your device contains app from unknown resources";
//              [threatSet addObject:threatString];
//              retval = NO;
//            }
//          }
//          else if(_threat.species == ASAppSecurityThreatMaliciousApp)
//          {
//            NSString *threatString =[NSString stringWithFormat:@"The app with the bundle ID %@ could be malicious!\n", _badAppBundleID];
//            [threatSet addObject:threatString];
//            retval = NO;
//          }
//          else if(_threat.species == ASAppSecurityThreatEnterpriseBlacklistedApp){
//            if (![_threat.implicatedApps[0] hasPrefix:@"com.uniken"]) {
//              NSString *threatString =@"Your device contains app from unknown resources";
//              [threatSet addObject:threatString];
//              retval = NO;
//            }
//          }
//          else{
//            retval = YES;
//          }
//        }
//        break;
//
//      default:
//        break;
//    }
//  }
//  if(!retval){
//    NSMutableString *errorString = [[NSMutableString alloc]init];
//    NSArray *threat = [threatSet allObjects];
//    for (int j =0; j<threat.count; j++) {
//      [errorString appendString:[NSString stringWithFormat:@"\n %@",[threat objectAtIndex:j]]];
//    }
//    dispatch_async(dispatch_get_main_queue(), ^{
//      [delegate onDeviceThreat:errorString];
//    });
//  }
//}

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

RCT_ENUM_CONVERTER(RDNAHttpMethods,
                   (@{@"RDNA_HTTP_POST":@(RDNA_HTTP_POST),
                      @"RDNA_HTTP_GET":@(RDNA_HTTP_GET)}),
                   RDNA_HTTP_POST,
                   integerValue);

@end
