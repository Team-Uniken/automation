//
//  RDNAClient.m
//  API_SDK_SAMPLE_V1
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//

#import "RDNAClient.h"
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "RDNAConstants.h"
#import "AppDelegate.h"
#import "RelIDRequestInterceptor.h"
#import "SuperViewController.h"

#define IS_OS_8_OR_LATER ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)


@interface RDNAClient()<CLLocationManagerDelegate,RDNAHTTPCallbacks>{
  
  dispatch_semaphore_t semaphore;
  id<RDNACallbacks> clientCallbacks;  //RDNACallbacks object.
  CLLocationManager *locationManagerObject;//LocationManager
  RDNA *rdnaObject;  //This is the public RDNA object which will be initialized in the initializeRDNA
  id<RDNAClientCallbacks> rdnaClientCallback; //this is delegate object for respond to terminate operation.
}

@end

@implementation RDNAClient
- (instancetype)init {
  
  self = [super init];
  if (self) {
    [self initializeLocationManager];
  }
  return self;
}

/**
 * @brief This method used for create the location manager object.
 */
-(void)initializeLocationManager {
  
  if ([CLLocationManager locationServicesEnabled] == NO) {
    NSLog(@"locationServicesEnabled false");
    [SuperViewController showErrorWithMessage:@"You currently have all location services for this device disabled" withErrorCode:0];
  } else {
    CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
    if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
      NSLog(@"authorizationStatus failed");
    } else {
      if (locationManagerObject == nil)
      {
        locationManagerObject = [[CLLocationManager alloc] init];
        [locationManagerObject requestWhenInUseAuthorization];
        if(IS_OS_8_OR_LATER) {
          [locationManagerObject requestAlwaysAuthorization];
        }
        locationManagerObject.desiredAccuracy = kCLLocationAccuracyBest;
        locationManagerObject.delegate = self;
      }
      [locationManagerObject startUpdatingLocation];
    }
  }
}

/*
 *    Invoked when an error has occurred in location manager".
 */
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  
  NSLog(@"didFailWithError: %@", error.userInfo);
}

/*
 *     Invoked when a new location is available. oldLocation may be nil if there is no previous location
 *    available.
 */
- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
  //  NSLog(@"didUpdateToLocation: %@", newLocation);
}

/**
 * @brief This method initilizes the RDNA with the provided host, port, cipher specs, cipher salt, proxy settings.
 * It also returns an RDNA object which needs to be used futher when we want to invoke any api of the rdna client.
 */
- (int)initializeRDNAWithCallbackDelegate:(id<RDNAClientCallbacks>)callback {
  
  int errorID = 0;
   // [UserSessionState getSharedInstance].isRDNAIntilized = NO;
    //[UserSessionState getSharedInstance].proxyPort = 0;
    
    clientCallbacks = self;
  rdnaClientCallback = callback;
    RDNA *rdna;
    if ([CLLocationManager locationServicesEnabled] == NO) {
      NSLog(@"locationServicesEnabled false");
      [SuperViewController showErrorWithMessage:@"You currently have all location services for this device disabled" withErrorCode:0];
    } else {
      CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
      if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
        NSLog(@"authorizationStatus failed");
      } else {
        RDNAProxySettings *ppxy = nil;
       
        NSString *path = [[NSBundle mainBundle] pathForResource:@"clientcert" ofType:@"p12"];
        NSData *certData = [NSData dataWithContentsOfFile:path];
        NSString *certString3 = [certData base64EncodedStringWithOptions:2];
        NSString *certPassword = @"your password";
        RDNASSLCertificate *rdnaSSLlCertificate = [[RDNASSLCertificate alloc]init];
        rdnaSSLlCertificate.p12Certificate = certString3;
        rdnaSSLlCertificate.password = certPassword;
        
        
        errorID = [RDNA initialize:&rdna AgentInfo:kRdnaAgentID Callbacks:clientCallbacks GatewayHost:kRdnaHost GatewayPort:kRdnaPort CipherSpec:kRdnaCipherSpecs CipherSalt:kRdnaCipherSalt ProxySettings:ppxy RDNASSLCertificate:nil DNSServerList:nil RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
        rdnaObject = rdna;
      }
    }
  
  return errorID;
}

/**
 * @brief This method is used to pause the rdna client execution.
 * In return it provides an context object which should be saved in the client and used when user wants to resume the
 * rdna client execution.
 * The resume API should be used in cases when user moves the app from foreground to background.
 */
- (int)pauseRDNA {
  
  NSMutableData *SavedContext;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setValue:nil forKey:@"sContext"];
  int errPauseRuntime = [rdnaObject pauseRuntime:&SavedContext];
  [defaults setValue:SavedContext forKey:@"sContext"];
  return errPauseRuntime;
}

/**
 * @brief This method is used to resume the rdna client execution.
 * The savd context that is obtained in the pause API should be passed in the resume API
 */
