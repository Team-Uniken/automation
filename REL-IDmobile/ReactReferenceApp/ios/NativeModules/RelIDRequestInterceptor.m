//
//  RelIDRequestInterceptor.m
//  com.uniken.relid.stock
//
//  Created by Swapnil on 11/30/15.
//  Copyright © 2015 Swapnil. All rights reserved.
//

#import "RelIDRequestInterceptor.h"

 static NSString *customKey = @"myCustomKey";
static NSString *proxyHost;
static int proxyPort;


@interface RelIDRequestInterceptor(){
  NSURLSessionDataTask *dataTask;
  NSURLResponse *urlResponse;
  NSMutableData *receivedData;
}
@property (nonatomic, strong) NSURLSessionDataTask *dataTask;
//@property (nonatomic, strong) NSURLResponse *urlResponse;
//@property (nonatomic, strong) NSMutableData *receivedData;

@property (nonatomic, strong) NSString *proxyHost;
@property (nonatomic, assign) int proxyPort;
@end


@implementation RelIDRequestInterceptor
@synthesize  dataTask;
+(void)applyProxySettingWithHost :(NSString*)host withPort:(int)port
{
 proxyHost = host;
  proxyPort = port;
   [NSURLProtocol registerClass:[RelIDRequestInterceptor class]];
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request{
  
  if ([NSURLProtocol propertyForKey:customKey inRequest:request] != nil) {
    return NO;
  }

  return YES;
}


+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request{
  return request;
}



- (void)startLoading{
  
  NSMutableURLRequest *newRequest = [self.request mutableCopy];
  NSLog(@"\n\n\n URL== %@\n\n\n",newRequest.URL.absoluteString);
  [NSURLProtocol setProperty:@"true" forKey:customKey inRequest:newRequest];
 
  NSURLSessionConfiguration *configObj = nil;
  
  if (proxyHost != nil && proxyPort != 0) {
    // Create a NSURLSession with our proxy aware configuration
    configObj = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    configObj.connectionProxyDictionary = [RelIDRequestInterceptor getProxySettingConfiguration];
    
  }else{
    configObj = [NSURLSessionConfiguration defaultSessionConfiguration];
  }
  NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration:configObj delegate:self delegateQueue:nil];
  self.dataTask = [defaultSession dataTaskWithRequest:newRequest];
  [self.dataTask resume];
  
}

- (void)stopLoading{
  [self.dataTask cancel];
  self.dataTask       = nil;
//  self.receivedData   = nil;
//  self.urlResponse    = nil;
}

// MARK: NSURLSessionDataDelegate

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler{
 
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];

//  self.urlResponse = response;
//  self.receivedData = [NSMutableData data];
  
  completionHandler(NSURLSessionResponseAllow);
  
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data{
  
  [self.client URLProtocol:self didLoadData:data];
 
//  if(self.receivedData){
//    [self.receivedData appendData:data];
//  }
  
}

 // MARK: NSURLSessionTaskDelegate

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
didCompleteWithError:(nullable NSError *)error{
  if (error != nil && error.code != NSURLErrorCancelled) {
    if (self.client) {
      [self.client URLProtocol:self didFailWithError:error];
    }
  }else {
    [self.client URLProtocolDidFinishLoading:self];
  }
  
}

+(NSDictionary*) getProxySettingConfiguration{

  NSDictionary *proxyDict = @{
                              @"HTTPEnable"  : [NSNumber numberWithInt:1],
                              (NSString *)kCFStreamPropertyHTTPProxyHost  : proxyHost,
                              (NSString *)kCFStreamPropertyHTTPProxyPort  : [NSNumber numberWithInt:proxyPort],
                              
                              @"HTTPSEnable" : [NSNumber numberWithInt:1],
                              (NSString *)kCFStreamPropertyHTTPSProxyHost : proxyHost,
                              (NSString *)kCFStreamPropertyHTTPSProxyPort : [NSNumber numberWithInt:proxyPort],
                              };

  
  return proxyDict;
}
@end
