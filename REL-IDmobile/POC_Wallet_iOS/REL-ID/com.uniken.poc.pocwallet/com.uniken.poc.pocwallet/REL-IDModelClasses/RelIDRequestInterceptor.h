//
//  RelIDRequestInterceptor.h
//  com.uniken.relid.stock
//
//  Created by Uniken India pvt ltd.
//  Copyright © 2015 Uniken India pvt ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@interface RelIDRequestInterceptor : NSURLProtocol< NSURLSessionDataDelegate, NSURLSessionTaskDelegate>
+ (void)applyProxySettingWithHost:(NSString *)host withPort:(int)port;
+(void) setProgressView: (UIProgressView*) view;
@end
