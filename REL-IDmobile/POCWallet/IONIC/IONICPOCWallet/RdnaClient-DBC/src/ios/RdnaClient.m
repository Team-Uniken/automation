//
//  RdnaClient.m
//  CordovaRefApp
//  Copyright © 2017 Uniken. All rights reserved.
//


#import "RdnaClient.h"
#import "RDNA.h"
#import <CoreLocation/CoreLocation.h>

@interface RdnaClient()<CLLocationManagerDelegate,RDNACallbacks>{
  
  id<RDNACallbacks> clientCallbacks;
  CLLocationManager *locationManagerObject;
  RDNA *rdnaObject;
  NSString *callbackID;
  NSString *applicationName;
  NSString *applicationVersion;
  NSString *deviceToken;
  dispatch_semaphore_t semaphore;
  RDNAIWACreds *rdnaIWACredsObj;
}
  @end

@implementation RdnaClient
  
#pragma -mark sdk methods
  
-(void)initialize:(CDVInvokedUrlCommand*)command{
  
  [self initParams];
  callbackID = command.callbackId;
  __block int errorID = 0;
  __block RDNA *rdna;
  
  dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
    //Background Thread
    @try{
      errorID = [RDNA initialize:&rdna AgentInfo:[command.arguments objectAtIndex:0] Callbacks:clientCallbacks GatewayHost:[command.arguments objectAtIndex:1] GatewayPort:[[command.arguments objectAtIndex:2] intValue] CipherSpec:[command.arguments objectAtIndex:3]  CipherSalt:[command.arguments objectAtIndex:4] ProxySettings:[command.arguments objectAtIndex:5] RDNASSLCertificate:nil DNSServerList:nil RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
      rdnaObject = rdna;
      dispatch_async(dispatch_get_main_queue(), ^(void){
        //Run UI Updates
        [self decideCallback:errorID response:nil];
      });
    }@catch (NSException *exception){
      dispatch_async(dispatch_get_main_queue(), ^(void){
        //Run UI Updates
        [self illegalAccessCallback:exception];
      });
    }
  });
}
  
-(void)logOff:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode =[rdnaObject logOff:[command.arguments objectAtIndex:0]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)terminate:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  [self decideCallback:[rdnaObject terminate] response:nil];
}
  
-(void)pauseRuntime:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  NSString *response;
  int errorCode = [rdnaObject pauseRuntime:&response];
  [self decideCallback:errorCode response:response];
}
  
-(void)resumeRuntime:(CDVInvokedUrlCommand*)command{
  
  RDNA *rdna;
  [self initParams];
  callbackID = command.callbackId;
  @try {
    
    int errorCode = [RDNA  resumeRuntime:&rdna SavedState:[command.arguments objectAtIndex:0] Callbacks:clientCallbacks ProxySettings:nil RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
    [self decideCallback:errorCode response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)checkChallengeResponse:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject checkChallengeResponse:[command.arguments objectAtIndex:0] forUserID:[command.arguments objectAtIndex:1]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)getAllChallenges:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject getAllChallenges:[command.arguments objectAtIndex:0]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)updateChallenges:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject updateChallenges:[command.arguments objectAtIndex:0] forUserID:[command.arguments objectAtIndex:1]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}

-(void)resetChallenge:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    [self decideCallback:[rdnaObject resetChallenge] response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
  
}
 
-(void)getNotifications:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject getNotifications:[[command.arguments objectAtIndex:0] intValue] withStartIndex:[[command.arguments objectAtIndex:1] intValue] withEnterpriseID:[command.arguments objectAtIndex:2] withStartDate:[command.arguments objectAtIndex:3] withEndDate:[command.arguments objectAtIndex:4]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}

-(void)getNotificationHistory:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject getNotificationHistory:[[command.arguments objectAtIndex:0] intValue] withStartIndex:[[command.arguments objectAtIndex:2] intValue] withEnterpriseID:[command.arguments objectAtIndex:1] withStartDate:[command.arguments objectAtIndex:3] withEndDate:[command.arguments objectAtIndex:4] withNotificationStatus:[command.arguments objectAtIndex:5] withActionPerformed:[command.arguments objectAtIndex:6] withKeywordSearch:[command.arguments objectAtIndex:7] withDeviceID:[command.arguments objectAtIndex:8]];
    
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)updateNotifications:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject updateNotification:[command.arguments objectAtIndex:0] withResponse:[command.arguments objectAtIndex:1]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}