- (int)resumeRDNA {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSData *savedContextData = [defaults valueForKey:@"sContext"];
  int errResumeRuntime = 0;
  if (savedContextData.length>0) {
    RDNA *dna;
    RDNAProxySettings *ppxy = nil;
    errResumeRuntime = [RDNA resumeRuntime:&dna SavedState:savedContextData Callbacks:clientCallbacks ProxySettings:ppxy RDNALoggingLevel:RDNA_NO_LOGS AppContext:self];
    rdnaObject = dna;
  }
  return errResumeRuntime;
}

/**
 * @brief This method is used to terminate the rdna client execution.
 */
- (int)terminateRDNAWithCallbackDelegate:(id<RDNAClientCallbacks>)_terminateCallback {
  
  NSLog(@"coming inside terminateRDNA");
  rdnaClientCallback = _terminateCallback;
  int errTerminate = [rdnaObject terminate];
  return errTerminate;
}

/**
 * @brief This method is invoked by RDNA when there is error in retrieving location.
 */
- (int)ShowLocationDailogue {
  
  NSLog(@"Location Callback of client called");
  return 0;
}


- (CLLocationManager *)getLocationManager{
  
  if (locationManagerObject!=nil) {
    return locationManagerObject;
  }else{
    [self initializeLocationManager];
    return locationManagerObject;
  }
}



#pragma mark CallBacks
/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA initialize API is invoked.
 * It returns the RDNAStatusInit class object.
 */
- (int)onInitializeCompleted:(RDNAStatusInit *)status {
  
  NSLog(@"\n\n $$$$$ Notify runtime status of client called reason {%ld : %d} $$$$ \n\n",(long)[RDNA getErrorInfo:status.errCode],status.errCode);
  if (status.errCode == 0) {
    [rdnaObject serviceAccessStartAll];
    [self fetchProxyPort:status.services];
    [RelIDRequestInterceptor applyProxySettingWithHost:kRdnaProxyHost withPort:status.pxyDetails.port];
    self.proxyPort = status.pxyDetails.port;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
     [rdnaClientCallback initialize:status.errCode];
  });
  
  
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA pause API is invoked by the client
 * It returns the RDNAStatusInit class object.
 */
- (int)onPauseRuntime:(RDNAStatusPauseRuntime *)status {
  
  if (status.errCode == 0) {
  }else{
    NSLog(@"Failed to Pause RDNA");
    dispatch_async(dispatch_get_main_queue(), ^{
      [SuperViewController showErrorWithMessage:NSStringFromSelector(_cmd) withErrorCode:status.errCode];
    });
  }
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA resume API is invoked by the client
 * It returns the RDNAStatusInit class object.
 */
- (int)onResumeRuntime:(RDNAStatusResumeRuntime *)status {
  
  if (status.errCode == 0) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:nil forKey:@"sContext"];
  }else{
    NSLog(@"Failed to Resume RDNA");
    dispatch_async(dispatch_get_main_queue(), ^{
      [SuperViewController showErrorWithMessage:NSStringFromSelector(_cmd) withErrorCode:status.errCode];
    });
  }
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA terminate API is invoked by the client
 * It returns the RDNAStatusInit class object.
 * If the errorCode obtained in RDNAStatusTerminate structure is zero then the  rdnaobject should be deallocated.
 */
- (int)onTerminate:(RDNAStatusTerminate *)status {
  
  NSLog(@"coming in onTermintae");
  if (status.errCode == 0) {
    rdnaObject = nil;
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:nil forKey:@"sContext"];
  }else{
    NSLog(@"Failed to terminate RDNA");
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    if (rdnaClientCallback) {
      [rdnaClientCallback terminate:status.errCode];
    }
  });
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA check challenges API is invoked by the client
 * It returns the RDNAStatusCheckChallengesResponse class object.
 */
- (int)onCheckChallengeResponseStatus:(RDNAStatusCheckChallengeResponse *) status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA post login authentication challenges API is invoked by the client
 * It returns the RDNAStatusGetPostLoginChallenges class object.
 */
- (int)onGetPostLoginChallenges:(RDNAStatusGetPostLoginChallenges *)status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA registred device details API is invoked by the client
 * It returns the RDNAStatusGetRegisteredDeviceDetails class object.
 */
- (int)onGetRegistredDeviceDetails:(RDNAStatusGetRegisteredDeviceDetails *)status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA get all challenges API is invoked by the client
 * It returns the RDNAStatusGetAllChallenges class object.
 */
- (int)onGetAllChallengeStatus:(RDNAStatusGetAllChallenges *) status {
  return 1;
}



/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA update challenge(s) API is invoked by the client
 * It returns the RDNAStatusUpdateChallenge class object.
 */
- (int)onUpdateChallengeStatus:(RDNAStatusUpdateChallenges *) status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA update device details API is invoked by the client
 * It returns the RDNAStatusUpdateDeviceDetails class object.
 */
- (int)onUpdateDeviceDetails:(RDNAStatusUpdateDeviceDetails *)status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA forget password API is invoked by the client
 * It returns the RDNAStatusForgotPassword class object.
 */
