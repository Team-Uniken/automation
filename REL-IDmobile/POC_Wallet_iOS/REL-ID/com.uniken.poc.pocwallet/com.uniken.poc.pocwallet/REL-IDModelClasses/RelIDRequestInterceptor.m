//
//  RelIDRequestInterceptor.m
//  com.uniken.relid.stock
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//


#import "RelIDRequestInterceptor.h"

static NSString *customKey = @"myCustomKey";
static NSString *proxyHost;
static int proxyPort;

static float reqCount = 0;
static float stopCount = 0;
UIProgressView* g_pProgressView = nil;

@interface RelIDRequestInterceptor(){
  NSURLSessionDataTask *dataTask;
  NSURLResponse *urlResponse;
  NSMutableData *receivedData;
}
@property (nonatomic, strong) NSURLSessionDataTask *dataTask;
@property (nonatomic, strong) NSString *proxyHost;
@property (nonatomic, assign) int proxyPort;
@property (nonatomic, retain) NSMutableData *dataToDownload;
@property (nonatomic) float downloadSize;
@end


@implementation RelIDRequestInterceptor
@synthesize  dataTask;
+ (void)applyProxySettingWithHost:(NSString*)host withPort:(int)port
{
  proxyHost = host;
  proxyPort = port;
}

+(void) setProgressView: (UIProgressView*) view
{
  g_pProgressView = view;
}

+ (BOOL)canInitWithRequest: (NSURLRequest *)request{
  
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
  [NSURLProtocol setProperty:@"true" forKey:customKey inRequest:newRequest];
  
  NSURLSessionConfiguration *configObj = nil;
  
  if (proxyHost != nil && proxyPort != 0) {
    // Create a NSURLSession with our proxy aware configuration
    configObj = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    configObj.connectionProxyDictionary = [RelIDRequestInterceptor getProxySettingConfiguration];
    
  }else{
    configObj = [NSURLSessionConfiguration defaultSessionConfiguration];
  }
  configObj.HTTPCookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
  configObj.HTTPMaximumConnectionsPerHost = 8;
  NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration:configObj delegate:self delegateQueue:nil];
  self.dataTask = [defaultSession dataTaskWithRequest:newRequest];
  [self.dataTask resume];
  reqCount = reqCount + 1;
  
}


- (void)stopLoading{
  stopCount = stopCount + 1;
  float doneCount = stopCount/reqCount;
  dispatch_async(dispatch_get_main_queue(), ^{
    g_pProgressView.progress = doneCount;
  });
  if (reqCount == stopCount) {
    reqCount = 0;
    stopCount = 0;
  }
  [self.dataTask cancel];
  self.dataTask       = nil;
}

// MARK: NSURLSessionDataDelegate

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler{
  //  dispatch_async(dispatch_get_main_queue(), ^{
  //    g_pProgressView.progress=0.0f;
  //  });
  _downloadSize=[response expectedContentLength];
  _dataToDownload=[[NSMutableData alloc]init];
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
  
  completionHandler(NSURLSessionResponseAllow);
  
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data{
  [_dataToDownload appendData:data];
  //  dispatch_async(dispatch_get_main_queue(), ^{
  //   g_pProgressView.progress=[ _dataToDownload length ]/_downloadSize;
  //  });
  [self.client URLProtocol:self didLoadData:data];
  
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


- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
willPerformHTTPRedirection:(NSHTTPURLResponse *)response
        newRequest:(NSURLRequest *)request
 completionHandler:(void (^)(NSURLRequest * __nullable))completionHandler{
  
  [self.client URLProtocol:self wasRedirectedToRequest:request redirectResponse:response];
  completionHandler(request);
}

+ (NSDictionary *)getProxySettingConfiguration{
  // Create an NSURLSessionConfiguration that uses the proxy
  
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