-(void)getRegisteredDeviceDetails:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode= [rdnaObject getRegisteredDeviceDetails:[command.arguments objectAtIndex:0]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)updateDeviceDetails:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode= [rdnaObject updateDeviceDetails:[command.arguments objectAtIndex:0] withDevices:[command.arguments objectAtIndex:1]];
    [self decideCallback:errorCode response:nil];
    
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}
  
-(void)setApplicationName:(CDVInvokedUrlCommand*)command{
  
  @try {
    applicationName = [command.arguments objectAtIndex:0];
    [self createDefaultConstantSettingCallBack:applicationName];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)setApplicationVersion:(CDVInvokedUrlCommand*)command{
  
  @try {
    applicationVersion = [command.arguments objectAtIndex:0];
    [self createDefaultConstantSettingCallBack:applicationVersion];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
- (void)setDeviceToken:(CDVInvokedUrlCommand*)command{
  callbackID = command.callbackId;
  @try {
    deviceToken = [command.arguments objectAtIndex:0];
    [self createDefaultConstantSettingCallBack:deviceToken];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)getSessionID:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *sessionString;
    int errorCode =[rdnaObject getSessionID:&sessionString];
    [self decideCallback:errorCode response:sessionString];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}

-(void)getAgentID:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *agentIDString;
    int errorCode =[rdnaObject getAgentID:&agentIDString];
    [self decideCallback:errorCode response:agentIDString];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}

-(void)getDeviceID:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *deviceIDString;
    int errorCode =[rdnaObject getDeviceID:&deviceIDString];
    [self decideCallback:errorCode response:deviceIDString];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)getErrorInfo:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    int response=  [RDNA getErrorInfo:[[command.arguments objectAtIndex:0] intValue]];
    [self decideCallback:0 response:[NSNumber numberWithInt:response]];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}

-(void)getDefaultCipherSpec:(CDVInvokedUrlCommand*)command{
  
  NSString *response;
  callbackID = command.callbackId;
  int errorCode = [rdnaObject getDefaultCipherSpec:&response];
  [self decideCallback:errorCode response:response];
}
  
-(void)getDefaultCipherSalt:(CDVInvokedUrlCommand*)command{
  
  NSString *response;
  callbackID = command.callbackId;
  int errorCode = [rdnaObject getDefaultCipherSalt:&response];
  [self decideCallback:errorCode response:response];
}
 
-(void)getSDKVersion:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    [self decideCallback:0 response:[RDNA getSDKVersion]];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
  
}
  