- (int)onForgotPasswordStatus:(RDNAStatusForgotPassword *)status {
  return 1;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA user logoff API is invoked by the client
 * It returns the RDNAStatusLogOff class object.
 */
- (int)onLogOff: (RDNAStatusLogOff *)status {
  return 1;
}


/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when the RDNA getConfig API is invoked by the client
 * It returns the RDNAStatusGetConfig structure.
 * If the errorCode obtained in RDNAStatusGetConfig class object is zero.
 */
- (int) onConfigReceived:(RDNAStatusGetConfig *)status {
  return 1;
}


/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when web content needs to authentication
 * It returns the RDNAStatusLogOff class object.
 */
- (RDNAIWACreds *)getCredentials:(NSString *)domainUrl {
  return nil;
}

/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when session not valid.
 */
-(int)onSessionTimeout:(NSString*)status{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:kNotificationSessionTimeout object:status];
  });
  return 1;
}


/**
 * @brief This method is an implementation of the RDNACLientCallbacks
 * This method is invoked by the RDNA when nofication device token needed
 */
- (NSString*)getDeviceToken{
  return @"";
}


/**
 * @brief onGetNotifications - Method is called by the API runtime to notify that notification status.
 * @param status                -
 */
- (int)onGetNotifications:(RDNAStatusGetNotifications *)status{
  return 1;
}

/**
 * @brief onUpdateNotification - Method is called by the API runtime to notify that updated notification status.
 * @param status                -
 */
- (int)onUpdateNotification:(RDNAStatusUpdateNotification *)status{
  return 1;
}

- (int)onGetNotificationsHistory:(RDNAStatusGetNotificationHistory *)status{
  return 1;
}

-(int)onSdkLogPrintRequest:(RDNALoggingLevel)level andlogData:(NSString*)logData{
  NSLog(@"\n\n %@",logData);
  return 0;
}
-(int)onSecurityThreat:(NSString*)status{
  dispatch_async(dispatch_get_main_queue(), ^(){
    UIAlertView *threatAlert = [[UIAlertView alloc]initWithTitle:@"Device is not safe." message:status delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
    [threatAlert show];
  });
  
  return 0;
}



/**
 * @brief This method is used to fetch the proxy port on which the RDNA proxy is started and is listening state.
 */
- (void)fetchProxyPort:(NSArray*)serviceArray{
  
  if (serviceArray.count>0) {
    for (int i =0; i<serviceArray.count; i++) {
      RDNAService *service = [serviceArray objectAtIndex:i];
      RDNAPort *rdnaPort = service.portInfo;
      if (rdnaPort.portType == RDNA_PORT_TYPE_PROXY) {
       // UserSessionState *sessionState = [UserSessionState getSharedInstance];
        if ((rdnaPort.port > 0)&&(rdnaPort.isStarted)) {
//sessionState.proxyPort = rdnaPort.port;
//          if (sessionState.proxyPort > 0) {
//            break;
//          }
        }
      }
    }
  }
}

/**
 * @brief This method is used to fetch the currently running services.
 */
- (NSArray *)fetchAllServices {
  
  NSArray *allServiceArray;
  int errorgetAllServiceArray = [rdnaObject getAllServices:&allServiceArray];
  return [allServiceArray copy];
  //  [getAllServiceArray addObjectsFromArray:getAllServiceArray];
  //  return errorgetAllServiceArray;
}

/**
 * @brief This method is used to fetch the application fingerprint.
 */
- (NSString *)getApplicationFingerprint {
  return @"test";
}

/**
 * @brief This method is used to fetch the application varsion.
 */
- (NSString *)getApplicationVersion {
  NSString *version = [RDNA getSDKVersion];
  return version;
}

/**
 * @brief This method is used to fetch the application name.
 */
- (NSString *)getApplicationName {
  NSDictionary *infoDictionary = [[NSBundle mainBundle]infoDictionary];
  NSString *AppName = infoDictionary[(NSString *)kCFBundleNameKey];
  return AppName;
  
}


/**
 * @brief This method is invoked when application is moved into background.
 */
- (void)EnterForeground {
  
  int errorCode = [self resumeRDNA];
  if (errorCode > 0) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [SuperViewController showErrorWithMessage:NSStringFromSelector(_cmd) withErrorCode:errorCode];
    });
  }
}

/**
 * @brief This method is invoked when application is moved into background.
 */
- (void)EnterBackground {
  
  [self pauseRDNA];
}


-(int)RDNAClientOpenHttpConnection:(RDNAHTTPRequest*)req withCallback:(id<RDNAClientCallbacks>)callback{
  rdnaClientCallback = callback;
  int reqID;
  
  int errorCode = [rdnaObject openHttpConnection:req Callbacks:self httpRequestID:&reqID];
  return errorCode;
}

-(int)onHttpResponse:(RDNAHTTPStatus*) status{
  [rdnaClientCallback openHttpResponse:status];
  return 1;
}
@end
