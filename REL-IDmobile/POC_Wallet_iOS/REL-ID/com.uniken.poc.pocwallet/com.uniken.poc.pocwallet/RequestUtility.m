//  com.uniken.poc.pocwallet
//
//  Created by Sudarshan on 12/14/17.
//  Copyright © 2017 Uniken. All rights reserved.
//
#import "RequestUtility.h"
#import "Reachability.h"
#import "AppDelegate.h"
#import "RelIDRequestInterceptor.h"

@implementation RequestUtility
NSString *const kBaseUrl = @"http://poc5-uniken.com:8080/DummyWalletAPI2/";
NSString *const kAddAmount = @"balance";
NSString *const kRegister = @"register";
NSString *const kUpdate = @"update";
NSString *const kLogin = @"login";


+ (RequestUtility *)sharedRequestUtility {
  __strong static RequestUtility *httpRequestUtility = nil;
  static dispatch_once_t onceToken1;
  dispatch_once(&onceToken1, ^{
    httpRequestUtility = [[self alloc] init];
  });
  return httpRequestUtility;
}


-(void)doPostRequestfor:(NSString*)url withParameters:(NSDictionary*)params onComplete:(void (^)(bool status, NSDictionary  *response))completionBlock{
  if(self.isProxy){
  if ([self isNetworkAvailable]) {
    NSString *urlString = [NSString stringWithFormat:@"%@%@",kBaseUrl,url];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    configuration.protocolClasses = @[[RelIDRequestInterceptor class]];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]
                                                           cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                       timeoutInterval:60.0];
    
    [request addValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    
//    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
//    [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setHTTPMethod:@"POST"];
    
    if (params.count>0) {
      NSArray *allkeys = [params allKeys];
      NSArray *allValues = [params allValues];
      NSMutableString *str = [[NSMutableString alloc]init];
      for (int i =0; i<allkeys.count; i++) {
        NSString *temp = [NSString stringWithFormat:@"%@=%@&",[allkeys objectAtIndex:i],[allValues objectAtIndex:i]];
        [str appendString:temp];
        
      }
    NSString  *paramStr = [str substringToIndex:[str length]-1];
      
//      NSError *err;
//      NSData *postData = [NSJSONSerialization dataWithJSONObject:params options:0 error:&err];
//      [request setHTTPBody:postData];
      [request setHTTPBody:[paramStr dataUsingEncoding:NSUTF8StringEncoding]];
    }
    
    NSURLSessionDataTask *postDataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
      if (data.length>0) {
        NSString* responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"\n\n\n The reponse from server is : %@ \n\n", responseString);
        NSDictionary* responseDictionary = [NSJSONSerialization JSONObjectWithData:data
                                                                           options:kNilOptions
                                                                             error:&error];
        completionBlock(YES,responseDictionary);
        
      }else{
        NSMutableDictionary* responseDictionary = [[NSMutableDictionary alloc]init];
        [responseDictionary setValue:@"The request timed out" forKey:@"error"];
        completionBlock(NO,responseDictionary);
      }
    }];
    
    [postDataTask resume];
  }else{
    
    [[NSNotificationCenter defaultCenter] postNotificationName:@"showNetworkAlert"
                                                        object:nil];
    completionBlock(NO,nil);
  }
  }else{
    [self doPostRequestfromRelID:url withParameters:params onComplete:completionBlock];
  }
}


-(void)doPostRequestfromRelID:(NSString*)url withParameters:(NSDictionary*)params onComplete:(void (^)(bool status, NSDictionary  *response))completionBlock{
  
  self.block = completionBlock;
  
  if ([self isNetworkAvailable]) {
    NSString *urlString = [NSString stringWithFormat:@"%@%@",kBaseUrl,url];
    if (params.count>0) {
      NSArray *allkeys = [params allKeys];
      NSArray *allValues = [params allValues];
      NSMutableString *str = [[NSMutableString alloc]init];
      for (int i =0; i<allkeys.count; i++) {
        NSString *temp = [NSString stringWithFormat:@"%@=%@&",[allkeys objectAtIndex:i],[allValues objectAtIndex:i]];
        [str appendString:temp];
        
      }
      NSString  *paramStr = [str substringToIndex:[str length]-1];
    
    RDNAHTTPRequest *req = [[RDNAHTTPRequest alloc]init];
    req.method = RDNA_HTTP_POST;
    req.url = urlString;
    
    NSDictionary *headerDict = @{
                                 @"Content-Type":@"application/x-www-form-urlencoded",
                                 };
      req.headers = headerDict;
      req.body = [paramStr dataUsingEncoding:NSUTF8StringEncoding];
    AppDelegate *appDel = (AppDelegate*) [UIApplication sharedApplication].delegate;
    
      int errorCode =  [appDel.rdnaclient RDNAClientOpenHttpConnection:req withCallback:self];
      
      if (errorCode>0) {
        NSMutableDictionary* responseDictionary = [[NSMutableDictionary alloc]init];
        [responseDictionary setValue:@"The request timed out" forKey:@"error"];
        [responseDictionary setValue:@"errorcode" forKey:[NSString stringWithFormat:@"%d",errorCode]];
        completionBlock(NO,responseDictionary);
      }
      
    }
      
    }
  
}

-(void)openHttpResponse:(RDNAHTTPStatus*)response{
  
  NSError *error;
  if (response.response.body>0) {
    NSString* responseString = [[NSString alloc] initWithData:response.response.body encoding:NSUTF8StringEncoding];
   // responseString = [responseString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    NSLog(@"\n\n\n The reponse from server is : %@ \n\n", responseString);
    NSDictionary* responseDictionary = [NSJSONSerialization JSONObjectWithData:response.response.body
                                                                       options:NSJSONReadingAllowFragments
                                                                         error:&error];
    self.block(YES,responseDictionary);
    
  }else{
    NSMutableDictionary* responseDictionary = [[NSMutableDictionary alloc]init];
    [responseDictionary setValue:@"The request timed out" forKey:@"error"];
     [responseDictionary setValue:@"errorcode" forKey:[NSString stringWithFormat:@"%d",response.errorCode]];
    self.block(NO,responseDictionary);
  }
}

- (BOOL)isNetworkAvailable
{
    Reachability *reachability = [Reachability reachabilityForInternetConnection];
    
    NetworkStatus networkStatus = [reachability currentReachabilityStatus];
    
    return !(networkStatus == NotReachable);
  
}



@end