-(void)getAllServices:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *response;
    int errorCode = [rdnaObject getAllServices:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)getServiceByServiceName:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *response;
    int errorCode = [rdnaObject getServiceByServiceName:[command.arguments objectAtIndex:0] ServiceInfo:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)getServiceByTargetCoordinate:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *response;
    int errorCode = [rdnaObject getServiceByTargetCoordinate:[command.arguments objectAtIndex:0] TargetPort:(uint16_t)[[command.arguments objectAtIndex:1] intValue] ServicesInfo:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)serviceAccessStart:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    int errorCode = [rdnaObject serviceAccessStart:[command.arguments objectAtIndex:0]];
    [self decideCallback:errorCode response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)serviceAccessStop:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    int errorCode = [rdnaObject serviceAccessStop:[command.arguments objectAtIndex:0]];
    [self decideCallback:errorCode response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)serviceAccessStartAll:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    int errorCode = [rdnaObject serviceAccessStartAll];
    [self decideCallback:errorCode response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)serviceAccessStopAll:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    int errorCode = [rdnaObject serviceAccessStopAll];
    [self decideCallback:errorCode response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)encryptDataPacket:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *response;
    int errorCode= [rdnaObject encryptDataPacket:[[command.arguments objectAtIndex:0] intValue] CipherSpec:[command.arguments objectAtIndex:1] CipherSalt:[command.arguments objectAtIndex:2] From:[command.arguments objectAtIndex:3] Into:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)decryptDataPacket:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    NSString *response;
    int errorCode= [rdnaObject decryptDataPacket:[[command.arguments objectAtIndex:0] intValue] CipherSpec:[command.arguments objectAtIndex:1] CipherSalt:[command.arguments objectAtIndex:2] From:[command.arguments objectAtIndex:3] Into:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)encryptHttpRequest:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    NSString *response;
    int errorCode= [rdnaObject encryptHttpRequest:[[command.arguments objectAtIndex:0] intValue] CipherSpec:[command.arguments objectAtIndex:1] CipherSalt:[command.arguments objectAtIndex:2] From:[command.arguments objectAtIndex:3] Into:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
-(void)decryptHttpResponse:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    NSString *response;
    int errorCode= [rdnaObject decryptHttpResponse:[[command.arguments objectAtIndex:0] intValue] CipherSpec:[command.arguments objectAtIndex:1] CipherSalt:[command.arguments objectAtIndex:2] From:[command.arguments objectAtIndex:3] Into:&response];
    [self decideCallback:errorCode response:response];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
}
  
  -(void)forgotPassword:(CDVInvokedUrlCommand*)command{
    
    callbackID = command.callbackId;
    @try {
      [self decideCallback:[rdnaObject forgotPassword:[command.arguments objectAtIndex:0]] response:nil];
    } @catch (NSException *exception) {
      [self illegalAccessCallback:exception];
    }
    
  }
  
-(void)getPostLoginChallenges:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try{
    int errorCode = [rdnaObject getPostLoginChallenges:[command.arguments objectAtIndex:0] withUseCaseName:[command.arguments objectAtIndex:1]];
    [self decideCallback:errorCode response:nil];
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}

