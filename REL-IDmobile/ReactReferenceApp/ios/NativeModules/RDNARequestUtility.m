//
//  RDNARequestUtility.m
//  ReactReferenceAPP
//
//  Created by Sudarshan on 2/18/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RDNARequestUtility.h"
#import <RCTLog.h>
#import "RCTBridge.h"
#import <RCTConvert.h>
#import "RCTEventDispatcher.h"
#import "RelIDRequestInterceptor.h"
#import <SystemConfiguration/SCNetworkReachability.h>

RCTBridge *_Nullable localbridgeDispatcher;

@interface RDNARequestUtility(){
  NSString *proxyHost;
  uint16_t proxyPort;
  BOOL isRDNAIntilized;
}

@end

@implementation RDNARequestUtility

@synthesize  bridge = _bridge;


RCT_EXPORT_MODULE();

NSString *const kerrorparam = @"error";
NSString *const kLocalProxyHost = @"127.0.0.1";

static RDNARequestUtility *requestUtility;


RCT_EXPORT_METHOD (setHttpProxyHost:(NSString *)host
                   andHttpProxyPort:(int)port
                   reactCallBack:(RCTResponseSenderBlock)callback){
  if (host.length>0) {
    proxyHost = host;
  }
  if (port>0) {
    proxyPort = (uint16_t)port;
  }
  isRDNAIntilized = YES;
  [RelIDRequestInterceptor applyProxySettingWithHost:proxyHost withPort:proxyPort];
  [NSURLProtocol registerClass:[RelIDRequestInterceptor class]];

}

RCT_EXPORT_METHOD (doHTTPGetRequest:(NSString *)url
                   reactCallBack:(RCTResponseSenderBlock)callback){

 __block int errorID = 0;

  if ([self isNetworkAvailable]) {

    NSURL *URL = [NSURL URLWithString:url];
    uint16_t pPort = proxyPort;
    NSURLSessionConfiguration *configuration;
    /** Here we configure the proxy settings if applicable**/
    if ((pPort>0)&&(isRDNAIntilized)) {
      NSString* localProxyHost = proxyHost; //Local loopback for proxy host
      NSNumber* localProxyPort = [NSNumber numberWithInt: pPort]; //proxy port
      NSDictionary *proxyDict = @{(NSString *)kCFStreamPropertyHTTPProxyHost  : localProxyHost,
                                  (NSString *)kCFStreamPropertyHTTPProxyPort  : localProxyPort,
                                  };
      configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
      configuration.connectionProxyDictionary = proxyDict;
    }else{
      configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    }
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:nil delegateQueue:[NSOperationQueue mainQueue]];
    NSMutableURLRequest *request1 = [NSMutableURLRequest requestWithURL:URL];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request1 completionHandler: ^(NSData *data, NSURLResponse *response, NSError *error) {
      if (data.length>0) {
        NSString* responseString;
        responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
          errorID =0;
          NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":responseString};
          NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
          callback(@[responseArray]);
      }else{
        errorID = 1;
        NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":@"The request timed out"};
        NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
        callback(@[responseArray]);
      }
    }];
    [task resume];
  }else{
    errorID = 1;
    NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":@"Please check your network connection"};
    NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    callback(@[responseArray]);
  }
}


RCT_EXPORT_METHOD (doHTTPPostRequest:(NSString *)url
                   GatewayHost:(NSDictionary *)params
                   reactCallBack:(RCTResponseSenderBlock)callback){
   __block int errorID = 0;
  
  if ([self isNetworkAvailable]) {
    NSString *urlString = [NSString stringWithFormat:@"%@",url];
    
    NSArray *key = [params allKeys];
    NSArray *values = [params allValues];
    NSMutableString *paramsValue = [[NSMutableString alloc]init];
    for (int i =0; i<[key count]; i++) {
      NSString *str = [NSString stringWithFormat:@"%@=%@&",[key objectAtIndex:i],[values objectAtIndex:i]];
      [paramsValue appendString:str];
    }
    NSString *ParamString = [paramsValue substringToIndex:(paramsValue.length -1)];
    uint16_t pPort = proxyPort;
    NSURLSessionConfiguration *configuration;
    /** Here we configure the proxy settings if applicable**/
    if ((pPort>0)&&(isRDNAIntilized)) {
      NSString* localProxyHost = proxyHost; //Local loopback for proxy host
      NSNumber* localProxyPort = [NSNumber numberWithInt: pPort]; //proxy port
      NSDictionary *proxyDict = @{(NSString *)kCFStreamPropertyHTTPProxyHost  : localProxyHost,
                                  (NSString *)kCFStreamPropertyHTTPProxyPort  : localProxyPort,
                                  };
      configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
      configuration.connectionProxyDictionary = proxyDict;
    }else{
      configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    }
    NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: configuration delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
    NSMutableURLRequest * urlRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    
    [urlRequest setHTTPMethod:@"POST"];
    [urlRequest setHTTPBody:[ParamString dataUsingEncoding:NSUTF8StringEncoding]];
    
    NSURLSessionDataTask * dataTask =[defaultSession dataTaskWithRequest:urlRequest
                                                       completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                                                         if (data.length>0) {
                                                           NSString* responseString;
                                                           responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                                                           errorID =0;
                                                           NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":responseString};
                                                           NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
                                                           callback(@[responseArray]);
                                                           
                                                         }else{
                                                           errorID = 1;
                                                           NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":@"The request timed out"};
                                                           NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
                                                           callback(@[responseArray]);
                                                         }
                                                         
                                                       }];
    [dataTask resume];
  }else{
    errorID = 1;
    NSDictionary *dictionary = @{@"error":[NSNumber numberWithInt:errorID],@"response":@"Please check your network connection"};
    NSArray *responseArray = [[NSArray alloc]initWithObjects:dictionary, nil];
    callback(@[responseArray]);
  }
  
}


- (BOOL)isNetworkAvailable
{
//  CFNetDiagnosticRef dReference;
//  dReference = CFNetDiagnosticCreateWithURL (kCFAllocatorDefault, (__bridge CFURLRef)[NSURL URLWithString:@"www.apple.com"]);
//  
//  CFNetDiagnosticStatus status;
//  status = CFNetDiagnosticCopyNetworkStatusPassively (dReference, NULL);
//  
//  CFRelease (dReference);
//  
//  if ( status == kCFNetDiagnosticConnectionUp )
//  {
//    NSLog (@"Connection is Available");
//    return YES;
//  }
//  else
//  {
//    NSLog (@"Connection is down");
//    return NO;
//  }
  SCNetworkReachabilityFlags flags;
  SCNetworkReachabilityRef address;
  address = SCNetworkReachabilityCreateWithName(NULL, "www.apple.com" );
  Boolean success = SCNetworkReachabilityGetFlags(address, &flags);
  CFRelease(address);
  
  bool canReach = success
  && !(flags & kSCNetworkReachabilityFlagsConnectionRequired)
  && (flags & kSCNetworkReachabilityFlagsReachable);
  
  return canReach;
}

@end
