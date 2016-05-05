//
//  RelIDRequestInterceptor.h
//  com.uniken.relid.stock
//
//  Created by Swapnil on 11/30/15.
//  Copyright © 2015 Swapnil. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RelIDRequestInterceptor : NSURLProtocol< NSURLSessionDataDelegate, NSURLSessionTaskDelegate>

+(void)applyProxySettingWithHost :(NSString*)host withPort:(int)port;
@end