-(void)getConfig:(CDVInvokedUrlCommand*)command{
  
  callbackID = command.callbackId;
  @try {
    [self decideCallback:[rdnaObject getConfig:[command.arguments objectAtIndex:0]] response:nil];
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
  
}
  
-(void)setCredentials:(CDVInvokedUrlCommand*)command{
  @try{
    rdnaIWACredsObj.userName = [command.arguments objectAtIndex:0];
    rdnaIWACredsObj.password = [command.arguments objectAtIndex:1];
    rdnaIWACredsObj.authStatus = [[command.arguments objectAtIndex:2] boolValue] == true ? RDNA_IWA_AUTH_SUCCESS :
    RDNA_IWA_AUTH_CANCELLED;
    dispatch_semaphore_signal(semaphore);
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
}

-(void)openHttpConnection:(CDVInvokedUrlCommand*)command{
  
  //rdnaHttpJSCallbacks = callback;
  @try{
  int errorID = 0;
  RDNAHTTPRequest *request = [[RDNAHTTPRequest alloc]init];

  if([command.arguments objectAtIndex:2]){
    NSError *err;
    NSData *data = [[command.arguments objectAtIndex:2] dataUsingEncoding:NSUTF8StringEncoding];
    id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&err];
    
    if(!err)
    request.headers = json;
  }
  
  request.method = [[command.arguments objectAtIndex:0] intValue];
  request.url = [command.arguments objectAtIndex:1];
  
  if ([NSString stringWithFormat:@"%@",[command.arguments objectAtIndex:3]].length > 0) {
    request.body = [[command.arguments objectAtIndex:3] dataUsingEncoding:NSUTF8StringEncoding];
  }
  
  int requestID;
  errorID = [rdnaObject openHttpConnection:request Callbacks:(id<RDNAHTTPCallbacks>)self httpRequestID:&requestID];
  
  
  if(errorID != RDNA_ERR_NONE){
    [self decideCallback:errorID response:nil];
  }else{
    [self decideCallback:errorID response:[NSString stringWithFormat:@"%d",requestID]];
  }
  }@catch (NSException *exception){
    [self illegalAccessCallback:exception];
  }
  
}

  
 
  
#pragma mark Wrapper callback methods
  

- (int)onInitializeCompleted:(NSString *)status {
  [self callJavaScript:@"onInitializeCompleted" result:status];
  return 0;
}
 
- (int)onLogOff: (NSString *)status{
  [self callJavaScript:@"onLogOff" result:status];
  return 0;
}

- (int)onTerminate:(NSString *)status {
  
  rdnaObject = nil;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
  [self callJavaScript:@"onInitializeCompleted" result:status];
  return 0;
}
  
-(int)onSessionTimeout:(NSString*)status{
  [self callJavaScript:@"onSessionTimeout" result:status];
  return 0;
}
  
- (int)onPauseRuntime:(NSString *)status {
  [self callJavaScript:@"onInitializeCompleted" result:status];
  return 0;
}
  
- (int)onResumeRuntime:(NSString *)status {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
  [self callJavaScript:@"onInitializeCompleted" result:status];
  return 0;
}
 
- (NSString*)getDeviceToken{
  return deviceToken;
}
  
- (int)onCheckChallengeResponseStatus:(NSString *) status{
  [self callJavaScript:@"onCheckChallengeResponseStatus" result:status];
  return 0;
}
  
- (int)onGetAllChallengeStatus:(NSString *) status{
  [self callJavaScript:@"onGetAllChallengeStatus" result:status];
  return 0;
}
  
  
- (int)onUpdateChallengeStatus:(NSString *) status{
  [self callJavaScript:@"onUpdateChallengeStatus" result:status];
  return 0;
}

- (int)onGetNotifications:(NSString *)status{
  [self callJavaScript:@"onGetNotifications" result:status];
  return 0;
}
  
- (int)onUpdateNotification:(NSString *)status{
  [self callJavaScript:@"onUpdateNotification" result:status];
  return 0;
}
  
-(int)onGetNotificationsHistory:(NSString*)status{
  [self callJavaScript:@"onGetNotificationsHistory" result:status];
  return 0;
}

- (int)onGetRegistredDeviceDetails:(NSString *)status{
  [self callJavaScript:@"onGetRegistredDeviceDetails" result:status];
  return 0;
}
  
- (int)onUpdateDeviceDetails:(NSString *)status{
  
  [self callJavaScript:@"onUpdateDeviceDetails" result:status];
  return 0;
}
 
- (NSString *)getApplicationVersion{
  return applicationVersion;
}
  
- (NSString *)getApplicationName{
  return applicationName;
}
  
- (int)onForgotPasswordStatus:(NSString *)status{
  [self callJavaScript:@"onForgotPasswordStatus" result:status];
  return 0;
}

- (int)onGetPostLoginChallenges:(NSString *)status{
  [self callJavaScript:@"onGetPostLoginChallenges" result:status];
  return 0;
}
  
- (int)onConfigRecieved:(NSString *)status{
  [self callJavaScript:@"onConfigRecieved" result:status];
  return 0;
}
  
- (RDNAIWACreds *)getCredentials:(NSString *)domainUrl{
  
  rdnaIWACredsObj  = [[RDNAIWACreds alloc] init];
  semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  
  return rdnaIWACredsObj;
}

-(int)onSdkLogPrintRequest:(RDNALoggingLevel)level andlogData:(NSString*)logData{
  [self callJavaScript:@"onSdkLogPrintRequest" result:logData];
  return 0;
}
  
  -(int)onSecurityThreat:(NSString*)status{
    NSString *str = [status stringByTrimmingCharactersInSet:NSCharacterSet.whitespaceAndNewlineCharacterSet];
    str = [self JSONString:str];
  [self callJavaScript:@"onSecurityThreat" result:str];
    return 0;
  }
  
- (int)ShowLocationDailogue {
  //user can show location alert if location not available.
  return 0;
}
  
-(void)initParams{
    clientCallbacks = self;
  
}
  
-(void)callJavaScript:(NSString*)methodName result:(NSString*) s{
  
  NSLog( @"javascript:cordova.fireDocumentEvent('");
  
  NSString *resultString = [NSString stringWithFormat:@"javascript:cordova.fireDocumentEvent(\"%@\",{response:'%@'})",methodName,s];
  
  [self.commandDelegate evalJs:resultString];
  
  
}

#pragma mark http response callback methods

-(int)onHttpResponse:(RDNAHTTPStatus*) status{
  [self callJavaScript:@"onHttpResponse" result:[self createJsonHttpResponse:status]];
  return 0;
}
 
  
#pragma -mark plugin to JS callback implementation
  
-(void)illegalAccessCallback:(NSException *)exception{
  CDVPluginResult* pluginResult =[CDVPluginResult resultWithStatus:CDVCommandStatus_ILLEGAL_ACCESS_EXCEPTION messageAsString:exception.description];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
}
  
-(void)decideCallback:(int)errorCode response:(NSObject*)responseData{
  
  CDVPluginResult* pluginResult = nil;
  if (errorCode == 0) {
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self createCallBackRespose:errorCode response:[self decideResultTypeAndReturnStringResult:responseData]]];
  }else{
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[self createCallBackRespose:errorCode response:[self decideResultTypeAndReturnStringResult:responseData]]];
  }
  [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
}
  
-(NSString*)createCallBackRespose:(int)errorCode response:(NSString*)responseData{
  
  NSError *err;
  NSMutableDictionary *dictRes = [[NSMutableDictionary alloc]init];
  [dictRes setValue:[NSNumber numberWithInt:errorCode] forKey:@"error"];
  [dictRes setValue:responseData forKey:@"response"];
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictRes options:NSJSONWritingPrettyPrinted error:&err];
  
  if (err) {
    NSLog(@"createCallBackRespose:%@",err.description);
    return nil;
  }
  NSString* stringResult = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  NSLog(@"JSON = %@", stringResult);
  return stringResult;
  
}
  
  
  
-(NSString*)decideResultTypeAndReturnStringResult:(NSObject*)result{
  if ([result isKindOfClass:[NSString class]]) {
    if (result) {
      return (NSString*)result;
    }else{
      return @"null";
    }
  }else if(result == nil){
    return @"null";
  }else{
    return @"unknown";
  }
}
  
-(void)createDefaultConstantSettingCallBack:(NSString*)result{
  CDVPluginResult* pluginResult = nil;
  
  @try {

    if (result!=nil || result.length > 0) {
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
    }else{
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid Argument"];
    }
  } @catch (NSException *exception) {
    [self illegalAccessCallback:exception];
  }
  
  [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
}
  
  
#pragma -mark Location Manager Implementation
  
-(CLLocationManager*)getLocationManager{
  if (locationManagerObject!=nil) {
    return locationManagerObject;
  }else{
    [self initializeLocationManager];
    return locationManagerObject;
  }
}
  
  
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

#pragma -mark Utils methods
-(NSString*)createJsonHttpResponse:(RDNAHTTPStatus*) status{
  
  NSMutableDictionary *dictStatusJson = [[NSMutableDictionary alloc] init];
  
  //[dictStatusJson setValue:[NSNumber numberWithInt:status.errorCode] forKey:@"errorCode"];
  [dictStatusJson setValue: [NSNumber numberWithInt:status.errorCode] forKey:@"errorCode"];
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
  [dictResponseJson setValue:status.response.body.length > 0?[status.response.body base64EncodedStringWithOptions:NSUTF8StringEncoding]:@"" forKey:@"body"];
  
  [dictStatusJson setValue:dictResponseJson forKey:@"httpResponse"];
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictStatusJson
                                                     options:0 error:&error];
  return [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
}

-(NSString *)JSONString:(NSString *)aString {
  NSMutableString *s = [NSMutableString stringWithString:aString];
  [s replaceOccurrencesOfString:@"\"" withString:@"\\\"" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"/" withString:@"\\/" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"\n" withString:@"\\n" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"\b" withString:@"\\b" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"\f" withString:@"\\f" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"\r" withString:@"\\r" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  [s replaceOccurrencesOfString:@"\t" withString:@"\\t" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
   [s replaceOccurrencesOfString:@"'" withString:@"\\'" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [s length])];
  return [NSString stringWithString:s];
}
  
  @end

